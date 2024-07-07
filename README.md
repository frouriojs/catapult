# C A T A P U L T

フロントエンドは client ディレクトリの [Next.js](https://nextjs.org) 、バックエンドは server ディレクトリの [frourio](https://frourio.com) で構築された TypeScript で一気通貫開発が可能なモノレポサービス

最新のコミットによるデモ - https://catapult.frourio.com

## 開発手順

### Node.js のインストール

ローカルマシンに直接インストールする

https://nodejs.org の左ボタン、LTS をダウンロードしてインストール

### npm モジュールのインストール

ルートとフロントとバックエンドそれぞれに package.json があるので 3 回インストールが必要

```sh
$ npm i
$ npm i --prefix client
$ npm i --prefix server
```

### 環境変数ファイルの作成

```sh
$ cp client/.env.example client/.env
$ cp server/.env.example server/.env
```

### Docker compose起動

```sh
$ docker compose up -d
```

### 開発サーバー起動

次回以降は以下のコマンドだけで開発できる

```sh
$ npm run notios
```

Web ブラウザで http://localhost:3000 を開く

開発時のターミナル表示は [notios](https://github.com/frouriojs/notios) で制御している

[Node.js モノレポ開発のターミナルログ混雑解消のための新作 CLI ツール notios](https://zenn.dev/luma/articles/nodejs-new-cli-tool-notios)

閉じるときは `Ctrl + C` を 2 回連続で入力

#### MinIO Console

http://localhost:9001

#### PostgreSQL UI

```sh
$ cd server
$ npx prisma studio
```

### SMTPサーバー

Docker の Inbucket が SMTP サーバーのスタブを提供している

http://localhost:2501

serverからsendMailするとInbucketヘッダー中央の「Recent Mailboxes」に仮想メールが届く

### デプロイ

- `Dockerfile` でデプロイ可能
- WebSocket対応サーバー必須

#### データベース

`PostgreSQL`

#### デプロイ検証済みPaaS

- [Render](https://render.com)
- [Railway](https://railway.app)

#### 外部連携サービス

- AWS Cognito
- AWS S3 or Cloudflare R2

ヘルスチェック用エンドポイント

`/api/health`

#### Dockerによるデプロイ時の環境変数

```sh
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=
NEXT_PUBLIC_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_COGNITO_POOL_ENDPOINT=
DATABASE_URL=
S3_ACCESS_KEY=
S3_BUCKET=
S3_ENDPOINT=
S3_REGION=
S3_SECRET_KEY=
```
