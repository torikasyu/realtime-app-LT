# リアルタイム通信 LT プロジェクト タスク管理

## 概要
- **テーマ**: ウェブのリアルタイム通信（仕組み・手法・コードの対応関係）
- **持ち時間**: 10分
- **主要な成果物**:
  1. **プレゼンテーション資料**（リポジトリ内でHTML/PDF化できるスライド）
  2. **デモンストレーションWebアプリ**（クライアント＆サーバーのコードと実際の通信の動きが対比で見える学習・実演用アプリ）

---

## 10分LT スライド詳細構成（確定案）

| 時間 | スライド | タイトル / 内容 | ビジュアル・演出のポイント |
|---|---|---|---|
| **0:00〜1:00** (1分) | 1 | **タイトル・自己紹介**<br>「Webでリアルタイム通信はどう動いているのか？」 | 掴みと本日のゴール提示 |
| | 2 | **覚えていますか？ TCP/IP 4階層モデル**<br>情報処理試験のお勉強風な図を提示。<br>「Webブラウザが普段喋っているのは一番上の **HTTP（アプリケーション層）** ですよね」 | 教科書風の階層図<br>（アプリケーション層 / トランスポート層 / インターネット層 / ネットワーク層） |
| | 3 | **おさらい: 通常のHTTP通信の姿**<br>リクエストしてレスポンスが返る。終了したら切断。 | **DevTools/コンソール風のシンプル表記**:<br>余計なヘッダーは削り、リクエストが「デデン」とあり、空行を空けてステータスコードとレスポンスの頭が見えるスタイル |
| **1:00〜2:30** (1.5分) | 4 | **対比: リアルタイムの極致「FPS/TPSゲーム」**<br>Apex, Fortnite等の世界。<br>「1秒間に何十回・何百回も座標が飛び交うゲーム。これ、ブラウザと同じHTTPで通信してる？」 | ゲームのミリ秒世界・Tick Rateの紹介 |
| | 5 | **トランスポート層: TCP と UDP の本質的な違い**<br>信頼性のTCP vs 速度・即時性のUDP。<br>FPSでは「過去の遅れた弾より、1ミリ秒でも新しい今の座標」が欲しいのでUDP/生ソケットが主流。<br>HTTPだと遅延・ヘッダー・リクエスト駆動の三重苦で論外。 | トランスポート層の特性比較（TCPの順序保証 vs UDPの投げっぱなし） |
| **2:30〜4:00** (1.5分) | 6 | **課題提示: Webブラウザのジレンマ**<br>「じゃあ、ブラウザ上でリアルタイム通信したい時はどうする？」<br>ブラウザはセキュリティ制約上、生のTCP/UDPソケットを直接開くことが許されていない！ | ブラウザのサンドボックス制約<br>0. ロングポーリング（※今回は割愛）<br>1. SSE<br>2. WebSocket |
| **4:00〜5:30** (1.5分) | 7 | **手法1: Server-Sent Events (SSE)**<br>HTTPの枠組み（アプリケーション層）のままでサーバーからプッシュする仕組み。 | HTTPリクエスト/レスポンス表記:<br>`Accept: text/event-stream`<br>`Content-Type: text/event-stream`<br>`Connection: keep-alive` |
| | 8 | **教科書に戻る: TCPハンドシェイクとKeep-Alive**<br>3ウェイハンドシェイク（SYN, SYN-ACK, ACK）。<br>通常は切断（FIN/ACK）するが、Keep-AliveでTCPコネクションを切らずにデータを垂れ流し続ける。 | TCPコネクション維持の図解 |
| **5:30〜7:00** (1.5分) | 9 | **手法2: WebSocket**<br>ブラウザで双方向通信を行う大本命。<br>「直接ソケットが開けないなら、HTTPからソケットへ化けさせればいいじゃない」 | ソケット通信への昇格（プロトコルアップグレード）の概念 |
| | 10 | **WebSocketの仕組み: 101 Switching Protocols**<br>最初は普通のHTTPリクエスト（Upgradeヘッダー付き）。サーバーが101を返したら、その下にあるTCPコネクションをそのまま全二重ソケットに昇格！ | **コンソール風表記**:<br>`GET /ws HTTP/1.1`<br>`Upgrade: websocket`<br>`Connection: Upgrade`<br><br>`HTTP/1.1 101 Switching Protocols` |
| | 11 | **相手は誰？: 「ステートフル」と「ステートレス」**<br>TCPはステートフル（繋がりを覚えている） vs HTTPはステートレス（1問1答で忘れる）。<br>リアルタイム通信には「状態」が必要なのに、Webはあえて状態を捨てたプロトコルだったという構造的矛盾。 | 対比カード（TCPのESTABLISHED vs HTTPの1問1答） |
| | 12 | **実務の解: 認証ヘッダーと「BFFパターン」**<br>ブラウザ標準APIのヘッダー制約 & 生トークン保持リスク。<br>現場の王道解「BFFによるトークン仲介（Cookie ⇔ Bearer変換）」アーキテクチャの解説。 | BFF構成図（ブラウザ ⇔ BFF ⇔ 裏API） |
| **8:15〜9:00** (0.75分)| 13 | **デモ実演 1: コードと動きで見るSSE vs WebSocket**<br>ローカル対比デモアプリへ画面切り替え。<br>クライアント側コード ⇔ サーバー側コード ⇔ 実際の通信挙動を比較。 | デモアプリ操作（SSEのストリーム受信 vs WebSocketの双方向送受信） |
| **9:00〜9:30** (0.5分)| 14 | **デモ実演 2: 【会場参加型】ヤード配置のリアルタイム共同検討**<br>3D建設ヤード配置の共同検討アプリ（Cloud Run版）。<br>3D画面プレビュー画像とQRコード・URLを表示し、スマホやPCから全員で同時接続してリアルタイム同期を体感。 | **3Dプレビュー画像** & **QRコード** & URL表示<br>（`https://realtime-app-7fgff4ji2q-an.a.run.app`） |
| **9:30〜10:00** (0.5分)| 15 | **まとめ**<br>・HTTPの制約とそれをハックしてきたWebの進化<br>・単方向ストリームならSSE、双方向即時通信ならWebSocket<br>・（発展: HTTP/3, WebTransportへの未来） | 振り返りマトリクス |

