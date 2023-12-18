import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { UserService } from 'src/app/_services/user.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-management-users',
  templateUrl: './management-users.component.html',
  styleUrls: ['./management-users.component.css']
})
export class ManagementUsersComponent {
  members: Member[] = [];
  user: User | null = null;

  constructor(private userService: UserService, private toastr: ToastrService,
    private dialog: MatDialog, private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: response => this.user = response
    });
    this.loadUsers();
  }

  loadUsers() {
    if (this.user !== null) {
      this.userService.getAllMembers().subscribe({
        next: response => {
          this.members = response;
          this.members = this.members.filter(x => x.id !== this.user!.id)
        }
      });
    };
  }

  deleteUser(member: Member) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Czy na pewno chcesz permamentnie usunąć tego ucznia? Usunięcie go w tym miejscu spowoduje '
      + 'usunięcie wszystkich powiązanych z nim danych - ocen, uwag, obecności, wiadomości itd.' },
    });
  
    confirmationDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.deleteUser(member.id).subscribe({
          next: () => {
            this.members = this.members.filter(x => x.id !== member.id);
            this.toastr.success('Pomyślnie usunięto użytkownika ' + member.firstName +' '
            + member.lastName);
          }
        });
      }
    });
  }
}
