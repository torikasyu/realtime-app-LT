# リアルタイム通信 LT プロジェクト (realtime-app-LT)

ウェブにおけるリアルタイム通信（SSE & WebSocket）の仕組み、ネットワーク基礎知識、およびクライアント/サーバーコードの対応関係を解説する10分LT用リポジトリです。

---

## 🌐 公開URL (GitHub Pages / Cloud Run)

- 📊 **プレゼンテーションスライド**:  
  👉 **[https://torikasyu.github.io/realtime-app-LT/](https://torikasyu.github.io/realtime-app-LT/)**
- 🖥️ **コード対比デモアプリ (SSE vs WS)**:  
  👉 **[https://torikasyu.github.io/realtime-app-LT/demo/](https://torikasyu.github.io/realtime-app-LT/demo/)**
- 🏗️ **会場参加型 3Dヤード配置リアルタイム共同検討 (Cloud Run)**:  
  👉 **[https://realtime-app-7fgff4ji2q-an.a.run.app](https://realtime-app-7fgff4ji2q-an.a.run.app)**

---

## 成果物一覧

### 1. プレゼンテーションスライド
- **スライド本体**: [slides/index.html](slides/index.html)
  - 白基調・クリーン（Light Mode）デザイン（全15枚）
  - キーボード操作（`←` `→` `Space` でスライド移動、`F` で全画面表示）
  - **PDF保存対応**: ブラウザの印刷メニュー（`Cmd + P` / `Ctrl + P`）から「PDFに保存」で、各スライドが16:9で綺麗に出力されます。
- **発表トークスクリプト**: [slides/SCRIPT.md](slides/SCRIPT.md)
  - 10分間のタイムテーブルと、各スライドの発表原稿・タイムキーパー目安。

### 2. デモアプリケーション（2種類）
1. **コード対比学習デモ（ローカル / ゼロ依存）**: [demo/index.html](demo/index.html)
   - ブラウザでダブルクリックして開くだけで即座に動く完全自己完結ビジュアライザー。
   - クライアントコード ⇔ サーバーコード ⇔ 通信パケットが連動ハイライト。
   - 実サーバーコード: [demo/server.js](demo/server.js)（`node demo/server.js`）
2. **会場参加型リアルタイムデモ（Cloud Run 公開版）**:
   - **タイトル**: ヤード配置のリアルタイム共同検討（3D）
   - **URL**: [https://realtime-app-7fgff4ji2q-an.a.run.app](https://realtime-app-7fgff4ji2q-an.a.run.app)
   - リポジトリ: `/Users/hiroki/repos/realtime-app`
   - 会場の参加者がスマホやPCから同時アクセスし、3D空間上の重機（クレーン等）や資材配置をリアルタイムに共同操作・同期できる体験型Webアプリ。
   - スライド14に **3Dプレビュー画像** と **QRコード**、参加URLを埋め込み済み。

---

## スライド構成（10分LT / 全15枚）

1. **タイトル**: ウェブのリアルタイム通信はどう動いているのか？
2. **復習：TCP/IP 4階層モデル**: アプリケーション層(L7/ALB/WAF)〜トランスポート層(L4/NLB/SG)とクラウドインフラへの繋がり
3. **通常のHTTP**: 通常のHTTP通信 (RFC 2616)（GETと200 OKのミニマル表記）
4. **対比**: リアルタイムの極致「FPS/TPSゲームの世界」（Apex, Fortnite）
5. **復習：トランスポート層の TCP と UDP の違い**: 確実性のTCP vs 即時性のUDP
6. **Webブラウザのジレンマ**: OS生ソケット禁止の制約とアプローチ（0. ロングポーリング）
7. **手法1: Server-Sent Events (SSE)**: HTTPの枠組みでサーバープッシュ
8. **SSEの内部：TCPハンドシェイクとKeep-Alive**: TCP 3ウェイハンドシェイク（Hello）と Keep-Alive（FINを送らない）
9. **手法2: WebSocket**: ブラウザで双方向通信を行う大本命
10. **WebSocketの正体**: 101 Switching Protocols（HTTP Upgradeの仕組みと技術トリビア）
11. **相手は誰？**: 「ステートフル」と「ステートレス」
12. **実務の解**: 認証ヘッダーと「BFFパターン」（BFFによるトークン仲介 & セキュリティ設計）
13. **実演 1**: コードと動きで見る対比デモ（SSE vs WebSocket）
14. **実演 2**: 【会場参加型】ヤード配置のリアルタイム共同検討（3D画像 & QRコード）
15. **まとめ**: SSEとWebSocketの使い分け指針マトリクス

---

## 発表時のワンクリック切り替え
発表本番は、ブラウザで以下の2つのタブを開いておくだけでスムーズに実演できます：
- タブ1: `slides/index.html`（全画面表示）
- タブ2: `demo/index.html`（スライド11でタブ切り替え）
