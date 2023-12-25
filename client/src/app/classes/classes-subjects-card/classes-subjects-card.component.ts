import { Component, Input } from '@angular/core';
import { take } from 'rxjs';
import { StudentChildren } from 'src/app/_models/studentChildren';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-classes-subjects-card',
  templateUrl: './classes-subjects-card.component.html',
  styleUrls: ['./classes-subjects-card.component.css']
})
export class ClassesSubjectsCardComponent{
  @Input() subject: any;
  @Input() classId: any;
  user: User | null = null;
  child: StudentChildren | null = null;

  constructor(private accountService: AccountService, private userService: UserService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user
      }
    });
    this.userService.currentChild$.pipe(take(1)).subscribe({
      next: child => {
        this.child = child
      }
    });
  }

  getRouterLink(): string {
    const currentPath = window.location.pathname;
    if (this.user) {
      if (this.user.accountType === 'Teacher' || this.user.accountType === 'Director') {
        if (currentPath.includes('/oceny')) {
          return `/oceny/${this.classId}/${this.subject.id}`;
        } 
        else if (currentPath.includes('/zadania')) {
          return `/zadania/${this.classId}/${this.subject.id}`;
        } 
        else if (currentPath.includes('/obecnosc')) {
          return `/obecnosc/${this.classId}/${this.subject.id}`;
        } 
      }
      else if (this.user.accountType === 'Student') {
        if (currentPath.includes('/oceny')) {
          return `/oceny/${this.classId}/${this.subject.id}/${this.user.id}`;
        } 
        else if (currentPath.includes('/zadania')) {
          return `/zadania/${this.classId}/${this.subject.id}`;
        } 
        else if (currentPath.includes('/obecnosc')) {
          return `/obecnosc/${this.classId}/${this.subject.id}/${this.user.id}`;
        } 
      }
      else if (this.user.accountType === 'Parent' && this.child) {
        if (currentPath.includes('/oceny')) {
          return `/oceny/${this.classId}/${this.subject.id}/${this.child.id}`;
        } 
        else if (currentPath.includes('/zadania')) {
          return `/zadania/${this.classId}/${this.subject.id}`;
        } 
        else if (currentPath.includes('/obecnosc')) {
          return `/obecnosc/${this.classId}/${this.subject.id}/${this.child.id}`;
        } 
      }
    }

    return `error`;
  }

}
