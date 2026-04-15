import os
import sys

# 修正後の generator をインポート
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from generator import NoteContentGenerator

def test_generation():
    # キーワードからタイトルを生成
    gen = NoteContentGenerator()
    keywords = "マインドセット, 行動経済学, 生産性向上"
    print(f"キーワード: {keywords} でタイトルを生成中...")
    titles = gen.generate_titles(keywords)
    
    if not titles:
        print("タイトルの生成に失敗しました。")
        return

    selected_title = titles[0]
    print(f"選択されたタイトル: {selected_title}")
    
    # 本文とSEOメタデータを生成
    print("本文とSEOメタデータを生成中（これには時間がかかる場合があります）...")
    success = gen.generate_full_content(selected_title)
    
    if success:
        print("\n--- 生成結果の確認 ---")
        print(f"タイトル: {gen.title}")
        print(f"メタディスクリプション: {gen.meta_description}")
        print(f"フォーカスキーフレーズ: {gen.focus_keyphrase}")
        print(f"スラッグ: {gen.slug}")
        print(f"タグ: {', '.join(gen.tags)}")
        
        # 本文の最初の方を表示して見出しを確認
        print("\n--- 本文の冒頭 (見出しの確認) ---")
        lines = gen.content.split('\n')
        for i, line in enumerate(lines[:20]):
            print(line)
            
        # 保存テスト
        gen.save_temp()
        print(f"\n一時ファイルとマークダウンファイルの保存を確認しました。")
    else:
        print("本文の生成に失敗しました。")

if __name__ == "__main__":
    test_generation()
