import { Component } from '@angular/core';
import { take } from 'rxjs';
import { Note } from 'src/app/_models/note';
import { StudentChildren } from 'src/app/_models/studentChildren';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { NotesService } from 'src/app/_services/notes.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-notes',
  templateUrl: './user-notes.component.html',
  styleUrls: ['./user-notes.component.css']
})
export class UserNotesComponent {
  user: User | undefined;
  child: StudentChildren | null = null;
  notes: Note[] = [];

  constructor(private accountService: AccountService, private notesService: NotesService,
    private userService: UserService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: response => {
        if (response)
          this.user = response;
      }
    })
    this.userService.currentChild$.pipe(take(1)).subscribe({
      next: child => {
        if (child) {
          this.child = child;
        }
      }
    });
    this.getNotesForStudent();
  }

  getNotesForStudent() {
    if(this.user?.accountType === 'Student') {
      if(this.user) {
        this.notesService.getNotesForStudent(this.user.id).subscribe({
          next: response => {
            this.notes = response 
          }
        });
      }
    }
    if(this.user?.accountType === 'Parent') {
      if(this.child) {
        this.notesService.getNotesForStudent(this.child.id).subscribe({
          next: response => {
            this.notes = response 
          }
        });
      }
    }
  }

}
