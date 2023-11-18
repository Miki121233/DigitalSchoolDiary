import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { SchoolSubject } from 'src/app/_models/schoolSubject';
import { StudentChildren } from 'src/app/_models/studentChildren';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { SubjectsService } from 'src/app/_services/subjects.service';
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

  constructor(private subjectsService: SubjectsService, private accountService: AccountService, private route: ActivatedRoute,
    private userService: UserService) { 
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

  getRouterLinkForTeacher(): string {
    const currentPath = window.location.pathname;

    if (currentPath.includes('/oceny')) {
      return `/oceny/${this.classId}/${this.subject.id}`;
    } 
    else if (currentPath.includes('/zadania')) {
      return `/zadania/${this.classId}/${this.subject.id}`;
    } 
    else {
      // Domyślnie, jeśli nie pasuje do żadnej ścieżki
      return `error`;
    }
  }

  getRouterLinkForStudent(): string {
    const currentPath = window.location.pathname;

    if (this.user) {
      if (currentPath.includes('/oceny')) {
        return `/oceny/${this.classId}/${this.subject.id}/${this.user.id}`;
      } 
      else if (currentPath.includes('/zadania')) {
        return `/zadania/${this.classId}/${this.subject.id}`;
      } 
      else {
        // Domyślnie, jeśli nie pasuje do żadnej ścieżki
        return `error`;
      }
    }
    else return "**";
  }

  getRouterLinkForParent(): string {
    const currentPath = window.location.pathname;

    if (this.child) {
      if (currentPath.includes('/oceny')) {
        return `/oceny/${this.classId}/${this.subject.id}/${this.child.id}`;
      } 
      else if (currentPath.includes('/zadania')) {
        return `/zadania/${this.classId}/${this.subject.id}`;
      } 
      else {
        // Domyślnie, jeśli nie pasuje do żadnej ścieżki
        return `error`;
      }
    }
    else return "**";
  }

  log() {
    if (this.subject)
    console.log(this.subject)
    else console.log('ni ma')
    console.log(this.classId)
  }

  
}
