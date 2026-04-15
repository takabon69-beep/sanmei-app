import './style.css';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('resultContainer');
const resultsList = document.getElementById('resultsList');
const copyAllBtn = document.getElementById('copyAllBtn');

let currentVideos = [];

async function search() {
    const query = searchInput.value.trim();
    if (!query) return;

    // UI状態のリセット
    loading.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    resultsList.innerHTML = '';
    currentVideos = [];

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        currentVideos = data.videos;
        displayResults(data.videos);
        resultContainer.classList.remove('hidden');
    } catch (error) {
        console.error('Search failed:', error);
        alert('検索中にエラーが発生しました。サーバーが起動しているか確認してください。');
    } finally {
        loading.classList.add('hidden');
    }
}

function displayResults(videos) {
    if (videos.length === 0) {
        resultsList.innerHTML = '<p>結果が見つかりませんでした。</p>';
        return;
    }

    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="video-title">${escapeHtml(video.title)}</div>
            <div class="video-channel">${escapeHtml(video.channel)}</div>
            <div class="video-url">${video.url}</div>
        `;
        resultsList.appendChild(card);
    });
}

function copyAllUrls() {
    if (currentVideos.length === 0) return;

    // NotebookLMに添付しやすい形式: タイトル \n URL の繰り返し、または単なるURLリスト
    // 今回は「シンプルにURLが並ぶもの」という要望なので、URLのみ改行区切りにする
    const urlList = currentVideos.map(v => v.url).join('\n');
    
    navigator.clipboard.writeText(urlList).then(() => {
        const originalText = copyAllBtn.textContent;
        copyAllBtn.textContent = 'コピー完了！';
        copyAllBtn.classList.remove('primary');
        copyAllBtn.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            copyAllBtn.textContent = originalText;
            copyAllBtn.classList.add('primary');
            copyAllBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        alert('クリップボードへのコピーに失敗しました。');
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// イベントリスナー
searchBtn.addEventListener('click', search);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') search();
});
copyAllBtn.addEventListener('click', copyAllUrls);
