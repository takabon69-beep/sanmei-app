import json
import os
import re
from datetime import datetime
from google import genai
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))
api_key = os.getenv("GEMINI_API_KEY")

class NoteContentGenerator:
    """
    Gemini APIを使用して、キーワードからnoteの記事内容を自動生成・管理するクラス。
    """
    def __init__(self, topic=None):
        self.topic = topic
        self.title = ""
        self.content = ""
        self.tags = []
        self.meta_description = ""
        self.focus_keyphrase = ""
        self.slug = ""
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.temp_file = os.path.join(self.base_dir, "temp_note_content.json")
        
        # モデル候補のリスト (デバッグで確認された順)
        self.model_candidates = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest']
        
        if api_key and api_key != "あなたのAPIキーをここに貼り付けてください":
            # APIバージョンを v1 に固定して安定性を高める
            self.client = genai.Client(api_key=api_key, http_options={'api_version': 'v1'})
        else:
            self.client = None

    def _generate_with_fallback(self, prompt):
        """
        複数のモデル候補を順に試行してコンテンツを生成する。
        """
        last_error = None
        for model_name in self.model_candidates:
            try:
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                return response.text
            except Exception as e:
                if "404" in str(e) or "not found" in str(e).lower():
                    last_error = e
                    continue
                else:
                    raise e
        raise last_error if last_error else Exception("すべてのモデル候補で生成に失敗しました。")

    def _get_app_context_prompt(self):
        """
        app_context.json から背景情報プロンプトを生成する。
        """
        context_file = os.path.join(self.base_dir, "app_context.json")
        if not os.path.exists(context_file):
            return ""
        
        try:
            with open(context_file, "r", encoding="utf-8") as f:
                ctx = json.load(f)
            
            prompt = "\n【執筆の背景・記憶情報】\n"
            prompt += f"- ターゲット読者: {ctx.get('target_audience', '')}\n"
            prompt += f"- コアコンセプト: {ctx.get('core_concept', '')}\n"
            prompt += "- 活用すべき理論/知識:\n"
            for theory in ctx.get('theories', []):
                prompt += f"  * {theory}\n"
            prompt += f"- 執筆スタイル: {ctx.get('writing_style', '')}\n"
            return prompt
        except:
            return ""

    def generate_titles(self, keywords):
        """
        キーワードから5つのタイトル案を提案する。
        """
        if not self.client:
            print("エラー: APIキーが設定されていません。")
            return []

        context_prompt = self._get_app_context_prompt()
        prompt = f"""
        以下のキーワードに基づいて、note.comで読者の興味を惹きつける魅力的な記事タイトルを5案提案してください。
        {context_prompt}
        
        キーワード: {keywords}
        
        回答は以下のJSON形式の純粋なテキストのみを返してください：
        {{
            "titles": ["案1", "案2", "案3", "案4", "案5"]
        }}
        """
        try:
            text = self._generate_with_fallback(prompt)
            
            # JSON部分の抽出
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end != -1:
                text = text[start:end]
            
            # 制御文字によるパースエラーを回避するため strict=False を指定
            data = json.loads(text, strict=False)
            return data.get("titles", [])
        except Exception as e:
            print(f"タイトル生成中にエラー: {e}")
            return []

    def generate_full_content(self, selected_title):
        """
        選択されたタイトルに基づいて、本文と推奨タグを生成する。
        """
        if not self.client:
            return False

        context_prompt = self._get_app_context_prompt()
        prompt = f"""
        タイトル: 「{selected_title}」
        
        このタイトルに基づいて、note.comに投稿するための詳細な記事を作成してください。
        {context_prompt}
        
        【執筆要件】
        1. **文字数は 4,700文字〜5,300文字 の範囲を【絶対厳守】すること**。
           - 以下の構成案に基づき、各セクションの分量を調整して合計を5,000文字前後に収めてください。
           - 導入: 約500文字
           - 第1章〜第4章: 各約1,000文字 × 4 = 約4,000文字
           - まとめ・結び: 約500文字
           - 合計で5,300文字を超えることは【禁止】です。
        2. **ファクトチェックの厳行**: 主要な主張、データ、引用、科学的根拠については、生成プロセスにおいてAI自身で再確認（セルフファクトチェック）を行ってください。必要に応じて信頼できる情報源を示唆してください。
        3. マークダウン形式を使用し、適切な見出し（##, ###）を入れる。
           特にスマートフォンで読むことを前提に、300〜500文字程度ごとに小見出しを入れ、視覚的なリズムを作ってください。
        4. 専門用語を使いつつ、ビジネスや日常に即した分かりやすい例えを用いる。
        5. 読者の悩みに寄り添い、具体的な「最初の一歩」を提示する。
        6. 関連するハッシュタグ（タグ）を10個程度提案する。
        7. SEO用のメタデータ（メタディスクリプション、フォーカスキーフレーズ、スラッグ）を作成する。
           - メタディスクリプション: 120-160文字程度の要約。
           - フォーカスキーフレーズ: 記事がターゲットとする主要な検索キーワード。
           - スラッグ: 記事のURL用（半角英数字とハイフンのみ）。
        
        回答は以下の形式の純粋なJSONテキストのみで返してください：
        {{
            "content": "本文（マークダウン形式）",
            "tags": ["タグ1", "タグ2", ...],
            "meta_description": "メタディスクリプションの内容",
            "focus_keyphrase": "フォーカスキーフレーズ",
            "slug": "url-slug-example"
        }}
        """
        try:
            text = self._generate_with_fallback(prompt)
            
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end != -1:
                text = text[start:end]
                
            # 制御文字（改行の不備など）によるエラーを回避するため strict=False を適用
            result = json.loads(text, strict=False)
            self.title = selected_title
            self.content = result.get("content", "")
            self.tags = result.get("tags", [])
            self.meta_description = result.get("meta_description", "")
            self.focus_keyphrase = result.get("focus_keyphrase", "")
            self.slug = result.get("slug", "")
            return True
        except Exception as e:
            print(f"本文生成中にエラー: {e}")
            if 'text' in locals():
                print(f"デバッグ(先頭100文字): {text[:100]}...")
            return False

    def set_content(self, title, content, tags=None, meta_description="", focus_keyphrase="", slug=""):
        self.title = title
        self.content = content
        self.tags = tags if tags else []
        self.meta_description = meta_description
        self.focus_keyphrase = focus_keyphrase
        self.slug = slug

    def save_temp(self):
        data = {
            "title": self.title,
            "content": self.content,
            "tags": self.tags,
            "meta_description": self.meta_description,
            "focus_keyphrase": self.focus_keyphrase,
            "slug": self.slug
        }
        with open(self.temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        # マークダウン形式でも保存
        self.save_markdown()

    def save_markdown(self):
        """
        記事を日付とタイトルを含めたマークダウン形式で保存する。
        """
        if not self.title or not self.content:
            return

        # 日付の取得 (YYYYMMDD)
        date_str = datetime.now().strftime("%Y%m%d")
        
        # 保存用ディレクトリの作成
        articles_dir = os.path.join(self.base_dir, "articles")
        if not os.path.exists(articles_dir):
            os.makedirs(articles_dir)

        # ファイル名に使用できない文字を置換
        safe_title = re.sub(r'[\\/:*?"<>|]', '_', self.title)
        filename = f"{date_str}_{safe_title}.md"
        filepath = os.path.join(articles_dir, filename)

        # マークダウン内容の構築
        md_content = f"""# {self.title}

生成日時: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
タグ: {', '.join(self.tags)}
メタディスクリプション: {self.meta_description}
フォーカスキーフレーズ: {self.focus_keyphrase}
スラッグ: {self.slug}

---

{self.content}
"""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(md_content)
        print(f"\n[作成完了] マークダウンファイルを保存しました: {filename}")

    def load_temp(self):
        if os.path.exists(self.temp_file):
            try:
                with open(self.temp_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except:
                return None
        return None
