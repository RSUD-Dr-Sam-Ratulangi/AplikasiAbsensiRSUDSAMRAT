import io from 'socket.io-client';

const SOCKET_URL = 'http://rsudsamrat.site:3001';

class WSService {
  [x: string]: any;
  initializeSocket = async () => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      console.log('=====socket=======', this.socket);
      this.socket.on('connection', data => {
        console.log('===============connected===============');
      });

      this.socket.on('disconnect', data => {
        console.log('disconnected');
      });

      this.socket.on('error', data => {
        console.log('error', data);
      });
    } catch (e) {
      console.log('error from socket', e);
    }
  };

  emit = (event: string, data: any) => {
    this.socket.emit(event, data);
  };
  on = (event: string, callback: any) => {
    this.socket.on(event, callback);
  };
  off = (event: string, callback: any) => {
    this.socket.off(event, callback);
  };
  removeListener = listenerName => {
    this.socket.removeListener(listenerName);
  };
}

const socketService = new WSService();

export default socketService;
