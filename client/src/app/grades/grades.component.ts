import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  class: any;
  description: string = ''; // Dodajemy pole description
  studentDescriptions: string[] = []; // Dodajemy tablicę do przechowywania opisów za co
  user: User | null = null;

  constructor(private route: ActivatedRoute, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
   }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.class = data['class'];
        this.initializeStudentData(); // Wywołujemy funkcję do inicjalizacji danych studentów
      }
    });
  }

  initializeStudentData() {
    if (this.class.students) {
      for (const student of this.class.students) {
        this.studentDescriptions.push(''); // Dodajemy pustą wartość do tablicy opisów za co
      }
    }
  }

  updateDescriptions() {
    // Ta funkcja jest wywoływana przy zmianach w polu "Opis"
    for (let i = 0; i < this.studentDescriptions.length; i++) {
      this.studentDescriptions[i] = this.description;
    }
  }
}
