import { Component } from '@angular/core';
import { take } from 'rxjs';
import { Grade } from 'src/app/_models/grade';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { GradesService } from 'src/app/_services/grades.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-user-grades',
  templateUrl: './user-grades.component.html',
  styleUrls: ['./user-grades.component.css']
})
export class UserGradesComponent {
  user: User | undefined
  grades: Grade[] = []

  constructor(private accountService: AccountService, private gradesService: GradesService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user
          this.getGradesForStudentFromId()
        }
      }
    })
  }

  getGradesForStudentFromId() {
    if(this.user?.accountType === 'Student') {
      if(this.user?.classId)
        this.gradesService.getGradesForStudentFromId(this.user?.id).subscribe({
          next: response => {
            this.grades = response 
            console.log(response)
          }
      });
      else 
        console.log('Bląd podczas wyświetlania ocen studenta względem klasy')
    }
  }

}
