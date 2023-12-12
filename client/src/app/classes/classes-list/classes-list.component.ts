import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Class } from 'src/app/_models/class';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { ClassesService } from 'src/app/_services/classes.service';

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.component.html',
  styleUrls: ['./classes-list.component.css']
})
export class ClassesListComponent implements OnInit {
  classes: Class[] = [];
  user: User | null = null;

  constructor(private classesService: ClassesService, private accountService: AccountService, private router: Router) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user
        console.log(user)
      }
    });
    this.checkIfTeacher();
  }

  ngOnInit(): void {
    if(this.user && this.user.accountType === 'Teacher')
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

  checkIfTeacher() {
    if(this.user) {
      if(this.user?.accountType === "Teacher") {
        return;
      }
      if(this.user?.accountType === "Student") {
        const currentPath = window.location.pathname;

        if (currentPath.includes('/oceny')) {
          this.router.navigate(['oceny', this.user.classId])
        } 
        else if (currentPath.includes('/zadania')) {
          this.router.navigate(['zadania', this.user.classId])
        } 
        else if (currentPath.includes('/plan')) {
          this.router.navigate(['plan', this.user.classId])
        } 
        else if (currentPath.includes('/uwagi')) {
          this.router.navigate(['uwagi', this.user.classId, this.user.id])
        } 
        else {
          console.log("Błąd ze ścieżkami");
        }
      }
      // przypadek routingu dla dziecka rodzica jest uwzględniony w select-child-list
    }
    return;
  }


}
