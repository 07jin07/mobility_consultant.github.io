// Mobility Consultant Platform - RSS機能修正版
class MobilityConsultantPlatform {
    constructor() {
        this.currentSection = 'dashboard';
        this.newsData = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.showSection('dashboard');
        this.loadNewsFeeds();
        this.setupLearningProgress();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    setupEventListeners() {
        // SWOT分析ツールのイベントリスナー
        const swotInputs = document.querySelectorAll('.swot-input input');
        swotInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addSwotItem(e.target);
                }
            });
        });

        // RSS更新ボタン
        const refreshBtn = document.getElementById('refresh-news');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadNewsFeeds();
            });
        }
    }

    showSection(sectionName) {
        // セクション表示の切り替え
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.remove('active'));

        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => btn.classList.remove('active'));

        const targetSection = document.getElementById(sectionName);
        const targetBtn = document.querySelector(`[data-section="${sectionName}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }

    // RSS機能の修正版実装
    async loadNewsFeeds() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoadingState();

        const feeds = [
            // 日系自動車メーカー
            {
                category: 'japanese_oem',
                name: 'トヨタ自動車',
                url: 'https://global.toyota/en/newsroom/rss/',
                color: '#eb0a1e'
            },
            {
                category: 'japanese_oem',
                name: 'ホンダ',
                url: 'https://global.honda/newsroom/rss/',
                color: '#cc0000'
            },
            {
                category: 'japanese_oem',
                name: '日産自動車',
                url: 'https://global.nissan/JP/NEWS/rss.xml',
                color: '#c3002f'
            },
            // グローバル自動車メーカー
            {
                category: 'global_oem',
                name: 'Tesla',
                url: 'https://www.tesla.com/blog/rss',
                color: '#cc0000'
            },
            {
                category: 'global_oem',
                name: 'BMW',
                url: 'https://www.press.bmwgroup.com/global/rss-feeds',
                color: '#0066b2'
            },
            // 業界メディア
            {
                category: 'industry_media',
                name: 'Automotive News',
                url: 'https://www.autonews.com/rss.xml',
                color: '#1e40af'
            },
            {
                category: 'industry_media',
                name: 'Car Watch',
                url: 'https://car.watch.impress.co.jp/data/rss/1.0/cw/feed.rdf',
                color: '#059669'
            }
        ];

        this.newsData = [];
        const promises = feeds.map(feed => this.fetchFeedWithFallback(feed));

        try {
            const results = await Promise.allSettled(promises);
            let successCount = 0;

            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    this.newsData.push(...result.value);
                    successCount++;
                } else {
                    console.warn(`Feed failed: ${feeds[index].name}`, result.reason);
                }
            });

            // 日付でソート（新しい順）
            this.newsData.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

            // ニュース表示を更新
            this.displayNews();

            if (successCount === 0) {
                this.showNoNewsMessage();
            }

        } catch (error) {
            console.error('RSS loading failed:', error);
            this.showErrorMessage();
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    // 複数のプロキシサービスでフォールバック機能付きフェッチ
    async fetchFeedWithFallback(feed) {
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://cors-anywhere.herokuapp.com/'
        ];

        for (let i = 0; i < proxies.length; i++) {
            try {
                const result = await this.fetchSingleFeed(feed, proxies[i]);
                if (result && result.length > 0) {
                    return result;
                }
            } catch (error) {
                console.warn(`Proxy ${i + 1} failed for ${feed.name}:`, error);
                if (i === proxies.length - 1) {
                    throw error;
                }
            }
        }

        return null;
    }

    // 単一フィードの取得（修正版）
    async fetchSingleFeed(feed, proxyUrl) {
        const encodedUrl = encodeURIComponent(feed.url);
        const fullUrl = proxyUrl + encodedUrl;

        try {
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/rss+xml, application/xml, text/xml'
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();

            if (!text || text.trim().length === 0) {
                throw new Error('Empty response');
            }

            return this.parseRSSFeed(text, feed);

        } catch (error) {
            console.error(`Feed fetch failed for ${feed.name}:`, error);
            throw error;
        }
    }

    // RSS XMLパースの改善版
    parseRSSFeed(xmlText, feedInfo) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            // XMLパースエラーの確認
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error(`XML Parse Error: ${parserError.textContent}`);
            }

            const items = [];

            // RSS 2.0 形式
            let itemElements = xmlDoc.querySelectorAll('item');

            // Atom 形式の場合
            if (itemElements.length === 0) {
                itemElements = xmlDoc.querySelectorAll('entry');
            }

            // RDF 形式の場合
            if (itemElements.length === 0) {
                itemElements = xmlDoc.querySelectorAll('item, entry');
            }

            itemElements.forEach((item, index) => {
                if (index >= 10) return; // 最大10件まで

                try {
                    const newsItem = this.extractItemData(item, feedInfo);
                    if (newsItem) {
                        items.push(newsItem);
                    }
                } catch (error) {
                    console.warn('Item parsing failed:', error);
                }
            });

            return items;

        } catch (error) {
            console.error(`RSS parsing failed for ${feedInfo.name}:`, error);
            throw error;
        }
    }

    // ニュースアイテムデータの抽出
    extractItemData(item, feedInfo) {
        try {
            // タイトルの取得
            let title = this.getElementText(item, 'title') || 
                       this.getElementText(item, 'dc:title') || 
                       'タイトルなし';

            // リンクの取得
            let link = this.getElementText(item, 'link') || 
                      this.getElementText(item, 'guid') ||
                      item.querySelector('link')?.getAttribute('href') || '';

            // 説明の取得
            let description = this.getElementText(item, 'description') || 
                             this.getElementText(item, 'summary') || 
                             this.getElementText(item, 'content') || 
                             '';

            // 公開日の取得
            let pubDate = this.getElementText(item, 'pubDate') || 
                         this.getElementText(item, 'published') || 
                         this.getElementText(item, 'dc:date') || 
                         new Date().toISOString();

            // データの整形
            title = this.cleanText(title);
            description = this.cleanText(description).substring(0, 150) + '...';

            if (!title || title.length < 5) {
                return null;
            }

            return {
                title,
                link,
                description,
                pubDate: new Date(pubDate),
                source: feedInfo.name,
                category: feedInfo.category,
                color: feedInfo.color
            };

        } catch (error) {
            console.warn('Item data extraction failed:', error);
            return null;
        }
    }

    // XMLエレメントからテキストを安全に取得
    getElementText(parent, selector) {
        const element = parent.querySelector(selector);
        return element ? element.textContent.trim() : null;
    }

    // テキストのクリーニング
    cleanText(text) {
        if (!text) return '';
        return text
            .replace(/<[^>]*>/g, '') // HTMLタグを除去
            .replace(/&nbsp;/g, ' ') // HTMLエンティティを変換
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ') // 連続する空白を単一スペースに
            .trim();
    }

    // ニュース表示機能
    displayNews() {
        const newsContainer = document.getElementById('news-list');
        if (!newsContainer) return;

        if (this.newsData.length === 0) {
            this.showNoNewsMessage();
            return;
        }

        const categories = this.categorizeNews();
        let html = '';

        // カテゴリー別に表示
        Object.keys(categories).forEach(category => {
            const categoryNews = categories[category];
            if (categoryNews.length === 0) return;

            html += `
                <div class="news-category">
                    <h3 class="category-title">${this.getCategoryDisplayName(category)}</h3>
                    <div class="news-items">
            `;

            categoryNews.slice(0, 5).forEach(item => {
                const formattedDate = this.formatDate(item.pubDate);
                html += `
                    <div class="news-item" data-category="${category}">
                        <div class="news-header">
                            <span class="news-source" style="color: ${item.color}">${item.source}</span>
                            <span class="news-date">${formattedDate}</span>
                        </div>
                        <h4 class="news-title">
                            <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                                ${item.title}
                            </a>
                        </h4>
                        <p class="news-description">${item.description}</p>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        newsContainer.innerHTML = html;
    }

    // ニュースのカテゴリー分け
    categorizeNews() {
        const categories = {
            japanese_oem: [],
            global_oem: [],
            government: [],
            industry_media: [],
            consulting: []
        };

        this.newsData.forEach(item => {
            const category = item.category || 'industry_media';
            if (categories[category]) {
                categories[category].push(item);
            }
        });

        return categories;
    }

    // カテゴリー表示名の取得
    getCategoryDisplayName(category) {
        const displayNames = {
            japanese_oem: '🇯🇵 日系自動車メーカー',
            global_oem: '🌍 グローバル自動車メーカー',
            government: '🏛️ 政府・行政機関',
            industry_media: '📰 業界メディア',
            consulting: '💼 コンサルティング'
        };

        return displayNames[category] || category;
    }

    // 日付のフォーマット
    formatDate(date) {
        if (!date || !(date instanceof Date)) return '';

        const now = new Date();
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffHours < 1) {
            return 'たった今';
        } else if (diffHours < 24) {
            return `${diffHours}時間前`;
        } else if (diffHours < 168) {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}日前`;
        } else {
            return date.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    // ローディング状態の表示
    showLoadingState() {
        const newsContainer = document.getElementById('news-list');
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>最新ニュースを読み込み中...</p>
                </div>
            `;
        }
    }

    hideLoadingState() {
        // hideLoadingStateは自動的にdisplayNewsで上書きされる
    }

    // エラーメッセージの表示
    showErrorMessage() {
        const newsContainer = document.getElementById('news-list');
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="error-state">
                    <p>ニュースの読み込みに失敗しました。</p>
                    <button onclick="app.loadNewsFeeds()" class="retry-btn">再試行</button>
                </div>
            `;
        }
    }

    // ニュースなしメッセージの表示
    showNoNewsMessage() {
        const newsContainer = document.getElementById('news-list');
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="no-news-state">
                    <p>現在表示できるニュースがありません。</p>
                    <p>しばらく時間をおいてから再度お試しください。</p>
                    <button onclick="app.loadNewsFeeds()" class="retry-btn">更新</button>
                </div>
            `;
        }
    }

    // SWOT分析ツール
    addSwotItem(input) {
        const value = input.value.trim();
        if (!value) return;

        const category = input.closest('.swot-quadrant').getAttribute('data-category');
        const itemsList = input.closest('.swot-quadrant').querySelector('.swot-items');

        const item = document.createElement('div');
        item.className = 'swot-item';
        item.innerHTML = `
            <span>${value}</span>
            <button onclick="this.parentElement.remove()" class="remove-btn">×</button>
        `;

        itemsList.appendChild(item);
        input.value = '';
    }

    // 学習進捗の設定
    setupLearningProgress() {
        // 学習モジュールの進捗を管理
        const modules = document.querySelectorAll('.module-card');
        modules.forEach(module => {
            const progressBar = module.querySelector('.progress-bar');
            if (progressBar) {
                // ランダムな進捗を設定（デモ用）
                const progress = Math.floor(Math.random() * 100);
                progressBar.style.width = progress + '%';

                const progressText = module.querySelector('.progress-text');
                if (progressText) {
                    progressText.textContent = `${progress}% 完了`;
                }
            }
        });
    }
}

// DOMContentLoadedイベントでアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MobilityConsultantPlatform();

    // 5分ごとにニュースを自動更新
    setInterval(() => {
        if (!window.app.isLoading) {
            window.app.loadNewsFeeds();
        }
    }, 5 * 60 * 1000);
});

// グローバル関数（HTMLから呼び出し用）
function showSection(sectionName) {
    if (window.app) {
        window.app.showSection(sectionName);
    }
}
