from playwright.sync_api import sync_playwright
import time
import os
import pyperclip

class NotePoster:
    """
    noteへの投稿操作（Playwright）を担当するクラス。
    """
    def __init__(self):
        self.url_login = "https://note.com/login"
        self.url_new_note = "https://note.com/notes/new"

    def run_post_flow(self, title, content, tags=None):
        """
        ブラウザを起動し、ログイン待機、タイトル・本文入力、タグ入力、下書き保存を行う。
        """
        if tags is None:
            tags = []
        with sync_playwright() as p:
            # ブラウザを通常起動（headless=False でユーザーが操作できるように）
            browser = p.chromium.launch(headless=False)
            context = browser.new_context()
            page = context.new_page()

            print("\n" + "="*50)
            print("【手順】")
            print("1. 立ち上がったブラウザでnoteにログインしてください。")
            print("2. ログインが完了し、トップページや自分のページが表示されたら、")
            print("   このターミナル（黒い画面）に戻って【Enterキー】を押してください。")
            print("="*50 + "\n")
            
            page.goto(self.url_login)
            
            # ログイン完了を自動検知
            print("ログイン完了を自動検知しています。ブラウザでログイン操作を行ってください...")
            login_detected = False
            selectors_after_login = [
                'button[aria-label="画像・動画を投稿"]',
                '.p-nav-userMenu', # ユーザーメニュー
                'a[href="/notes/new"]', # 投稿ボタン
                '.l-header' # ヘッダー全体
            ]
            
            for _ in range(300): # 最大5分間待機
                if "note.com/login" not in page.url and any(page.is_visible(s) for s in selectors_after_login):
                    print("ログインを検知しました！")
                    login_detected = True
                    # ログイン直後のリダイレクトが落ち着くまで少し待機
                    time.sleep(3)
                    break
                time.sleep(1)
            
            if not login_detected:
                print("タイムアウトまたは自動検知に失敗しました。")
                input("ログイン完了後、この画面に戻って Enter を押してください...")
            
            # 記事作成画面への遷移（リトライ機能付き）
            print("記事作成画面へ遷移します...")
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    # ネットワークが落ち着くまで待機するオプションを追加
                    page.goto(self.url_new_note, wait_until="load", timeout=30000)
                    time.sleep(3)
                    break
                except Exception as e:
                    print(f"遷移試行 {attempt + 1} 回目失敗: {e}")
                    if attempt < max_retries - 1:
                        time.sleep(2)
                    else:
                        print("遷移に失敗しました。手動で操作を継続してください。")

            print(f"タイトルを入力中: {title}")
            try:
                # 複数の可能性のあるセレクタで試行
                title_selectors = [
                    'textarea[placeholder="タイトル"]',
                    '.note-common-editor__title textarea',
                    'textarea.note-common-editor__title'
                ]
                success_title = False
                for selector in title_selectors:
                    if page.is_visible(selector):
                        page.fill(selector, title)
                        success_title = True
                        break
                if not success_title:
                    print("タイトル欄が見つかりませんでした。スキップします。")
            except Exception as e:
                print(f"タイトル入力中にエラー: {e}")

            print("本文を入力中...")
            try:
                # 本文エディタ (ProseMirror) の操作
                # エディタのクラス名は変更される可能性があるため、より一般的なものを探す
                editor_selectors = [
                    '.note-common-editor__editor',
                    '.ProseMirror',
                    '[role="textbox"]'
                ]
                success_content = False
                for selector in editor_selectors:
                    if page.is_visible(selector):
                        print(f"エディタが見つかりました ({selector})。貼り付けを開始します...")
                        page.click(selector)
                        time.sleep(1) # フォーカス待ち
                        
                        # クリップボードにコピー
                        pyperclip.copy(content)
                        
                        # 貼り付けを実行 (Windows/LinuxはControl、MacはMetaだが、ユーザー環境に合わせる)
                        # PlaywrightはControlキーをサポートしている
                        page.keyboard.press("Control+V")
                        
                        print("貼り付けを完了しました。反映を待機中...")
                        time.sleep(5) # 反映待ち
                        
                        success_content = True
                        break
                if not success_content:
                    print("本文エリアが見つかりませんでした。")
            except Exception as e:
                print(f"本文入力中にエラー: {e}")

            print("保存処理を確認中...")
            time.sleep(2)
            
            # 「下書き保存」ボタンのクリック
            save_button_selectors = [
                'button:has-text("下書き保存")',
                '[data-testid="notes-new-draft-save"]',
                '.p-noteEditor__saveButton'
            ]
            
            success_save = False
            for selector in save_button_selectors:
                btn = page.locator(selector).first
                if btn.is_visible():
                    btn.click()
                    print("「下書き保存」をクリックしました。")
                    success_save = True
                    break
            
            if not success_save:
                print("下書き保存ボタンが自動で見つかりませんでした。手動で「下書き保存」を押してください。")

            # タグの入力 (noteのエディタ下部にあることが多い)
            if tags:
                print(f"タグを入力中: {', '.join(tags)}")
                try:
                    # ハッシュタグ入力エリアを探す
                    tag_input_selectors = [
                        'input[placeholder="ハッシュタグを入力"]',
                        '.note-common-editor__hashtags input',
                        'input.note-editor-hashtag-input'
                    ]
                    for selector in tag_input_selectors:
                        if page.is_visible(selector):
                            for tag in tags:
                                page.fill(selector, tag)
                                page.keyboard.press("Enter")
                                time.sleep(0.5)
                            break
                except Exception as e:
                    print(f"タグ入力中にエラー (スキップします): {e}")

            print("処理を終了します。30秒後にブラウザを閉じます。")
            time.sleep(30)
            browser.close()

if __name__ == "__main__":
    # テスト用
    poster = NotePoster()
    # poster.run_post_flow("テストタイトル", "これは自動投稿のテスト本文です。")
