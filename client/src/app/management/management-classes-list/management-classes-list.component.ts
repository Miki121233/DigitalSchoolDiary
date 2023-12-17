import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Class } from 'src/app/_models/class';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { ClassesService } from 'src/app/_services/classes.service';
import { ClassCreationDialogComponent } from '../class-creation-dialog/class-creation-dialog.component';
import { PostClass } from 'src/app/_models/postClass';

@Component({
  selector: 'app-management-classes-list',
  templateUrl: './management-classes-list.component.html',
  styleUrls: ['./management-classes-list.component.css']
})
export class ManagementClassesListComponent {
  classes: Class[] = [];
  user: User | null = null;
  postClass?: PostClass;

  constructor(private classesService: ClassesService, private accountService: AccountService,
    private toastr: ToastrService, private dialog: MatDialog) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user
      }
    });
    this.loadClasses();
  }

  loadClasses() {
    this.classesService.getClasses().subscribe({
      next:response => {
        this.classes = response
      }
    });
  }

  addClass() {
    const classCreationDialogRef = this.dialog.open(ClassCreationDialogComponent, {
      width: '250px',
      data: { message: 'Tworzenie klasy' },
    });
  
    classCreationDialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'save') {
          if (!result.data.year) {
            this.toastr.error('Proszę wprowadzić rok');
            return;
          }
          if (!result.data.classLetterId) {
            this.toastr.error('Proszę wprowadzić identyfikator klasy');
            return;
          }
          if (result.data.year < 1 || result.data.year > 9) {
            this.toastr.error('Rok musi być między 1 - 9');
            return;
          }
          this.postClass = {
            year: result.data.year,
            classLetterId: result.data.classLetterId
          };
          this.classesService.postClass(this.postClass).subscribe({
            next: response => {
              this.toastr.success('Dodano klasę ' + response.schoolId);
              this.classes.push(response)
            },
            error: error => {
              this.toastr.error(error.error);
            }
          });
        }
        else { };
      }
    });

  }
}
