import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private readonly serverUrl = 'ws://localhost:3000';
  private socket: WebSocket | undefined;

  private messageSubject = new BehaviorSubject<string>("");
  private isConnected = new BehaviorSubject<boolean>(false);
  private leader = new BehaviorSubject<boolean>(false);

  public isConnected$ = this.isConnected.asObservable();
  public messageSubject$ = this.messageSubject.asObservable();
  public leader$ = this.leader.asObservable();

  constructor() {
  }

  connect(message: string) {
    this.socket = new WebSocket(this.serverUrl);
    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened');
      this.isConnected.next(true);
      this.sendMessage(message);
    };

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed');
      this.isConnected.next(false);
      this.reconnect();
    };
  }

  disconnect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      this.setLeader(false);
    }
  }

  private reconnect() {
    // Implement reconnection logic here if needed
  }

  sendMessage(message: string) {
    if (this.socket != undefined && this.socket.readyState === WebSocket.OPEN) {
      console.log(message);
      this.socket.send(message);
    }
  }

  setLeader(status: boolean) {
    this.leader.next(status);
  }

}
