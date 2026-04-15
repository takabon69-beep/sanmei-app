import sys
import os

# 自作モジュールのインポート
sys.path.append(os.path.dirname(__file__))
import os
import sys
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))
api_key = os.getenv("GEMINI_API_KEY")

from generator import NoteContentGenerator
from poster import NotePoster
from wp_poster import WordPressPoster

def main():
    print("=== note下書き自動作成ツール ===")
    
    # 実際にはここにAIが生成した内容を流し込む仕組みを作ります
    # 今回は、まずアプリの骨組みとして「一時ファイルから読み込む」か「直接入力」で動くようにします。
    
    print("\n" + "="*50)
    print("=== note下書き自動作成ツール (AI連携版) ===")
    print("="*50)
    
    # APIキー確認
    if not api_key or api_key == "あなたのAPIキーをここに貼り付けてください":
        print("\n[!] Gemini APIキーが設定されていません。")
        print("1. https://aistudio.google.com/app/apikey でキーを取得してください。")
        print(f"2. {os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))} を開き、キーを貼り付けて保存してください。")
        input("\n設定が完了したら、プログラムを再起動してください（Enterで終了）...")
        return

    print("\n[STEP 1] 記事のテーマやキーワードを入力してください。")
    print("例: IKEA効果, ビジネス活用, 顧客満足度")
    user_input = input("テーマ・キーワード: ")
    
    gen = NoteContentGenerator(topic=user_input)
    
    # タイトル案の生成
    print("\nAIがタイトル案を考えています...")
    titles = gen.generate_titles(user_input)
    
    if not titles:
        print("タイトル生成に失敗しました。手動で入力してください。")
        title = input("確定したタイトル: ")
    else:
        print("\nどのタイトルがいいですか？番号で選んでください。")
        for i, t in enumerate(titles, 1):
            print(f"{i}. {t}")
        
        while True:
            try:
                choice = int(input("\n選択 (1-5): "))
                if 1 <= choice <= 5:
                    title = titles[choice-1]
                    break
            except:
                pass
            print("1から5の数字を入力してください。")

    # 本文の生成
    print(f"\n「{title}」に基づいて記事（約5000文字）を執筆しています...")
    print("※生成には30秒〜1分ほどかかる場合があります。少々お待ちください...")
    if gen.generate_full_content(title):
        content = gen.content
        tags = gen.tags
        gen.save_temp()
    else:
        print("記事の生成に失敗しました。")
        content = input("確定した本文 (貼り付け): ")
        tags_input = input("ハッシュタグ (カンマ区切り): ")
        tags = [t.strip() for t in tags_input.split(",") if t.strip()]
        gen.set_content(title, content, tags)
        gen.save_temp()
    
    # データをセット
    gen.set_content(title, content, tags)
    gen.save_temp()
    
    print("\n" + "="*50)
    print("【記事プレビュー】")
    print(f"タイトル: {title}")
    print(f"タグ: {', '.join(tags)}")
    print("-" * 30)
    print(content)
    print("="*50 + "\n")
    
    print("\n" + "="*50)
    print("【投稿先の選択】")
    print("1. note.com (ブラウザ自動操作)")
    print("2. WordPress (ブラウザ操作)")
    
    dest_choice = input("\n投稿先を選択してください (1/2): ")
    
    if dest_choice == "2":
        print("\n[STEP 2] WordPress投稿エンジンを起動します。")
        wp_poster = WordPressPoster()
        try:
            wp_poster.run_post_flow(title, content, tags)
        except Exception as e:
            print(f"\nエラーが発生しました: {e}")
    else:
        print("\n[STEP 2] note投稿エンジンを起動します。")
        print("ブラウザが立ち上がりますので、noteにログインしてください。")
        poster = NotePoster()
        try:
            poster.run_post_flow(title, content, tags)
        except Exception as e:
            print(f"\nエラーが発生しました: {e}")
            print("noteの仕様変更などにより、操作に失敗した可能性があります。")

if __name__ == "__main__":
    main()
