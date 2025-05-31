# GitHub Pages公開ガイド

このファイルは、Mobility Consultant PlatformをGitHub Pagesで公開するための詳細な手順を説明します。

## 🚀 クイックデプロイ（5分で完了）

### ステップ1: リポジトリ作成
1. GitHubにログインして「New repository」をクリック
2. リポジトリ名を入力（例：`mobility-consultant-platform`）
3. 「Public」を選択（GitHub Pages無料版には必須）
4. 「Create repository」をクリック

### ステップ2: ファイルアップロード
1. 作成したリポジトリページで「uploading an existing file」をクリック
2. 以下のファイルをすべてドラッグ&ドロップでアップロード：
   - `index.html`
   - `style.css`
   - `app.js`
   - `case-studies.json`
   - `rss-config.json`
   - `.nojekyll`
   - `README.md`

### ステップ3: GitHub Pages有効化
1. リポジトリの「Settings」タブをクリック
2. 左サイドバーの「Pages」をクリック
3. Source: 「Deploy from a branch」を選択
4. Branch: 「main」を選択
5. Folder: 「/ (root)」を選択
6. 「Save」をクリック

### ステップ4: 確認
- 2-3分後に `https://yourusername.github.io/repository-name` でアクセス可能
- 緑のチェックマークが表示されれば公開成功

## 📋 ファイルチェックリスト

公開前に以下のファイルがすべて含まれていることを確認してください：

- ✅ `index.html` - メインページ（必須）
- ✅ `style.css` - スタイルシート（必須）
- ✅ `app.js` - JavaScript機能（必須）
- ✅ `.nojekyll` - Jekyll無効化（重要）
- ✅ `case-studies.json` - ケーススタディデータ
- ✅ `rss-config.json` - RSS設定
- ✅ `README.md` - プロジェクト説明

## 🔧 高度な設定

### カスタムドメインの設定

1. **ドメイン準備**
   - 独自ドメインを取得（お名前.com、ムームードメイン等）
   - DNS設定でCNAMEレコードを追加：
     ```
     www.yourdomain.com → yourusername.github.io
     ```

2. **GitHub設定**
   - Settings > Pages > Custom domain
   - ドメイン名を入力（例：`www.yourdomain.com`）
   - 「Enforce HTTPS」をチェック

### GitHub Actionsによる自動デプロイ

`.github/workflows/deploy.yml` ファイルを作成：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔍 トラブルシューティング

### よくある問題と解決方法

#### 1. ページが表示されない（404エラー）
**症状**: `https://yourusername.github.io/repository-name` にアクセスしても404エラー

**解決方法**:
- リポジトリがPublicになっているか確認
- `index.html` がルートディレクトリに存在するか確認
- GitHub Pages設定でブランチが正しく選択されているか確認
- 5-10分待機（反映に時間がかかる場合がある）

#### 2. CSSが適用されない
**症状**: HTMLは表示されるがスタイルが反映されない

**解決方法**:
- `style.css` ファイルがルートディレクトリに存在するか確認
- `index.html` 内のCSSリンクパスを確認：
  ```html
  <link rel="stylesheet" href="style.css">
  ```
- ブラウザキャッシュをクリア（Ctrl+F5）

#### 3. JavaScriptが動作しない
**症状**: ページは表示されるが動的機能が働かない

**解決方法**:
- `app.js` ファイルがルートディレクトリに存在するか確認
- `index.html` 内のJavaScriptリンクパスを確認：
  ```html
  <script src="app.js"></script>
  ```
- ブラウザの開発者ツールでエラーをチェック

#### 4. RSSフィードが読み込まれない
**症状**: ニュースセンターに「読み込み中」が表示され続ける

**解決方法**:
- CORS制約により一部のRSSフィードが利用できない可能性
- `rss-config.json` で代替フィードを設定
- プロキシサービス（allorigins.win）の稼働状況を確認

### パフォーマンス最適化

#### 1. 読み込み速度改善
```html
<!-- 重要なリソースをプリロード -->
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="app.js" as="script">

<!-- フォントの最適化 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

#### 2. SEO最適化
```html
<!-- メタタグの追加 -->
<meta name="description" content="Mobility業界コンサルタント向け統合学習プラットフォーム">
<meta name="keywords" content="mobility, consulting, EV, autonomous driving">
<meta name="author" content="Your Name">

<!-- Open Graphタグ -->
<meta property="og:title" content="Mobility Consultant Platform">
<meta property="og:description" content="Mobility業界のコンサルタント向け学習プラットフォーム">
<meta property="og:type" content="website">
```

## 📊 アクセス解析の設定

### Google Analytics 4の導入

1. **Google Analyticsアカウント作成**
   - [analytics.google.com](https://analytics.google.com) でアカウント作成
   - プロパティを作成してトラッキングIDを取得

2. **HTMLに追加**
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_TRACKING_ID');
   </script>
   ```

## 🔒 セキュリティ設定

### Content Security Policy

`index.html` の `<head>` セクションに追加：

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.allorigins.win;
">
```

## 📱 レスポンシブ対応確認

各デバイスでの表示確認：

- **Desktop**: 1920x1080, 1366x768
- **Tablet**: iPad (768x1024), iPad Pro (1024x1366)
- **Mobile**: iPhone (375x667), Android (360x640)

ブラウザの開発者ツールでデバイスモードを使用して確認してください。

## 🚨 緊急時の対応

### サイトに問題が発生した場合

1. **一時的な非公開化**
   - Settings > Pages > Source を「None」に変更

2. **ロールバック**
   - 問題のあるコミットを特定
   - `git revert <commit-hash>` で変更を元に戻す
   - 変更をプッシュ

3. **メンテナンスページの表示**
   - `index.html` を一時的にメンテナンス表示に変更

## 📞 サポート

技術的な問題や質問がある場合：

- 📧 **Email**: [GitHub Issues](https://github.com/yourusername/repository-name/issues)で問題を報告
- 📖 **ドキュメント**: README.mdを参照
- 🔍 **検索**: GitHubの検索機能で類似の問題を確認

---

**最終更新**: 2025年6月