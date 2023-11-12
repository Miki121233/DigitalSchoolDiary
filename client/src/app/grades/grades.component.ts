import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { Class } from '../_models/class';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ClassesService } from '../_services/classes.service';
import { GradesService } from '../_services/grades.service';
import { Grade } from '../_models/grade';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  baseUrl = environment.apiUrl;
  class: Class | any;
  description: string = '';
  gradeDescriptions: string[] = [];
  gradeValues: number[] = [];
  gradePost: Grade | undefined;
  user: User | null = null;
  students: User[] = [];
  grades: Grade[] = [];

  constructor(private route: ActivatedRoute, private accountService: AccountService, private http: HttpClient, 
    private classesService: ClassesService, private gradesService: GradesService, private fb: FormBuilder,
    private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
   }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.class = data['class'];
        this.getStudentsFromClass(this.class.id);
      }
    });
  }

  getStudentsFromClass(id: number) {
    this.classesService.getStudentsFromClass(id).subscribe({
      next: response => this.students = response
    });

    for (let i = 0; i < this.students.length; i++) {
      this.gradeDescriptions[i] = "1";
    }
  }

  getGradesForStudentFromId() {
    if(this.user?.accountType === 'Student') {
      if(this.user?.classId)
        this.gradesService.getGradesForStudentFromId(this.user?.id).subscribe({
          next: response => {
            this.grades = response 
            console.log(response)
          }
      });
      else 
        console.log('Bląd podczas wyświetlania ocen studenta względem klasy')
    }
  }

  updateDescriptions() {
    // Ta funkcja jest wywoływana przy zmianach w polu "Opis"
    for (let i = 0; i < this.gradeDescriptions.length; i++) {
      this.gradeDescriptions[i] = this.description;
    }
  }

  assignGrade(student: User, index: number) {
    this.gradePost = {
      description: this.gradeDescriptions[index],
      value: this.gradeValues[index]
    };
    if (this.gradePost.description === '' || typeof(this.gradePost.description) === typeof(undefined)) {
      this.toastr.error("Proszę wprowadzić opis oceny")
      return;
    }
    if (this.gradePost.value < 0 || this.gradePost.value > 6 || this.gradePost.value === 0) {
      this.toastr.error("Ocena musi być pomiędzy 1 - 6")
      return;
    }

    this.gradesService.postGradeForUser(student.id, this.gradePost).subscribe({
      next: () => {
        this.toastr.success(`Wystawienio ocenę ${this.gradeValues[index]} dla ${student.firstName} 
        ${student.lastName} z opisem: ${this.gradeDescriptions[index]}`);
        
      },
      error: error => {
        console.log('Błędy z przypisaniem ocen: ' + error.error)
      }
    });
  }

  assignAllGrades() {
    for (let i = 0; i < this.students.length; i++) {
      this.assignGrade(this.students[i], i);
    }
  }

}
