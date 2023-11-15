import { Component, Input } from '@angular/core';
import { SchoolSubject } from 'src/app/_models/schoolSubject';

@Component({
  selector: 'app-classes-subjects-card',
  templateUrl: './classes-subjects-card.component.html',
  styleUrls: ['./classes-subjects-card.component.css']
})
export class ClassesSubjectsCardComponent{
  @Input() subject: any;
  @Input() classId: any;

  log() {
    if (this.subject)
    console.log(this.subject)
    else console.log('ni ma')
    console.log(this.classId)
  }
}
