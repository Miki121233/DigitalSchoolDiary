import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './_guards/auth.guard';
import { GradesComponent } from './grades/grades.component';
import { HomeworkComponent } from './homework/homework.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MessagesComponent } from './messages/messages.component';
import { ParentRegisterComponent } from './parent-register/parent-register.component';
import { ClassesListComponent } from './classes/classes-list/classes-list.component';
import { UserGradesComponent } from './user/user-grades/user-grades.component';
import { ClassesSubjectsListComponent } from './classes/classes-subjects-list/classes-subjects-list.component';
import { SelectChildListComponent } from './parents/select-child-list/select-child-list.component';
import { TeacherScheduleComponent } from './teacher-schedule/teacher-schedule.component';
import { MessageThreadsComponent } from './message-threads/message-threads.component';
import { NotesComponent } from './notes/notes.component';
import { UserNotesComponent } from './user/user-notes/user-notes.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { UserAttendanceComponent } from './user/user-attendance/user-attendance.component';
import { ManagementClassesComponent } from './management/management-classes/management-classes.component';
import { ManagementClassesListComponent } from './management/management-classes-list/management-classes-list.component';
import { ManagementSubjectsComponent } from './management/management-subjects/management-subjects.component';
import { ManagementUsersComponent } from './management/management-users/management-users.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rejestracja', component: RegisterComponent},
  {path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {path: 'oceny', component: ClassesListComponent},
      {path: 'oceny/:classId', component: ClassesSubjectsListComponent},
      {path: 'oceny/:classId/:subjectId', component: GradesComponent},
      {path: 'oceny/:classId/:subjectId/:userId', component: UserGradesComponent},
      {path: 'wybor-dziecka', component: SelectChildListComponent},
      {path: 'zadania', component: ClassesListComponent},
      {path: 'zadania/:classId', component: ClassesSubjectsListComponent},
      {path: 'zadania/:classId/:subjectId', component: HomeworkComponent},
      {path: 'obecnosc', component: ClassesListComponent},
      {path: 'obecnosc/:classId', component: ClassesSubjectsListComponent},
      {path: 'obecnosc/:classId/:subjectId', component: AttendanceComponent},
      {path: 'obecnosc/:classId/:subjectId/:userId', component: UserAttendanceComponent},
      {path: 'plany', component: TeacherScheduleComponent},
      {path: 'plan', component: ClassesListComponent},
      {path: 'plan/:classId', component: ScheduleComponent},
      {path: 'wiadomosci', component: MessagesComponent},
      {path: 'wiadomosci/:userId', component: MessageThreadsComponent},
      {path: 'kalendarz', component: ScheduleComponent},
      {path: 'uwagi', component: ClassesListComponent},
      {path: 'uwagi/:classId', component: NotesComponent},
      {path: 'uwagi/:classId/:userId', component: UserNotesComponent},
      {path: 'rejestracja-rodzica', component: ParentRegisterComponent},
      {path: 'zarzadzanie-klasami', component: ManagementClassesListComponent},
      {path: 'zarzadzanie-klasami/:classId', component: ManagementClassesComponent},
      {path: 'zarzadzanie-przedmiotami', component: ManagementSubjectsComponent},
      {path: 'zarzadzanie-uzytkownikami', component: ManagementUsersComponent}
    ]
  },
  {path: '**', component: HomeComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
