import { Component, Input } from "@angular/core";


@Component({
  selector: 'app-management-classes-card',
  templateUrl: './management-classes-card.component.html',
  styleUrls: ['./management-classes-card.component.css']
})
export class ManagementClassesCardComponent {
  @Input() class: any;

  constructor() { }
}
