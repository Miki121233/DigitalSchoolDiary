import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-schedule-event-view-dialog',
  templateUrl: './schedule-event-view-dialog.component.html',
  styleUrls: ['./schedule-event-view-dialog.component.css']
})
export class ScheduleEventViewDialogComponent {
  assignedUser?: User;

  constructor(public dialogRef: MatDialogRef<ScheduleEventViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService) {
    this.getPersonFromId();    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getPersonFromId() {
    if (this.data.event.assignedTeacherId) {
      this.userService.getUser(this.data.event.assignedTeacherId).subscribe({
        next: response => {
          if (response)
            this.assignedUser = response
        }
      });
    }
  }
}
