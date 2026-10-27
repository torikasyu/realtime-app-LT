/**
 * リアルタイム通信デモ - ゼロ依存サーバー (Node.js 標準モジュールのみ)
 * 
 * 外部ライブラリ (npm) は一切不要です！
 * 実行:
 *   node demo/server.js
 * 
 * ポート 3000 で動作します:
 *   - HTTP / 静的ファイル配信
 *   - Server-Sent Events (SSE)
 *   - WebSocket (101 Switching Protocols ハンドシェイク & 双方向フレーム送受信)
 */

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// WebSocket プロトコル定数 (RFC 6455)
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const server = http.createServer((req, res) => {
  // 1. デモ画面 (HTML) の配信
  if (req.url === '/' || req.url === '/index.html') {
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) {
      const html = fs.readFileSync(htmlPath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }
    res.writeHead(404);
    return res.end('index.html not found');
  }

  // 2. Server-Sent Events (SSE) エンドポイント
  if (req.url === '/api/stream') {
    console.log('\n[SSE] クライアントがストリーム接続を開始しました');
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // 接続維持 (Keep-Alive) のまま定期的にプッシュ
    let count = 0;
    const timer = setInterval(() => {
      count++;
      const payload = {
        id: count,
        time: new Date().toLocaleTimeString(),
        val: (Math.random() * 50 + 100).toFixed(1)
      };
      // SSEの仕様: 'data: <内容>\n\n'
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
      console.log(`[SSE 送信 #${count}]: ${JSON.stringify(payload)}`);
    }, 2000);

    req.on('close', () => {
      console.log('[SSE] クライアントが切断しました (FIN受信)');
      clearInterval(timer);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

// 3. WebSocket (HTTP Upgrade -> 101 Switching Protocols)
server.on('upgrade', (req, socket, head) => {
  if (req.headers['upgrade']?.toLowerCase() !== 'websocket') {
    socket.destroy();
    return;
  }

  // 101 ハンドシェイクキーの生成 (RFC 6455)
  const clientKey = req.headers['sec-websocket-key'];
  const acceptKey = crypto
    .createHash('sha1')
    .update(clientKey + WS_GUID)
    .digest('base64');

  // スライド10で解説した「101 Switching Protocols」レスポンスを直接送信
  const responseHeaders = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptKey}`,
    '\r\n'
  ].join('\r\n');

  socket.write(responseHeaders);
  console.log('\n[WebSocket] 101 Switching Protocols ハンドシェイク成立！');
  console.log('[WebSocket] TCPコネクションを双方向ソケット通信に昇格させました');

  // 接続完了の瞬間に、サーバーから最初のメッセージを1通即座に送信
  setTimeout(() => {
    sendWsTextFrame(socket, '🎉 接続完了！WebSocketの世界へようこそ');
  }, 100);

  // WebSocket フレーム受信処理 (RFC 6455 準拠)
  socket.on('data', (buffer) => {
    // 最初のバイトから opcode を取得 (0x1 = テキストフレーム, 0x8 = 切断)
    const opcode = buffer[0] & 0x0f;
    if (opcode === 0x8) {
      console.log('[WebSocket] クライアントから切断フレームを受信');
      socket.end();
      return;
    }

    if (opcode === 0x1) { // テキストデータ
      const isMasked = (buffer[1] & 0x80) === 0x80;
      let payloadLength = buffer[1] & 0x7f;
      let offset = 2;

      if (payloadLength === 126) {
        payloadLength = buffer.readUInt16BE(2);
        offset = 4;
      }

      let dataBuffer;
      if (isMasked) {
        const maskKey = buffer.slice(offset, offset + 4);
        offset += 4;
        const maskedData = buffer.slice(offset, offset + payloadLength);
        dataBuffer = Buffer.alloc(payloadLength);
        for (let i = 0; i < payloadLength; i++) {
          dataBuffer[i] = maskedData[i] ^ maskKey[i % 4];
        }
      } else {
        dataBuffer = buffer.slice(offset, offset + payloadLength);
      }

      const receivedText = dataBuffer.toString('utf8');
      console.log(`[WebSocket 受信]: "${receivedText}"`);

      // サーバーからエコーフレームを返送 (サーバー -> クライアント)
      sendWsTextFrame(socket, `Echo from Server: ${receivedText}`);
    }
  });

  socket.on('close', () => {
    console.log('[WebSocket] コネクションが切断されました');
  });
});

/**
 * サーバーからクライアントへ WebSocket テキストフレームを送信する関数 (未マスク)
 */
function sendWsTextFrame(socket, text) {
  const payload = Buffer.from(text, 'utf8');
  const len = payload.length;
  let header;

  if (len < 126) {
    header = Buffer.from([0x81, len]);
  } else if (len <= 65535) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }

  socket.write(Buffer.concat([header, payload]));
  console.log(`[WebSocket 送信]: "${text}"`);
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log('====================================================');
  console.log(` リアルタイム通信デモサーバー起動 (ゼロ依存版)`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log('====================================================');
});
