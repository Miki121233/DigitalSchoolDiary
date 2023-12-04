import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { plLocale } from 'ngx-bootstrap/locale';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

defineLocale('pl', plLocale); // Ustawienie języka na polski

@Component({
  selector: 'app-schedule-event-dialog',
  templateUrl: './schedule-event-dialog.component.html',
  styleUrls: ['./schedule-event-dialog.component.css']
})
export class ScheduleEventDialogComponent {
  bsDatepickerConfig: Partial<BsDatepickerConfig>;
  bsTimepickerConfig: Partial<TimepickerConfig>;
  bsConfig: Partial<BsDatepickerConfig>;
  showDeleteButton: boolean;
  contains = '';
  filteredUsers: User[] = [];
  assignedUser?: User;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<ScheduleEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService) {
    this.bsConfig = {
      dateInputFormat: 'HH:mm DD-MM-YYYY', // Format wyświetlania daty i godziny
      containerClass: 'theme-default',
    };
    
    this.bsDatepickerConfig = {
      dateInputFormat: 'DD-MM-YYYY',
      containerClass: 'theme-default',
    };

    this.bsTimepickerConfig = {
      showMeridian: false
    };

    this.showDeleteButton = data.showDeleteButton || false;
    this.getPersonFromId();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  assignPerson(person: User) {
    this.data.event.assignedTeacherId = person.id;
    this.getPersonFromId();
  }

  deleteAssigned() {
    this.data.event.assignedTeacherId = 0;
    this.assignedUser = undefined;
  }

  search() {
    if (this.contains !== '') {
      this.userService.getTeachersContainingString(this.contains).subscribe({
        next: response => {
          this.filteredUsers = response
        }
      })
    }
  }

  getPersonFromId() {
    this.userService.getUser(this.data.event.assignedTeacherId).subscribe({
      next: response => {
        if (response)
          this.assignedUser = response
      }
    });
  }
}
