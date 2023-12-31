import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { User } from '../_models/user';
import { MessagesService } from '../_services/messages.service';
import { Message } from '../_models/message';
import { strings as polishStrings } from "ngx-timeago/language-strings/pl";
import { TimeagoIntl } from 'ngx-timeago';
import { NgForm } from '@angular/forms';
import { MessageContent } from '../_models/messageContent';

@Component({
  selector: 'app-message-threads',
  templateUrl: './message-threads.component.html',
  styleUrls: ['./message-threads.component.css']
})
export class MessageThreadsComponent {
  @ViewChild('messageForm') messageForm?: NgForm
  recipientId?: number;
  user: User | null = null;
  messages: Message[] = [];
  messageContent: MessageContent | null = null;
  content = '';

  constructor(private accountService: AccountService, private route: ActivatedRoute,
    private messagesService: MessagesService, intl: TimeagoIntl) {
    intl.strings = polishStrings;
    intl.changes.next();
    
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });
    this.route.paramMap.subscribe(params => {
      this.recipientId = parseInt(params.get('userId')!)
    });
    this.getMessageThread();
  }

  getMessageThread() {
    if (this.user && this.recipientId) {
      this.messagesService.getMessagesForThread(this.user.id, this.recipientId).subscribe({
        next: messages => {
          this.messages = messages
        }
      });
    }
  }

  sendMessage() {
    if (this.user && this.recipientId && this.content !== '') {
      this.messageContent = { content: this.content }
      this.content = '';
      this.messagesService.sendMessage(this.user.id, this.recipientId, this.messageContent).subscribe({
        next: () => {
          this.getMessageThread();
        }
      })

    }
  }

}
