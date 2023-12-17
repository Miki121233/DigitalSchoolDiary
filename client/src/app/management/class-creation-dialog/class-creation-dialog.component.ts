import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-class-creation-dialog',
  templateUrl: './class-creation-dialog.component.html',
  styleUrls: ['./class-creation-dialog.component.css']
})
export class ClassCreationDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ClassCreationDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
