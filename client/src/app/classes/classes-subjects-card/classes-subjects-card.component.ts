import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { SchoolSubject } from 'src/app/_models/schoolSubject';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { SubjectsService } from 'src/app/_services/subjects.service';

@Component({
  selector: 'app-classes-subjects-card',
  templateUrl: './classes-subjects-card.component.html',
  styleUrls: ['./classes-subjects-card.component.css']
})
export class ClassesSubjectsCardComponent{
  @Input() subject: any;
  @Input() classId: any;
  user: User | null = null;

  constructor(private subjectsService: SubjectsService, private accountService: AccountService, private route: ActivatedRoute) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user
        console.log(user)
      }
    });
  }

  log() {
    if (this.subject)
    console.log(this.subject)
    else console.log('ni ma')
    console.log(this.classId)
  }

  
}
