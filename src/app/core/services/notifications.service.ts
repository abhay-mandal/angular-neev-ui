import { Injectable } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { AuthService } from '@app/core/services/auth.service';
import { environment } from '@env/environment';
import { DataService } from '@app/core/services/data.service';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private stompClient;
  private SOCKET_URL;
  private headers;

  constructor(private authService: AuthService, private dataService: DataService) {
  }

  initialize() {
    this.SOCKET_URL = environment.WEBSOCKET_HOST+"ws";
    this.initializeWebSocketConnection(this.authService.getEncodedToken(),this.authService.getLoggedInUserDetails()['email']);
  }

  disconnect() {
    this.disconnectFromWebSocket(this.headers);
  }

  initializeWebSocketConnection(token, email) {
    const ws = new SockJS(this.SOCKET_URL);
    this.stompClient = Stomp.over(ws);
    this.headers = { 'simpUser': email, 'Authorization' : `Bearer ${token}`};
    this.stompClient.connect(this.headers, ((frame) => {
      this.stompClient.subscribe('/user/queue/notifications', ((notification) => {
        const noticationBody = JSON.parse(notification.body);
        const id =  JSON.parse(notification.body).id;
        const notificationObj = { content : noticationBody.content , link : noticationBody.link, id };
        this.dataService.updateObservableAarrayObject(notificationObj, 'notificationObj');
      }), this.headers);
      this.fetchUnreadMessages(email);
    }));
  }

  sendMessage(fromUser, toUser, content) {
    const messageObject = { type : 'Message', sender : fromUser, content, to : toUser };
    this.stompClient.send('/app/message/user/' + toUser, {} , JSON.stringify(messageObject));
  }

  fetchUnreadMessages(currentUser){
    this.stompClient.send('/app/message/user/unread/' + currentUser, {});
  }

  sendPageShareNotification(fromUser, toUser, pageId){
    const pageLink = window.location.href;
    const content = 'Hey there,' + '\n' + fromUser + ' has shared a page with you.\n' + 'Please take a look at it by visiting this link.\n';
    const messageObject = { type : 'Message', sender : fromUser, content, link : pageLink };
    for (let index in toUser) {
      messageObject["to"] = toUser[index];
      this.stompClient.send('/app/message/user/'+toUser[index], {} , JSON.stringify(messageObject));
    }
  }

  disconnectFromWebSocket(headers) {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {}, headers);
    }
  }
}
