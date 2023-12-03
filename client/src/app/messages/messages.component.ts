import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../_services/messages.service';
import { Message } from '../_models/message';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as polishStrings } from "ngx-timeago/language-strings/pl";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  user: User | null = null;
  container = 'Unread';

  constructor(private messagesService: MessagesService, private accountService: AccountService,
    private toastr: ToastrService, intl: TimeagoIntl) {
    intl.strings = polishStrings;
    intl.changes.next();
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user; 
        }
      }
    })
  }

  ngOnInit(): void {
    this.getMessagesForUser('Unread');
  }

  getMessagesForUser(container: string) {
    this.container = container;
    if (this.user)
      this.messagesService.getMessagesForUser(this.user.id, this.container).subscribe({
        next: messages => {
          this.messages = messages
        }
      })
  }

  deleteMessage(messageId: number) {
    this.messagesService.deleteMessage(messageId).subscribe({
      next: () => {
        this.messages?.splice(this.messages.findIndex(m => m.id === messageId), 1)
        this.toastr.success("Wiadomość została usunięta");
      }
    })
  }
}
