import { Component, Input } from '@angular/core';
import { ClassesService } from 'src/app/_services/classes.service';

@Component({
  selector: 'app-classes-card',
  templateUrl: './classes-card.component.html',
  styleUrls: ['./classes-card.component.css']
})
export class ClassesCardComponent {
  @Input() class: any;
  students: any;

  constructor(private classesService: ClassesService) { }

  getStudentsFromClass() {
    this.classesService.getStudentsFromClass(this.class.id).subscribe({
      next: response => this.students = response,
      error: error => console.log(error)
    });
  }
}
