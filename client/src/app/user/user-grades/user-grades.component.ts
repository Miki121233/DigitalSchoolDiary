import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { Grade } from 'src/app/_models/grade';
import { StudentChildren } from 'src/app/_models/studentChildren';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { GradesService } from 'src/app/_services/grades.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-grades',
  templateUrl: './user-grades.component.html',
  styleUrls: ['./user-grades.component.css']
})
export class UserGradesComponent {
  user: User | undefined
  grades: Grade[] = []
  child: StudentChildren | null = null;

  constructor(private accountService: AccountService, private gradesService: GradesService, private route: ActivatedRoute,
    private userService: UserService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user
        }
      }
    });
    this.userService.currentChild$.pipe(take(1)).subscribe({
      next: child => {
        if (child) {
          this.child = child;
        }
      }
    });
    this.getGradesForStudentFromIdAndSubjectId();
  }

  getGradesForStudentFromIdAndSubjectId() {
    if(this.user?.accountType === 'Student') {
        this.route.paramMap.subscribe(params => {
          if(this.user) {
            this.gradesService.getGradesForStudentFromIdAndSubjectId(this.user?.id, params.get('subjectId')!).subscribe({
              next: response => {
                this.grades = response 
              }
            });
          }
        });
    }
    else if(this.user?.accountType === 'Parent') {
      this.route.paramMap.subscribe(params => {
        if(this.child) {
          this.gradesService.getGradesForStudentFromIdAndSubjectId(this.child?.id, params.get('subjectId')!).subscribe({
            next: response => {
              this.grades = response 
            }
          });
        }
      });
    }
  }

}
