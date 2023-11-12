import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  baseUrl = environment.apiUrl;
  class: Class | any;
  description: string = ''; // Dodajemy pole description
  studentDescriptions: string[] = []; // Dodajemy tablicę do przechowywania opisów za co
  user: User | null = null;
  students: User[] = [];
  grades: Grade[] = []

  constructor(private route: ActivatedRoute, private accountService: AccountService, private http: HttpClient, 
    private classesService: ClassesService, private gradesService: GradesService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
   }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.class = data['class'];
        this.getStudentsFromClass(this.class.id);
        //this.getGradesForStudentFromId();
        //this.initializeStudentData(); // Wywołujemy funkcję do inicjalizacji danych studentów
      }
    });
  }

  getStudentsFromClass(id: number) {
    this.classesService.getStudentsFromClass(id).subscribe({
      next: response => this.students = response
    });
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

  // initializeStudentData() {
  //   if (this.class.students) {
  //     for (const student of this.class.students) {
  //       this.studentDescriptions.push(''); // Dodajemy pustą wartość do tablicy opisów za co
  //     }
  //   }
  // }

  updateDescriptions() {
    // Ta funkcja jest wywoływana przy zmianach w polu "Opis"
    for (let i = 0; i < this.studentDescriptions.length; i++) {
      this.studentDescriptions[i] = this.description;
    }
  }
}
