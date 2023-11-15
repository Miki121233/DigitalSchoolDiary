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

  // checkIfTeacher() : boolean {
  //   if(this.user) {
  //     if(this.user?.accountType === "Teacher") {
  //       return true;
  //     }
  //     if(this.user?.accountType === "Student" || this.user?.accountType === "Parent") {
  //       console.log('AAAA '+this.user.classId)
  //       this.router.navigate(['uzytkownik', this.user.id, 'oceny'])
  //       return false;
  //     }
  //   }
  //   return true;
  // }

}
