from playwright.sync_api import sync_playwright
import time
import os
import pyperclip
from dotenv import load_dotenv

class WordPressPoster:
    """
    WordPressへの投稿操作（Playwright）を担当するクラス。
    """
    def __init__(self):
        load_dotenv()
        self.wp_url = os.getenv("WP_URL")
        # URLの末尾のスラッシュを調整
        if isinstance(self.wp_url, str) and self.wp_url.endswith('/'):
            self.wp_url = self.wp_url[:-1]
        
        if self.wp_url:
            self.url_login = f"{self.wp_url}/wp-login.php"
            self.url_new_post = f"{self.wp_url}/wp-admin/post-new.php"
        else:
            self.url_login = ""
            self.url_new_post = ""

    def run_post_flow(self, title, content, tags=None):
        """
        ブラウザを起動し、ログイン待機、タイトル・本文入力、下書き保存を行う。
        """
        if not self.wp_url:
            print("\n[Error] WordPressのURLが設定されていません。.envファイルを確認してください。")
            return

        if tags is None:
            tags = []
            
        browser = None
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=False)
                context = browser.new_context()
                page = context.new_page()

                print("\n" + "="*50)
                print("【手順】")
                print(f"1. 立ち上がったブラウザでWordPressにログインしてください。")
                print("2. ログインが完了し、管理画面（ダッシュボード）が表示されたら、")
                print("   自動的に記事作成画面へ遷移します。")
                print("="*50 + "\n")
                
                page.goto(self.url_login)
                
                # ログイン完了を自動検知
                print("ログイン完了を自動検知しています。ブラウザでログイン操作を行ってください...")
                login_detected = False
                # WordPress管理画面特有のセレクタ
                selectors_after_login = [
                    '#adminmenu',           # サイドメニュー
                    '#wpadminbar',          # 上部バー
                    '.update-nag',          # 更新通知
                    '#dashboard-widgets',   # ダッシュボードウィジェット
                    '.wrap'                 # 一般的な管理画面の外枠
                ]
                
                for _ in range(300): # 最大5分間待機
                    # URLに wp-admin が含まれるか、特定のセレクタが見えたらログインとみなす
                    is_admin_url = "/wp-admin" in page.url and "wp-login.php" not in page.url
                    has_admin_element = any(page.is_visible(s) for s in selectors_after_login)
                    
                    if is_admin_url or has_admin_element:
                        print("ログインを検知しました！")
                        login_detected = True
                        # ログイン直後のリダイレクトが落ち着くまで待機
                        time.sleep(5)
                        break
                    time.sleep(1)
                
                if not login_detected:
                    print("タイムアウトまたは自動検知に失敗しました。")
                    input("ログイン完了後、この画面に戻って Enter を押してください...")
                
                # ログイン後の実際のURLからベースURLを再取得（wwwの有無などを反映）
                current_url = page.url
                if "/wp-admin" in current_url:
                    base_admin_url = current_url.split("/wp-admin")[0] + "/wp-admin"
                    self.url_new_post = f"{base_admin_url}/post-new.php"
                    print(f"ベースURLを調整しました: {base_admin_url}")

                # 記事作成画面への遷移（リトライ機能付き）
                print("記事作成画面へ遷移します...")
                max_retries = 3
                success_navigation = False
                for attempt in range(max_retries):
                    try:
                        # ネットワークの安定を待つ (networkidleは重いサイトでタイムアウトしやすいため load に変更)
                        try:
                            page.goto(self.url_new_post, wait_until="load", timeout=30000)
                        except Exception as e:
                            # タイムアウトや中断されても、URLが正しければ成功とみなす
                            time.sleep(2)
                            if "post-new.php" in page.url or "post.php" in page.url:
                                print("遷移を確認しました（タイムアウト等の警告は無視します）")
                                success_navigation = True
                                break
                            
                            if "interrupted" in str(e).lower() or "aborted" in str(e).lower():
                                print("リダイレクトが発生しました。URLを確認します...")
                            else:
                                raise e
                        
                        time.sleep(3)
                        # post-new.php または post.php (既存/新規作成直後) であれば成功とみなす
                        if "post-new.php" in page.url or "post.php" in page.url:
                            success_navigation = True
                            break
                    except Exception as e:
                        print(f"遷移試行 {attempt + 1} 回目失敗: {e}")
                        if attempt < max_retries - 1:
                            time.sleep(5)
                        else:
                            print("遷移に失敗しました。手動で新規投稿画面を開いてください。")
                
                if not success_navigation:
                    print("投稿画面への遷移を確認できませんでした。処理を中断します。")
                    return

                print("エディタの読み込みを待機しています...")
                # ブロックエディタ(通常/iframe)、またはクラシックエディタのいずれかが現れるまで待機
                try:
                    # iframe内の要素も考慮した複雑な待機 (タイムアウトを少し延長)
                    page.wait_for_function("""
                        () => document.querySelector('.editor-post-title__input, #title') || 
                              (document.querySelector('iframe[name="editor-canvas"]') && 
                               document.querySelector('iframe[name="editor-canvas"]').contentDocument.querySelector('.editor-post-title__input'))
                    """, timeout=30000)
                except:
                    pass

                # タイトルと本文の入力先（iframeかメインページか）を特定
                editor_frame = page.frame(name="editor-canvas")
                target = editor_frame if editor_frame else page

                # タイトル入力
                print(f"タイトルを入力中: {title}")
                try:
                    if target.is_visible('.editor-post-title__input'):
                        target.fill('.editor-post-title__input', title)
                    elif target.is_visible('#title'):
                        target.fill('#title', title)
                    else:
                        # メインページにタイトルがあるか再確認（targetがiframeの場合のみ）
                        if editor_frame and page.is_visible('#title'):
                            page.fill('#title', title)
                        else:
                            print("タイトル欄が見つかりませんでした。手動で入力してください。")
                except Exception as e:
                    print(f"タイトル入力中にエラー: {e}")

                # 本文入力
                print("本文を入力中...")
                try:
                    success_content = False
                    # ブロックエディタの本文エリア
                    content_selector = '.editor-styles-wrapper'
                    if target.is_visible(content_selector):
                        target.click(content_selector)
                        time.sleep(1)
                        pyperclip.copy(content)
                        page.keyboard.press("Control+V")
                        success_content = True
                    # クラシックエディタ (ビジュアル)
                    elif page.is_visible('#content_ifr'):
                        page.focus('#content_ifr')
                        pyperclip.copy(content)
                        page.keyboard.press("Control+V")
                        success_content = True
                    # クラシックエディタ (テキスト)
                    elif page.is_visible('#content'):
                        page.fill('#content', content)
                        success_content = True
                    
                    if success_content:
                        print("本文の貼り付けを完了しました。")
                    else:
                        print("本文エリアが見つかりませんでした。")
                except Exception as e:
                    print(f"本文入力中にエラー: {e}")

                # タグの入力
                if tags:
                    print(f"タグを入力中: {', '.join(tags)}")
                    try:
                        # クラシックエディタのタグ入力
                        if page.is_visible('#new-tag-post_tag'):
                            tag_str = ",".join(tags)
                            page.fill('#new-tag-post_tag', tag_str)
                            page.click('.tagadd')
                        # ブロックエディタのタグ
                        else:
                            print("ブロックエディタのタグ入力は手動で行ってください。")
                    except Exception as e:
                        print(f"タグ入力中にエラー: {e}")

                print("\n" + "="*50)
                print("[完了] WordPressへの流し込みが終わりました。")
                print("内容を確認し、問題なければブラウザ上の「下書き保存」または「公開」を押してください。")
                print("確認が終わりましたら、このコンソール画面に戻って Enter を押して終了してください。")
                print("="*50 + "\n")
                
                input("確認が完了したら Enter を押してブラウザを閉じます...")
                browser.close()

        except Exception as e:
            print(f"\n[Error] 実行中に予期せぬエラーが発生しました: {e}")
            input("\n内容を確認するためブラウザを開いたままにしています。確認後、Enterを押して終了してください...")
            if browser:
                try:
                    browser.close()
                except:
                    pass

if __name__ == "__main__":
    poster = WordPressPoster()
    # poster.run_post_flow("テスト", "本文")


if __name__ == "__main__":
    poster = WordPressPoster()
    # poster.run_post_flow("テスト", "本文")
