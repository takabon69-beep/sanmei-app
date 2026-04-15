const express = require('express');
const cors = require('cors');
const youtubesearchapi = require('youtube-search-api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 静的ファイルの提供（ビルド後のフロントエンド用）
app.use(express.static(path.join(__dirname, 'dist')));

/**
 * YouTube検索API
 * クエリパラメータ: q (検索キーワード)
 */
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: '検索キーワードを指定してください。' });
    }

    try {
        console.log(`Searching for: ${query}`);
        // 最大10件取得
        const result = await youtubesearchapi.GetListByKeyword(query, false, 10);
        
        // 取得した結果をタイトルとURLのみのシンプルな形式に変換
        const videos = result.items.map(item => ({
            title: item.title,
            url: `https://www.youtube.com/watch?v=${item.id}`,
            channel: item.channelTitle
        }));

        res.json({ videos });
    } catch (error) {
        console.error('YouTube Search Error:', error);
        res.status(500).json({ error: 'YouTubeの検索に失敗しました。' });
    }
});

/*
// その他のリクエストはフロントエンドの index.html を返す
app.get('/:path*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
        if (err) {
            // distディレクトリがない場合は簡易的なメッセージを返す
            res.status(200).send('<h1>YouTube Search Tool Backend</h1><p>Frontend is not built yet.</p>');
        }
    });
});
*/

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
