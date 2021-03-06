import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ENV } from '@app/env';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  public socket: SocketIOClient.Socket;
  public debug = ENV.mode === "Development";
  static serverCode = '';

  constructor() {
    this.socket = io(this.debug ? 'localhost:3030' : 'https://gateway.back-chat.com', {
      path: '/'
    });
    this.socket.on('disconnect', () => {

    });
    if (SocketService.serverCode) this.Join(SocketService.serverCode);
  }

  Join(server: string) {
    SocketService.serverCode = server;
    return new Promise((resolve, reject) => {
      this.socket.emit('join', server, res => {
        if (res) {
          resolve(true);
        }
        else {
          reject(false);
        }
      });
    });
  }

  Disconnect() {
    this.socket.disconnect();
  }

  Debug() {
    this.socket.emit('debug', res => {
      console.log(res);
    });
  }

  sendMessage(data) {
    console.log("why");
    return new Promise((resolve, reject) => {
      console.log("why2");
      this.socket.emit('send-message', data, res => {
        if (res) {
          resolve(true);
        }
        else {
          reject(false);
        }
      });
    });
  }

  onNewMessage() {
    console.log('listening for messages');
    return Observable.create(observer => {
      this.socket.on('new-message', data => {
        console.log("I GOT A NEW MESSAGE!");
        observer.next(data);
      });
    });
  }

  onNewMember() {
    return Observable.create(observer => {
      this.socket.on('member', data => {
        observer.next(data);
      });
    });
  }

  onNewChannel() {
    return Observable.create(observer => {
      this.socket.on('channel', data => {
        observer.next(data);
      });
    });
  }

  onMemberLeave() {
    return Observable.create(observer => {
      this.socket.on('user-disconnect', data => {
        observer.next(data);
      });
    });
  }
}
