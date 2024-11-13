# サーバーサイド

## 環境の立ち上げ方

serverディレクトリ内で以下のコマンドを実行してください．

### 1. .envファイルを作成

serverディレクトリに内に.envファイルを置く必要があります．
（keyなどを管理するためgitの管理外）

そのためテンプレートとなる.env.devをコピーして.envを作成してください．

```bash
pwd
# ????/server
cp .env.dev .env
```

### 2. Dockerコンテナの立ち上げ

```bash
pwd
# ????/server
make dev
```

うまくいくと

- Django (API) [http://localhost:8000/](http://localhost:8000/)
- Swagger (APIドキュメント) [http://localhost:9000/](http://localhost:9000/)

にアクセスできるようになります．

- デバック用画面 [http://localhost:8000/api/diary/debug/](http://localhost:8000/api/diary/debug/)

### 3. コンテナの破壊

```bash
pwd
# ????/server
make down
```

### その他 開発中盤でコンテナが立ち上がらない場合

DBの構造の変更が悪さをしている可能性があります．その際は/server/dbフォルダを削除することでDBの初期化が可能です．
