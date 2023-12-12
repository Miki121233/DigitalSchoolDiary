import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { Subject, take } from 'rxjs';
import { Class } from '../_models/class';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ClassesService } from '../_services/classes.service';
import { GradesService } from '../_services/grades.service';
import { Grade } from '../_models/grade';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SchoolSubject } from '../_models/schoolSubject';
import { SubjectsService } from '../_services/subjects.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  classId: string | undefined;
  description: string = '';
  gradeDescriptions: string[] = [];
  gradeValues: number[] = [];
  gradePost: Grade | null = null;
  user: User | null = null;
  studentsForDisplay: any;
  students: User[] = [];
  grades: Grade[] = [];
  subject: SchoolSubject | null = null;

  constructor(private route: ActivatedRoute, private accountService: AccountService, 
    private classesService: ClassesService, private gradesService: GradesService,
    private toastr: ToastrService, private subjectsService: SubjectsService, private dialog: MatDialog) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
   }

  ngOnInit(): void {
    // this.route.data.subscribe({
    //   next: data => {
    //     this.class = data['class'];
    //     this.getStudentsFromClass(this.class.id);
    //   }
    // });
    this.route.paramMap.subscribe(params => {
      this.classId = params.get('classId')!
      this.getStudentsFromClass(this.classId);
    });
    this.getSubjectFromUrl();
    this.getStudentGrades();
  }

  getStudentsFromClass(id: string) {
    this.classesService.getStudentsFromClass(id).subscribe({
      next: response => this.students = response
    });

    for (let i = 0; i < this.students.length; i++) {
      this.gradeDescriptions[i] = "1";
    }
  }

  getStudentGrades() {
    //if (this.classId && this.subject)
    this.route.paramMap.subscribe(params => {
      if (this.classId)
        this.gradesService.getStudentsGrades(this.classId, params.get('subjectId')!).subscribe({
          next: response => {
           this.studentsForDisplay = response
           console.log(this.studentsForDisplay)
          }
      });
      else console.log('Problem z getStudentGrades()' + this.classId + this.subject);
    });
  }

  getGradesFromClassId() {
    this.classesService.getGradesFromClassId(this.classId!).subscribe({
      next: response => this.grades = response
    });
  }

  updateDescriptions() {
    // Ta funkcja jest wywoływana przy zmianach w polu "Opis"
    for (let i = 0; i < this.gradeDescriptions.length; i++) {
      this.gradeDescriptions[i] = this.description;
    }
  }

  getSubjectFromUrl() {
    this.route.paramMap.subscribe(params => {
      const subjectId = params.get('subjectId');
      if (subjectId)
      this.subjectsService.getSubjectFromId(subjectId).subscribe({
        next: response => {
          this.subject = response
        }
      })
    });
  }

  assignGrade(student: User, index: number) {
    if(this.user && this.subject)
    this.gradePost = {
      description: this.gradeDescriptions[index],
      value: this.gradeValues[index],
      subject: this.subject.name,
      teacherId: this.user.id
    };
    if (this.gradePost) {
      if (this.gradePost.description === '' || typeof(this.gradePost.description) === typeof(undefined)) {
        this.toastr.error("Proszę wprowadzić opis oceny")
        return;
      }
      if (this.gradePost.value <= 0 || this.gradePost.value > 6 || !this.gradePost.value) {
        this.toastr.error("Ocena musi być pomiędzy 1 - 6")
        return;
      }

      this.gradesService.postGradeForUser(student.id, this.gradePost).subscribe({
        next: response => {
          this.toastr.success(`Wystawiono ocenę ${this.gradeValues[index]} dla ${student.firstName} 
          ${student.lastName} z opisem: ${this.gradeDescriptions[index]}`);

          this.studentsForDisplay[index].grades.push(response);
        },
        error: error => {
          console.log('Błędy z przypisaniem ocen: ' + error.error)
        }
      });
      this.getGradesFromClassId(); // mozliwe ze to za duzo razy sie niepotrzebnie wykonuje, ewentualne obejscie to pole refresh
      this.getStudentGrades();
    }
  }

  assignAllGrades() {
    for (let i = 0; i < this.students.length; i++) {
      this.assignGrade(this.students[i], i);
    }
  }

  deleteGrade(grade: Grade) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Czy na pewno chcesz usunąć tą ocenę?' },
    });
  
    confirmationDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.gradesService.deleteGrade(grade.id!).subscribe({
          next: () => {
            this.toastr.success('Usunieto ocenę z opisem: ' + grade.description);
            const studentIndex = this.studentsForDisplay.findIndex((student: { grades: Grade[]; }) => student.grades.some(g => g.id === grade.id));
            if (studentIndex !== -1) {
              this.studentsForDisplay[studentIndex].grades = this.studentsForDisplay[studentIndex].grades.filter((g: { id: number | undefined; }) => g.id !== grade.id);
            }
          },
          error: error => {
            this.toastr.error(error.error);
          }
        })
      }
    });
  }

}
