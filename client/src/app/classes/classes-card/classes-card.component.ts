import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-classes-card',
  templateUrl: './classes-card.component.html',
  styleUrls: ['./classes-card.component.css']
})
export class ClassesCardComponent {
  @Input() class: any;

  constructor() { }

  getRouterLink(classId: number): string {
    const currentPath = window.location.pathname;

    if (currentPath.includes('/oceny')) {
      return `/oceny/${classId}`;
    } 
    else if (currentPath.includes('/zadania')) {
      return `/zadania/${classId}`;
    } 
    else if (currentPath.includes('/plan')) {
      return `/plan/${classId}`;
    } 
    else {
      // Domyślnie, jeśli nie pasuje do żadnej ścieżki
      return `/inne/${classId}`;
    }
    
  }

}
