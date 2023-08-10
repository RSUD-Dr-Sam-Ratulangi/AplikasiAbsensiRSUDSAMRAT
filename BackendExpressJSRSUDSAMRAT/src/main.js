const express = require('express');
const http = require('http');
const ModuleDatabase = require('./modules/database');
const path = require('path');
const Config = require('./config/config');
const MiddlewareVerifyToken = require('./middleware/verify-token');

const app = express();
const server = http.createServer(app);
const RouterApi = express.Router();
const { Server } = require('socket.io');
const io = new Server(server);

app.disable('x-powered-by');
app.use(express.urlencoded({ limit: '30000kb', extended: true }));
app.use(express.json({ limit: '30000kb' }));

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    io.emit('message', msg);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'));
});

app.use('/api', [], RouterApi);

(async () => {
  try {
    await ModuleDatabase.connect()
      .then(() => {
        console.log('[server_ok] Terhubung ke basis data');
      })
      .catch((err) => {
        console.log('[server_error] Gagal terhubung ke basis data');
      });

    RouterApi.get('/', (req, res) => {
      res.send('Halo Dunia');
    });

    RouterApi.get('/ping', MiddlewareVerifyToken, (req, res) => {
      res.send('pong');
    });

    RouterApi.use('/auth', require('./routes/auth').RouterAdmin);

    server.listen(Config.HTTP_PORT, () => {
      console.log(`[server_ok] Server berjalan di port ${Config.HTTP_PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
