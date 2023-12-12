import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../_services/messages.service';
import { Message } from '../_models/message';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as polishStrings } from "ngx-timeago/language-strings/pl";
import { UserService } from '../_services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  user: User | null = null;
  container = 'Unread';
  contains = '';
  filteredUsers: User[] = [];

  constructor(private messagesService: MessagesService, private accountService: AccountService,
    private toastr: ToastrService, intl: TimeagoIntl, private userService: UserService,
    private dialog: MatDialog) {
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

  search() {
    this.userService.getUsersContainingString(this.contains).subscribe({
      next: response => {
        this.filteredUsers = response
        if (this.user)
          this.filteredUsers = this.filteredUsers.filter(user => user.id !== this.user!.id);
      }
    })
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
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Czy na pewno chcesz usunąć tą wiadomość?' },
    });
  
    confirmationDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.messagesService.deleteMessage(messageId).subscribe({
          next: () => {
            this.messages?.splice(this.messages.findIndex(m => m.id === messageId), 1)
            this.toastr.success("Wiadomość została usunięta");
          }
        })
      }
    });
  }
}
