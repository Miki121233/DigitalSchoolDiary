import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-classes-card',
  templateUrl: './classes-card.component.html',
  styleUrls: ['./classes-card.component.css']
})
export class ClassesCardComponent {
  @Input() class: any;
  //navigateToGrades = false; 

  constructor() { }

}
