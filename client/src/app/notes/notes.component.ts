import { Component } from '@angular/core';
import { take } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { NotesService } from '../_services/notes.service';
import { ActivatedRoute } from '@angular/router';
import { Note } from '../_models/note';
import { UserService } from '../_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { PostNote } from '../_models/postNote';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {
  user: User | null = null;
  studentsForDisplay: any;
  contains = '';
  filteredUsers: User[] = [];
  noteDescription: string | null = null;
  isPositive: boolean | null = null;
  formStudent: User | null = null;
  selectedPersonName: string = '';
  postNote: PostNote | null = null;

  constructor(private accountService: AccountService, private notesService: NotesService,
    private route: ActivatedRoute, private userService: UserService, private toastr: ToastrService,
    private dialog: MatDialog) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
    this.getStudentsForDisplayFromClass();
  }

  getStudentsForDisplayFromClass() {
    this.route.paramMap.subscribe(params => {
      this.notesService.getStudentsWithNotesFromClass(parseInt(params.get('classId')!)).subscribe({
        next: response => {
          this.studentsForDisplay = response
        }
      })
    })
  }

  search() {
    if (this.contains) {
      this.formStudent = null;
      this.selectedPersonName = 'Wyszukaj osobę...';
      this.filteredUsers = this.studentsForDisplay.filter((student: { firstName: string; lastName: string; }) =>
        student.firstName.toLowerCase().includes(this.contains.toLowerCase()) ||
        student.lastName.toLowerCase().includes(this.contains.toLowerCase())
      );
    } else {
      this.filteredUsers = this.studentsForDisplay;
    }
    console.log('this.filteredUsers');
    console.log(this.filteredUsers);
  }

  assignNote() {
    if (this.user && (this.user.accountType === 'Teacher' || this.user.accountType === 'Director')) {
      this.postNote = {
        description: this.noteDescription!,
        isPositive: this.isPositive!,
        teacherId: this.user.id
      };
      if (!this.formStudent) {
        this.toastr.error("Wybierz ucznia, któremu chcesz przypisać uwagę")
        return;
      }
      if (this.postNote) {
        if (this.postNote.description === '' || !this.postNote.description || this.postNote.description.length < 4) {
          this.toastr.error("Proszę wprowadzić opis oceny (min. 4 znaki)")
          return;
        }
        if (this.postNote.isPositive === null) {
          this.toastr.error("Wybierz typ uwagi")
          return;
        }
      }
      this.notesService.postNote(this.formStudent.id, this.postNote).subscribe({
        next: response => {
          this.toastr.success(`Pomyślnie utworzono uwagę dla ${this.formStudent?.lastName} ${this.formStudent?.firstName}`);
          const foundStudent = this.studentsForDisplay.find((student: { id: any; }) => student.id === this.formStudent!.id);
          if (foundStudent) 
            foundStudent.notes.push(response);
        },
        error: error => {
          this.toastr.error(error.error);
        }
      });
    }
  }

  assignFormStudentId(person: User) {
    this.contains = '';
    this.filteredUsers = [];
    this.selectedPersonName = `${person.lastName} ${person.firstName}`;
    this.formStudent = person;
  }

  deleteNote(note: Note) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Czy na pewno chcesz usunąć tą uwagę?' },
    });
  
    confirmationDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.notesService.deleteNote(note.id).subscribe({
          next: () => {
            this.toastr.success('Pomyślnie usunięto uwagę');
            const foundUser = this.studentsForDisplay.find((user: { notes: any[]; }) => user.notes.some((n: { id: number; }) => n.id === note.id));
            if (foundUser) {
              foundUser.notes = foundUser.notes.filter((n: { id: number; }) => n.id !== note.id);
            }
          }
        });
      }
    });
  }

}