---

## デモアプリケーション仕様
1. **コード対比学習デモ（ローカル）**: [demo/index.html](demo/index.html)
   - クライアントコード・サーバーコード・パケットの相互連動ハイライト
   - ゼロ依存Nodeサーバー（[demo/server.js](demo/server.js)）またはブラウザ完結シミュレータ
2. **会場参加型リアルタイムデモ（Cloud Run）**: [https://realtime-app-7fgff4ji2q-an.a.run.app](https://realtime-app-7fgff4ji2q-an.a.run.app)
   - 会場全員で同時アクセスしてリアルタイム同期を体験できるWebアプリ
   - リポジトリ: `/Users/hiroki/repos/realtime-app`

---

## タスク進捗

- [x] スライド詳細構成（目次・ページごとの内容・ビジュアル方針）の策定
- [x] スライド資料の実装（白基調HTMLスライド / PDF化対応）: [slides/index.html](file:///Users/hiroki/repos/realtime-app-LT/slides/index.html)
- [x] 発表原稿・トークスクリプト（10分配分）の作成: [slides/SCRIPT.md](file:///Users/hiroki/repos/realtime-app-LT/slides/SCRIPT.md)
- [x] デモアプリケーションの実装（SSE & WebSocket 対比ビジュアライザー）: [demo/index.html](file:///Users/hiroki/repos/realtime-app-LT/demo/index.html) / [demo/server.js](file:///Users/hiroki/repos/realtime-app-LT/demo/server.js)
- [x] ドキュメント・発表ガイド作成: [README.md](file:///Users/hiroki/repos/realtime-app-LT/README.md)
