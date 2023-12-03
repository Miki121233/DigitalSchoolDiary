import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { DatePickerComponent } from './_forms/date-picker/date-picker.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountTypePickerComponent } from './_forms/account-type-picker/account-type-picker.component';
import { GradesComponent } from './grades/grades.component';
import { HomeworkComponent } from './homework/homework.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MessagesComponent } from './messages/messages.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CommentsComponent } from './comments/comments.component';
import { ParentRegisterComponent } from './parent-register/parent-register.component';
import { ClassesListComponent } from './classes/classes-list/classes-list.component';
import { ClassesCardComponent } from './classes/classes-card/classes-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserGradesComponent } from './user/user-grades/user-grades.component';
import { ClassesSubjectsListComponent } from './classes/classes-subjects-list/classes-subjects-list.component';
import { ClassesSubjectsCardComponent } from './classes/classes-subjects-card/classes-subjects-card.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SelectChildListComponent } from './parents/select-child-list/select-child-list.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ScheduleEventDialogComponent } from './schedule-event-dialog/schedule-event-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TeacherScheduleComponent } from './teacher-schedule/teacher-schedule.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { MessageThreadsComponent } from './message-threads/message-threads.component';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from "ngx-timeago";
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    DatePickerComponent,
    TextInputComponent,
    AccountTypePickerComponent,
    GradesComponent,
    HomeworkComponent,
    ScheduleComponent,
    MessagesComponent,
    CalendarComponent,
    CommentsComponent,
    ParentRegisterComponent,
    ClassesListComponent,
    ClassesCardComponent,
    UserGradesComponent,
    ClassesSubjectsListComponent,
    ClassesSubjectsCardComponent,
    SelectChildListComponent,
    ScheduleEventDialogComponent,
    TeacherScheduleComponent,
    ConfirmationDialogComponent,
    MessageThreadsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    BsDatepickerModule.forRoot(),
    FontAwesomeModule,
    AccordionModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    //NgbModule,
    FullCalendarModule,
    MatDialogModule,
    TimepickerModule.forRoot(),
    TimeagoModule.forRoot({formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }})
  ],
  providers: [
    DatePipe,
    TimeagoIntl,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
