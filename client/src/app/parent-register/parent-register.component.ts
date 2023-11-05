import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-parent-register',
  templateUrl: './parent-register.component.html',
  styleUrls: ['./parent-register.component.css']
})
export class ParentRegisterComponent implements OnInit{
    @Output() cancelRegister = new EventEmitter();
    registerForm: FormGroup = new FormGroup({});
    validationErrors: string[] | undefined;
    // member: Member | undefined;
    user: User | null = null;

  
    constructor(private accountService: AccountService, private toastr: ToastrService, 
      private fb: FormBuilder, private router: Router) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
          next: user => this.user = user
        })
      }
    
    ngOnInit(): void {
      this.initializeForm();
    }

    initializeForm() {
      this.registerForm = this.fb.group({
        gender: ['male'],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmPassword: ['', [Validators.required, this.matchValues('password')]]
      });
      //without that changes in password after matchValues('password') returns true makes wrong equality check with confirmPassword 
      this.registerForm.controls['password'].valueChanges.subscribe({
        next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
      });
    }
   
    matchValues(matchTo: string) : ValidatorFn { //confirm password equals to password
      return (control: AbstractControl) => {
        return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
      }
    }
  
    register() {
      const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
      const values = {...this.registerForm.value, dateOfBirth: dob, studentChildrenUsername: this.user?.username}
      this.accountService.parentRegister(values).subscribe({
        next: () => {
          this.router.navigateByUrl('/#')
          this.toastr.success("Pomyślnie zarejestrowano użytkownika!")
      },
        error: error => {
          this.validationErrors = error
        }
      })
    }
  
    cancel() {
      this.cancelRegister.emit(false);
      this.router.navigateByUrl("/")
    }
  
    private getDateOnly(dob: string | undefined) { //returns date without timezone and hours
      if(!dob) return;
      let theDob = new Date(dob);
      return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset()))
      .toISOString().slice(0,10);
    }
  }
