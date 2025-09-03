## 概要

AWS Cognito SDKの操作サンプル用リポジトリです。
ユーザー認証機能（新規登録、サインイン、メール認証、トークン管理）を実装したWebアプリケーションです。

## サイト構成

このサイトは以下の機能を提供します：

### 主要機能
- **新規登録** (`/sign_up/`) - ユーザーアカウントの新規作成
- **サインイン** (`/sign_in/`) - 既存ユーザーのログイン
- **アカウント認証** (`/activate/`) - メールで送信される検証コードによるアカウント有効化
- **マイページ** (`/mypage/`) - ログイン済みユーザーの情報表示とログアウト
- **再送信** (`/resend/`) - 検証コードの再送信
- **トークンリフレッシュ** (`/token_refresh/`) - アクセストークンの更新

### 技術構成
- **フロントエンド**: HTML, CSS, JavaScript (jQuery)
- **認証**: AWS Cognito Identity SDK
- **暗号化**: SJCL, CryptoJS
- **その他**: AWS SDK v2, Moment.js

### ディレクトリ構造
```
public/
├── index.html              # エントリーポイント（sign_upにリダイレクト）
├── sign_up/               # 新規登録機能
├── sign_in/               # サインイン機能
├── activate/              # アカウント認証機能
├── mypage/                # マイページ機能
├── resend/                # 再送信機能
├── token_refresh/         # トークンリフレッシュ機能
└── common/                # 共通リソース
    ├── style.css          # 共通スタイル
    ├── scripts.js         # 共通スクリプト
    └── navi/              # ナビゲーション関連
```


## サーバー起動

```
yarn install

npm run dev
or 
npx http-server ./public -p 5300 -c-1 

アクセスURL =>  http://127.0.0.1:5300/index.html

```




## 補足

- public がドキュメントルート
