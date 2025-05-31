// Mobility Consultant Platform - Main JavaScript File

class MobilityConsultantApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.newsData = [];
        this.rssFeeds = {
            japanese_oem: [
                'https://global.toyota/en/newsroom/rss/',
                'https://global.honda/newsroom/rss/',
                'https://www.nissan-global.com/EN/RSS/NEWSROOM.xml'
            ],
            global_oem: [
                'https://www.tesla.com/blog/rss',
                'https://press.bmwgroup.com/global/rss-feeds/rss-feed-news',
                'https://media.mercedes-benz.com/rss/en'
            ],
            government: [
                'https://www.mlit.go.jp/report/press/rss.xml',
                'https://www.meti.go.jp/rss/press.xml'
            ],
            consulting: [
                'https://www.bcg.com/about/rss',
                'https://www.mckinsey.com/featured-insights/rss'
            ]
        };
        this.corsProxy = 'https://api.allorigins.win/raw?url=';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModalEvents();
        this.loadNewsData();
        this.setupNewsFiltering();
        this.setupToolButtons();
        this.loadProgress();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });
    }

    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific data
        if (sectionName === 'news') {
            this.refreshNewsDisplay();
        }
    }

    setupModalEvents() {
        // Close modal events
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    setupToolButtons() {
        document.querySelectorAll('.try-tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.openTool(tool);
            });
        });

        // Setup case study buttons
        document.querySelectorAll('.start-case-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const caseCard = e.target.closest('.case-card');
                const caseName = caseCard.dataset.case;
                this.startCaseStudy(caseName);
            });
        });
    }

    openTool(toolName) {
        switch (toolName) {
            case 'swot':
                document.getElementById('swot-modal').style.display = 'flex';
                break;
            case 'porter':
                alert('Porter\'s 5 Forces分析ツールは開発中です。');
                break;
            case 'valuechain':
                alert('バリューチェーン分析ツールは開発中です。');
                break;
        }
    }

    startCaseStudy(caseName) {
        const caseInfo = {
            toyota: {
                title: 'トヨタ自動車 EV戦略転換のジレンマ',
                description: '2025年5月、トヨタ本社にて豊田章男会長より緊急の戦略見直し指示が...',
                scenario: 'あなたは大手コンサルティングファームのシニアマネージャーとして、トヨタ自動車のEV戦略見直しプロジェクトに参画することになりました。'
            },
            tesla: {
                title: 'Tesla日本法人 プレミアム戦略の限界',
                description: '日本市場でのシェア拡大に苦戦するTeslaの戦略転換について分析します。',
                scenario: 'Tesla Japan責任者より、価格戦略の見直しとマーケットアプローチの再検討を依頼されました。'
            },
            isuzu: {
                title: 'いすゞ自動車 商用モビリティ変革戦略',
                description: '商用車専業メーカーとしての新中期経営計画「IX」の見直しに取り組みます。',
                scenario: '南真介社長より、エルフEV特装車の市場戦略と400億円投資の実験棟ROI最適化について相談を受けました。'
            },
            honda: {
                title: 'ホンダ 知能化×電動化戦略軌道修正',
                description: '2025年ビジネスアップデートで発表された戦略転換の背景と今後の方向性を分析します。',
                scenario: '三部敏宏社長による電動化投資削減（10兆円→7兆円）とEV目標下方修正（30%→20%）の戦略的意味を検討してください。'
            }
        };

        const info = caseInfo[caseName];
        if (info) {
            const message = `
ケーススタディ: ${info.title}

シナリオ:
${info.scenario}

このケーススタディを開始しますか？
            `;
            if (confirm(message)) {
                alert('ケーススタディ機能は開発中です。実際の実装では詳細な分析フローが提供されます。');
            }
        }
    }

    async loadNewsData() {
        const newsGrid = document.getElementById('news-grid');
        const latestNews = document.getElementById('latest-news');

        try {
            // Show loading state
            if (newsGrid) {
                newsGrid.innerHTML = '<div class="loading-news"><i class="fas fa-spinner fa-spin"></i><p>ニュースを読み込み中...</p></div>';
            }

            const allNews = [];

            // Load news from different categories
            for (const [category, feeds] of Object.entries(this.rssFeeds)) {
                for (const feedUrl of feeds) {
                    try {
                        const news = await this.fetchRSSFeed(feedUrl, category);
                        allNews.push(...news);
                    } catch (error) {
                        console.warn(`Failed to load feed ${feedUrl}:`, error);
                    }
                }
            }

            // Sort by date and limit
            this.newsData = allNews
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 50);

            this.displayNews(this.newsData);
            this.updateLatestNews();

        } catch (error) {
            console.error('Error loading news:', error);
            if (newsGrid) {
                newsGrid.innerHTML = '<div class="error-message">ニュースの読み込みに失敗しました。</div>';
            }
        }
    }

    async fetchRSSFeed(feedUrl, category) {
        try {
            const proxyUrl = `${this.corsProxy}${encodeURIComponent(feedUrl)}`;
            const response = await fetch(proxyUrl);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            const items = xmlDoc.querySelectorAll('item, entry');
            const news = [];

            items.forEach((item, index) => {
                if (index < 10) { // Limit per feed
                    const title = this.getTextContent(item, 'title');
                    const description = this.getTextContent(item, 'description, content, summary');
                    const link = this.getTextContent(item, 'link') || item.querySelector('link')?.getAttribute('href');
                    const pubDate = this.getTextContent(item, 'pubDate, published, updated');

                    if (title && link) {
                        news.push({
                            title: this.cleanText(title),
                            description: this.cleanText(description),
                            link: link,
                            date: new Date(pubDate || Date.now()),
                            category: category,
                            source: this.getFeedSource(feedUrl)
                        });
                    }
                }
            });

            return news;
        } catch (error) {
            console.error('Error fetching RSS feed:', error);
            return [];
        }
    }

    getTextContent(item, selectors) {
        const selectorList = selectors.split(', ');
        for (const selector of selectorList) {
            const element = item.querySelector(selector);
            if (element) {
                return element.textContent || element.getAttribute('href');
            }
        }
        return '';
    }

    cleanText(text) {
        if (!text) return '';
        return text.replace(/<[^>]*>/g, '').trim().substring(0, 200);
    }

    getFeedSource(feedUrl) {
        if (feedUrl.includes('toyota')) return 'Toyota';
        if (feedUrl.includes('honda')) return 'Honda';
        if (feedUrl.includes('nissan')) return 'Nissan';
        if (feedUrl.includes('tesla')) return 'Tesla';
        if (feedUrl.includes('bmw')) return 'BMW';
        if (feedUrl.includes('mercedes')) return 'Mercedes-Benz';
        if (feedUrl.includes('mlit')) return '国土交通省';
        if (feedUrl.includes('meti')) return '経済産業省';
        if (feedUrl.includes('bcg')) return 'BCG';
        if (feedUrl.includes('mckinsey')) return 'McKinsey';
        return 'Unknown';
    }

    displayNews(newsItems) {
        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) return;

        if (newsItems.length === 0) {
            newsGrid.innerHTML = '<div class="no-news">ニュースが見つかりませんでした。</div>';
            return;
        }

        const newsHTML = newsItems.map(item => `
            <div class="news-card" data-category="${item.category}">
                <div class="news-header">
                    <span class="news-source">${item.source}</span>
                    <span class="news-date">${this.formatDate(item.date)}</span>
                </div>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-description">${item.description}</p>
                <a href="${item.link}" target="_blank" class="news-link">
                    記事を読む <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        `).join('');

        newsGrid.innerHTML = newsHTML;
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1日前';
        if (diffDays < 7) return `${diffDays}日前`;
        
        return date.toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric'
        });
    }

    updateLatestNews() {
        const latestNews = document.getElementById('latest-news');
        if (!latestNews || this.newsData.length === 0) return;

        const latest = this.newsData.slice(0, 3);
        const newsHTML = latest.map(item => `
            <div class="news-item-preview">
                <div class="news-meta">
                    <span class="source">${item.source}</span>
                    <span class="date">${this.formatDate(item.date)}</span>
                </div>
                <a href="${item.link}" target="_blank" class="news-title-link">
                    ${item.title}
                </a>
            </div>
        `).join('');

        latestNews.innerHTML = newsHTML;
    }

    setupNewsFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('news-search');
        const refreshButton = document.getElementById('refresh-news');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterNews(category);
                
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchNews(e.target.value);
            });
        }

        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.loadNewsData();
            });
        }
    }

    filterNews(category) {
        if (category === 'all') {
            this.displayNews(this.newsData);
        } else {
            const filtered = this.newsData.filter(item => item.category === category);
            this.displayNews(filtered);
        }
    }

    searchNews(query) {
        if (!query.trim()) {
            this.displayNews(this.newsData);
            return;
        }

        const filtered = this.newsData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        this.displayNews(filtered);
    }

    refreshNewsDisplay() {
        const activeFilter = document.querySelector('.filter-btn.active');
        const searchQuery = document.getElementById('news-search')?.value || '';

        if (searchQuery) {
            this.searchNews(searchQuery);
        } else if (activeFilter) {
            this.filterNews(activeFilter.dataset.category);
        } else {
            this.displayNews(this.newsData);
        }
    }

    loadProgress() {
        // Simulate loading saved progress
        const progress = {
            foundation: 85,
            frameworks: 65,
            casestudies: 45,
            currentCertification: 'bronze',
            nextCertification: 'silver'
        };

        // Update progress bars
        document.querySelectorAll('.progress-fill').forEach((fill, index) => {
            const progressValue = Object.values(progress)[index] || 0;
            if (typeof progressValue === 'number') {
                setTimeout(() => {
                    fill.style.width = `${progressValue}%`;
                }, 500 + index * 200);
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mobilityApp = new MobilityConsultantApp();
});

// Add CSS for news cards dynamically
const additionalCSS = `
.news-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.news-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
}

.news-source {
    background-color: #1e40af;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-weight: 500;
}

.news-date {
    color: #6b7280;
}

.news-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.4;
}

.news-description {
    color: #4b5563;
    line-height: 1.5;
    margin: 0;
}

.news-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #1e40af;
    text-decoration: none;
    font-weight: 500;
    align-self: flex-start;
}

.news-link:hover {
    color: #1e3a8a;
}

.news-item-preview {
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
}

.news-item-preview:last-child {
    border-bottom: none;
}

.news-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
}

.news-meta .source {
    background-color: #1e40af;
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 999px;
}

.news-meta .date {
    color: #6b7280;
}

.news-title-link {
    color: #1f2937;
    text-decoration: none;
    font-weight: 500;
    line-height: 1.3;
    display: block;
}

.news-title-link:hover {
    color: #1e40af;
}

.error-message,
.no-news {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: #6b7280;
}

.loading {
    text-align: center;
    color: #6b7280;
    padding: 2rem;
}
`;

// Add the CSS to the document
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);