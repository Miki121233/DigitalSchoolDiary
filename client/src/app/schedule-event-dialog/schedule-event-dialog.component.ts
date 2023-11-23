import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { plLocale } from 'ngx-bootstrap/locale';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';

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

  constructor(
    public dialogRef: MatDialogRef<ScheduleEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
