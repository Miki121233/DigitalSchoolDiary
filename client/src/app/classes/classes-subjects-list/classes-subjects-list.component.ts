import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Class } from 'src/app/_models/class';
import { SchoolSubject } from 'src/app/_models/schoolSubject';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { SubjectsService } from 'src/app/_services/subjects.service';

@Component({
  selector: 'app-classes-subjects-list',
  templateUrl: './classes-subjects-list.component.html',
  styleUrls: ['./classes-subjects-list.component.css']
})
export class ClassesSubjectsListComponent implements OnInit{
  classId: string | null = null;
  user: User | null = null;
  subjects: SchoolSubject[] = []

  constructor(private subjectsService: SubjectsService, private accountService: AccountService, private route: ActivatedRoute) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user
        console.log(user)
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.classId = params.get('classId');
      console.log('Class ID:', this.classId);
    });
    this.loadSubjects();
  }

  loadSubjects() {
    if (this.classId)
    this.subjectsService.getSubjectsFromClassId(this.classId).subscribe({
      next: response => { 
        this.subjects = response
      }
    });
  }

}
