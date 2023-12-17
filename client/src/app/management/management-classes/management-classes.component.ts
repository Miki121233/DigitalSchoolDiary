import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SchoolSubject } from 'src/app/_models/schoolSubject';
import { User } from 'src/app/_models/user';
import { ClassesService } from 'src/app/_services/classes.service';
import { SubjectsService } from 'src/app/_services/subjects.service';
import { UserService } from 'src/app/_services/user.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-management-classes',
  templateUrl: './management-classes.component.html',
  styleUrls: ['./management-classes.component.css']
})
export class ManagementClassesComponent {
  classId: number | null = null;
  classSchoolId?: string;
  subjects: SchoolSubject[] = [];
  students: User[] = [];
  filteredSubjects: SchoolSubject[] = [];
  filteredUsers: User[] = [];
  subjectContains = '';
  userContains = ''; 
  selectedSubjectName: string = '';
  selectedPersonName: string = '';
  formSubject?: SchoolSubject;
  formStudent?: User;

  constructor(private subjectsService: SubjectsService, private route: ActivatedRoute,
    private classesService: ClassesService, private toastr: ToastrService, private dialog: MatDialog,
    private router: Router, private userService: UserService) {
    this.route.paramMap.subscribe(params => {
      this.classId = parseInt(params.get('classId')!);
      this.subjectsService.getSubjectsFromClassId(this.classId);
    });
    this.getSubjects();
    this.getStudents();
    this.getClassSchoolId();

  }

  getSubjects() {
    if (this.classId) {
      this.subjectsService.getSubjectsFromClassId(this.classId).subscribe({
        next: response => {
          this.subjects = response
        }
      });
    }
  }

  getStudents() {
    if (this.classId) {
      this.classesService.getStudentsFromClass(this.classId).subscribe({
        next: response => {
          this.students = response
        }
      });;
    }
  }

  addSubjectToClass() {
    if (this.classId && this.formSubject) {
      this.classesService.addSubjectToClass(this.classId, this.formSubject.id).subscribe({
        next: response => {
          this.toastr.success('Przypisano przemiot ' + this.formSubject?.name + ' do tej klasy');
          this.subjects.push(response);
        }
      })
    }
  }

  addStudentToClass() {
    if (this.classId && this.formStudent) {
      this.classesService.addStudentToClass(this.classId, this.formStudent.id).subscribe({
        next: response => {
          this.toastr.success('Przypisano ' + this.formStudent?.firstName + ' ' + this.formStudent?.lastName + ' do tej klasy');
          this.students.push(response);
        }
      })
    }
  }

  removeSubject(subject: SchoolSubject) {
    if (this.classId) {
      this.classesService.removeSubjectFromClass(this.classId, subject.id).subscribe({
        next: () => {
          this.subjects = this.subjects.filter(x => x.id !== subject.id);
          this.toastr.success('Pomyślnie odpięto przedmiot');
        }
      });
    }
  }

  removeStudent(student: User) {
    if (this.classId) {
      this.classesService.removeStudentFromClass(this.classId, student.id).subscribe({
        next: () => {
          this.students = this.students.filter(x => x.id !== student.id);
          this.toastr.success('Pomyślnie odpięto ucznia');
        }
      });
    }
  }

  assignFormStudentId(person: User) {
    this.userContains = '';
    this.filteredUsers = [];
    this.selectedPersonName = `${person.lastName} ${person.firstName}`;
    this.formStudent = person;
  }

  assignFormSubjectId(subject: SchoolSubject) {
    this.subjectContains = '';
    this.filteredSubjects = [];
    this.selectedSubjectName = `${subject.name}`;
    this.formSubject = subject;
  }

  searchUser() {
    if (this.userContains !== '') {
      this.formStudent = undefined;
      this.selectedPersonName = 'Wyszukaj osobę...';
      this.userService.getStudentsContainingString(this.userContains).subscribe({
        next: response => {
          this.filteredUsers = response
        }
      })
    }
    else {
      this.filteredUsers = [];
    }
  }

  searchSubject() {
    if (this.subjectContains !== '') {
      this.formSubject = undefined;
      this.selectedSubjectName = 'Wyszukaj osobę...';
      this.subjectsService.getSubjectsContainingString(this.subjectContains).subscribe({
        next: response => {
          this.filteredSubjects = response
        }
      })
    }
    else {
      this.filteredSubjects = [];
    }
  }

  deleteClass() {
    if (this.classId) {
      const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: { message: 'Czy na pewno chcesz usunąć tą klasę? Usunie to wszelkie powiązania przedmiotów oraz uczniów z tą klasą' },
      });
    
      confirmationDialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.classesService.deleteClass(this.classId!).subscribe({
            next: () => {
              this.toastr.success('Usunieto klasę ' + this.classSchoolId);
              this.router.navigateByUrl('zarzadzanie-klasami');
            },
            error: error => {
              this.toastr.error(error.error);
            }
          })
        }
      });
    }
  }

  getClassSchoolId() {
    if (this.classId) {
      this.classesService.getSchoolIdFromClassId(this.classId).subscribe({
        next: response => {
          this.classSchoolId = response
        }
      });
    }
  }
}
