import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  class: any;
  description: string = ''; // Dodajemy pole description
  studentDescriptions: string[] = []; // Dodajemy tablicę do przechowywania opisów za co

  constructor(private route: ActivatedRoute) { }

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
