import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { Attendance } from 'src/app/_models/attendance';
import { StudentChildren } from 'src/app/_models/studentChildren';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { AttendancesService } from 'src/app/_services/attendances.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-attendance',
  templateUrl: './user-attendance.component.html',
  styleUrls: ['./user-attendance.component.css']
})
export class UserAttendanceComponent {
  user: User | undefined
  attendances: Attendance[] = []
  child: StudentChildren | null = null;

  constructor(private accountService: AccountService, private attendancesService: AttendancesService, private route: ActivatedRoute,
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
    this.getAttendancesForStudentFromIdAndSubjectId();
  }

  getAttendancesForStudentFromIdAndSubjectId() {
    if(this.user?.accountType === 'Student') {
        this.route.paramMap.subscribe(params => {
          if(this.user) {
            const subjectId = parseInt(params.get('subjectId')!);
            this.attendancesService.getAttendancesForStudentFromIdAndSubjectId(this.user?.id, subjectId).subscribe({
              next: response => {
                this.attendances = response 
              }
            });
          }
        });
    }
    if(this.user?.accountType === 'Parent') {
      this.route.paramMap.subscribe(params => {
        if(this.child) {
          const subjectId = parseInt(params.get('subjectId')!);
          this.attendancesService.getAttendancesForStudentFromIdAndSubjectId(this.child?.id, subjectId).subscribe({
            next: response => {
              this.attendances = response 
            }
          });
        }
      });
    }
  }
}
