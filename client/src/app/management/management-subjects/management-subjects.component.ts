import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PostSubject } from 'src/app/_models/postSubject';
import { SchoolSubject } from 'src/app/_models/schoolSubject';
import { SubjectsService } from 'src/app/_services/subjects.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-management-subjects',
  templateUrl: './management-subjects.component.html',
  styleUrls: ['./management-subjects.component.css']
})
export class ManagementSubjectsComponent {
  subjects: SchoolSubject[] = [];
  subjectName = '';
  postSubject?: PostSubject;

  constructor(private subjectsService: SubjectsService, private toastr: ToastrService,
    private dialog: MatDialog) {
    this.getSubjects();
  }

  getSubjects() {
    this.subjectsService.getAllSubjects().subscribe({
      next: response => {
        this.subjects = response
      }
    });
  }

  createNewSubject() {
    if (this.subjectName && this.subjectName !== '') {
      this.postSubject = {
        name: this.subjectName
      };
      this.subjectsService.postSubject(this.postSubject).subscribe({
        next: response => {
          this.subjects.push(response);
          this.toastr.success('Pomyślnie dodano nowy przedmiot o nazwie ' + response.name);
        },
        error: error => {
          this.toastr.error(error.error);
        }
      })
    }
  }

  deleteSubject(subject: SchoolSubject) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Czy na pewno chcesz permamentnie usunąć ten przedmiot? Usunięcie go w tym miejscu spowoduje '
      + 'kaskadowe usunięcie go w każdej klasie' },
    });
  
    confirmationDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.subjectsService.deleteSubject(subject.id).subscribe({
          next: () => {
            this.subjects = this.subjects.filter(x => x.id !== subject.id);
            this.toastr.success('Pomyślnie usunięto przedmiot ' + subject.name);
          }
        });
      }
    });
  }
}
