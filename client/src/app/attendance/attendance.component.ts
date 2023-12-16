import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { ClassesService } from '../_services/classes.service';
import { SubjectsService } from '../_services/subjects.service';
import { Attendance } from '../_models/attendance';
import { SchoolSubject } from '../_models/schoolSubject';
import { User } from '../_models/user';
import { AttendancesService } from '../_services/attendances.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {
  classId: number | undefined;
  description: string = '';
  attendanceDescriptions: string[] = [];
  attendanceValues: boolean[] = [];
  attendancePost: Attendance | null = null;
  user: User | null = null;
  studentsForDisplay: any;
  students: User[] = [];
  attendances: Attendance[] = [];
  subject: SchoolSubject | null = null;

  constructor(private route: ActivatedRoute, private accountService: AccountService, 
    private classesService: ClassesService, private attendancesService: AttendancesService,
    private toastr: ToastrService, private subjectsService: SubjectsService, private dialog: MatDialog) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
      })
    }

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.classId = parseInt(params.get('classId')!)
        this.getStudentsFromClass(this.classId);
      });
      this.getSubjectFromUrl();
      this.getStudentAttendances();
    }
  
    getStudentsFromClass(id: number) {
      this.classesService.getStudentsFromClass(id).subscribe({
        next: response => this.students = response
      });
  
      for (let i = 0; i < this.students.length; i++) {
        this.attendanceDescriptions[i] = "1";
      }
    }
  
    getStudentAttendances() {
      this.route.paramMap.subscribe(params => {
        if (this.classId)
          this.attendancesService.getStudentsAttendances(this.classId, params.get('subjectId')!).subscribe({
            next: response => {
             this.studentsForDisplay = response
             console.log(this.studentsForDisplay)
            }
        });
        else console.log('Problem z getStudentAttendances()' + this.classId + this.subject);
      });
    }
  
    getAttendancesFromClassId() {
      this.attendancesService.getAttendancesFromClassId(this.classId!).subscribe({
        next: response => this.attendances = response
      });
    }
  
    updateDescriptions() {
      // Ta funkcja jest wywoływana przy zmianach w polu "Opis"
      for (let i = 0; i < this.attendanceDescriptions.length; i++) {
        this.attendanceDescriptions[i] = this.description;
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
  
    assignAttendance(student: User, index: number) {
      if(this.user && this.subject)
      this.attendancePost = {
        description: this.attendanceDescriptions[index],
        value: this.attendanceValues[index],
        subject: this.subject.name,
        teacherId: this.user.id
      };
      if (this.attendancePost) {
        if (this.attendancePost.description === '' || typeof(this.attendancePost.description) === typeof(undefined)) {
          this.toastr.error("Proszę wprowadzić opis obecności")
          return;
        }
        if (this.attendancePost.value === null || typeof(this.attendancePost.value) === typeof(undefined)) {
          this.toastr.error("Proszę wprowadzić wartość obecności")
          return;
        }
  
        this.attendancesService.postAttendanceForUser(student.id, this.attendancePost).subscribe({
          next: response => {
            this.toastr.success(`Wystawiono obecność dla ${student.firstName} 
            ${student.lastName} z opisem: ${this.attendanceDescriptions[index]}`);
  
            this.studentsForDisplay[index].attendances.push(response);
          },
          error: error => {
            console.log('Błędy z przypisaniem obecności: ' + error.error)
          }
        });
        this.getAttendancesFromClassId();
        this.getStudentAttendances();
      }
    }
  
    assignAllAttendances() {
      for (let i = 0; i < this.students.length; i++) {
        this.assignAttendance(this.students[i], i);
      }
    }
  
    deleteAttendance(attendance: Attendance) {
      const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: { message: 'Czy na pewno chcesz usunąć tą obecność?' },
      });
    
      confirmationDialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.attendancesService.deleteAttendance(attendance.id!).subscribe({
            next: () => {
              this.toastr.success('Usunieto obecność z opisem: ' + attendance.description);
              const studentIndex = this.studentsForDisplay.findIndex((student: { attendances: Attendance[]; }) => student.attendances.some(g => g.id === attendance.id));
              if (studentIndex !== -1) {
                this.studentsForDisplay[studentIndex].attendances = this.studentsForDisplay[studentIndex].attendances.filter((g: { id: number | undefined; }) => g.id !== attendance.id);
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
