import { Component, OnInit } from '@angular/core';
import { ClassesService } from 'src/app/_services/classes.service';

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.component.html',
  styleUrls: ['./classes-list.component.css']
})
export class ClassesListComponent implements OnInit {
  classes: any;

  constructor(private classesService: ClassesService) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses() {
    this.classesService.getClasses().subscribe({
      next:response => { 
        console.log(response),
        this.classes = response
      }
    });
  }
}
