import { Component, OnInit } from '@angular/core';
import { Homework } from '../_models/homework';
import { ActivatedRoute } from '@angular/router';
import { HomeworksService } from '../_services/homeworks.service';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent implements OnInit{
  homeworks: Homework[] = [];
  dateForComparison: Date = new Date;
  user: User | null = null;

  constructor(private route: ActivatedRoute, private homeworksService: HomeworksService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.getHomeworksFromClassId();
  }

  getHomeworksFromClassId() {
    this.route.paramMap.subscribe(params => {
      const classId = params.get('classId')!
      const subjectId = params.get('subjectId')!
      this.homeworksService.getHomeworksFromClassIdAndSubjectId(classId, subjectId).subscribe({
        next: response => {
          this.homeworks = response
        }
      });
    });
  }

}
