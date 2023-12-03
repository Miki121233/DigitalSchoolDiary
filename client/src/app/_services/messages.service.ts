import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { MessageContent } from '../_models/messageContent';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessagesForUser(userId: number, container: string) {
    let params = new HttpParams();
    params = params.append('container', container);
    return this.http.get<Message[]>(this.baseUrl + 'messages/' + userId, { params });
  }

  getMessagesForThread(userId: number, recipientId: number | string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/' + userId + '/' + recipientId);
  }

  sendMessage(userId: number, recipientId: number | string, messageContent: MessageContent) {
    return this.http.post<Message>(this.baseUrl + 'messages/' + userId + '/' + recipientId, messageContent);
  }

  deleteMessage(messageId: number) {
    return this.http.delete(this.baseUrl + 'messages/' + messageId);
  }

}
