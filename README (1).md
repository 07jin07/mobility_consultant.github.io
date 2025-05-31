# Mobility Consultant Platform

**Mobility業界コンサルタントのための統合学習プラットフォーム**

## 概要

このプラットフォームは、Mobility業界のコンサルタントが最新の業界動向を把握し、実践的なコンサルティングスキルを習得するための包括的な学習環境を提供します。

### 主要機能

- **📊 ダッシュボード**: 学習進捗の可視化と最新情報の統合表示
- **📰 ニュースセンター**: MECE分類による高度なRSS統合機能
- **🎓 学習センター**: 基本フレームワークの段階的習得
- **💼 ケーススタディ**: 実企業事例を使った追体験型学習
- **🏆 認定システム**: 4段階の専門性認定制度

## デモサイト

🌐 **[Live Demo](https://yourusername.github.io/repository-name)**

## 技術仕様

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: レスポンシブデザイン、カスタムプロパティ
- **JavaScript (Vanilla)**: ES6+、モジュール設計
- **Font Awesome**: アイコンライブラリ
- **Google Fonts**: Inter フォントファミリー

### データ統合
- **RSS Parser**: リアルタイムニュース収集
- **CORS Proxy**: クロスオリジン制約対応
- **JSON Data**: 構造化されたコンテンツ管理

### 対応RSS情報源

#### 日系自動車メーカー 🇯🇵
- Toyota Global Newsroom
- Honda Global Newsroom  
- Nissan Global News
- Mazda Newsroom

#### グローバル自動車メーカー 🌍
- Tesla Blog
- BMW Group Press
- Mercedes-Benz Media
- Volkswagen Newsroom

#### 政府・行政機関 🏛️
- 国土交通省
- 経済産業省
- 環境省
- 内閣府

#### コンサルティング・調査機関 📊
- Boston Consulting Group
- McKinsey & Company
- Automotive News
- electrive.com

## クイックスタート

### GitHub Pagesでの公開

1. **リポジトリ作成**
```bash
# 新しいリポジトリを作成
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

2. **GitHub Pages設定**
- GitHubリポジトリの Settings > Pages
- Source: "Deploy from a branch"
- Branch: "main"
- Folder: "/ (root)"

3. **アクセス確認**
- 2-3分後に `https://yourusername.github.io/your-repo-name` でアクセス可能

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

# ローカルサーバーで起動 (Python 3の場合)
python -m http.server 8000

# または Node.jsの場合
npx serve .

# ブラウザで http://localhost:8000 にアクセス
```

## ファイル構造

```
mobility-consultant-platform/
├── index.html              # メインHTMLファイル
├── style.css               # スタイルシート
├── app.js                  # メインJavaScriptファイル
├── case-studies.json       # ケーススタディデータ
├── rss-config.json         # RSS設定ファイル
├── .nojekyll              # Jekyll無効化ファイル
├── README.md              # プロジェクト文書
└── assets/                # 静的リソース（予約）
    └── images/
```

## カスタマイズ

### RSS情報源の追加

`rss-config.json`を編集して新しいRSS情報源を追加:

```json
{
  "categories": {
    "your_category": {
      "name": "カテゴリ名",
      "color": "#色コード",
      "icon": "🔧",
      "feeds": [
        {
          "name": "フィード名",
          "url": "https://example.com/rss",
          "priority": "high",
          "description": "説明文"
        }
      ]
    }
  }
}
```

### ケーススタディの追加

`case-studies.json`に新しいケーススタディを追加:

```json
{
  "cases": [
    {
      "id": "new_case",
      "company": "企業名",
      "title": "ケースタイトル",
      "difficulty": "intermediate",
      "duration": "90分",
      "frameworks": ["使用フレームワーク"],
      "description": "ケースの説明",
      "scenario": "詳細シナリオ"
    }
  ]
}
```

### スタイルのカスタマイズ

`style.css`のCSS変数を変更してデザインをカスタマイズ:

```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #10b981;
    --bg-light: #f9fafb;
    /* その他の変数... */
}
```

## 機能詳細

### ニュースセンター

- **自動更新**: 5分間隔でのRSS取得
- **カテゴリフィルタ**: MECE分類による情報整理
- **検索機能**: キーワードベースの記事検索
- **プレビュー**: ダッシュボードでの最新ニュース表示

### 学習センター

- **段階的学習**: 4つのモジュール（80時間のプログラム）
- **進捗追跡**: 可視化された学習進捗
- **インタラクティブツール**: SWOT分析ツール等

### ケーススタディ

- **追体験型学習**: 実企業の課題を模擬体験
- **マルチフレームワーク**: 複数の分析手法を統合
- **段階的指導**: AI補助機能付きガイダンス

### 認定システム

- **4段階認定**: Bronze → Silver → Gold → Platinum
- **スキル評価**: 知識テスト + 実践プロジェクト
- **継続教育**: CPEクレジット制度

## トラブルシューティング

### よくある問題

1. **RSSが読み込まれない**
   - CORS制約により一部のRSSフィードが利用できない場合があります
   - `rss-config.json`で代替フィードを設定してください

2. **GitHub Pagesで表示されない**
   - `.nojekyll`ファイルが存在することを確認
   - Settings > Pagesで正しいブランチが選択されていることを確認

3. **レイアウトが崩れる**
   - ブラウザキャッシュをクリア
   - CSS/JSファイルのパスが正しいことを確認

### パフォーマンス最適化

- 画像の最適化（WebP形式推奨）
- JavaScript/CSSの最小化
- CDNの活用（Font Awesome、Google Fonts）

## 今後の拡張計画

- [ ] AI分析アシスタントの統合
- [ ] リアルタイムコラボレーション機能
- [ ] モバイルアプリ対応
- [ ] 多言語対応（英語、中国語）
- [ ] API統合（Bloomberg、Reuters等）

## ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照

## 貢献

プルリクエストや課題報告を歓迎します。貢献ガイドラインについては[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください。

## サポート

- 📧 Email: support@mobility-consultant.com
- 💬 Issues: [GitHub Issues](https://github.com/yourusername/your-repo-name/issues)
- 📖 Wiki: [Project Wiki](https://github.com/yourusername/your-repo-name/wiki)

## 作成者

**Mobility Consultant Platform Team**

---

*Last updated: June 2025*