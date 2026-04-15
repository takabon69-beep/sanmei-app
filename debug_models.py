import os
from google import genai
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
api_key = os.getenv("GEMINI_API_KEY")

if not api_key or "あなたの" in api_key:
    print("APIキーが設定されていません。")
else:
    client = genai.Client(api_key=api_key)
    print("利用可能なモデルを一覧表示します:")
    try:
        for model in client.models.list():
            print(f"Model: {model}")
    except Exception as e:
        print(f"エラー: {e}")
