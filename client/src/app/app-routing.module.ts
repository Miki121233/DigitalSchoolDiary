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
import { classDetailedResolver } from './_resolvers/class-detailed.resolver';
import { userDetailedResolver } from './_resolvers/user-detailed.resolver';
import { UserGradesComponent } from './user/user-grades/user-grades.component';
import { classSubjectDetailedResolver } from './_resolvers/class-subject-detailed.resolver';
import { ClassesSubjectsListComponent } from './classes/classes-subjects-list/classes-subjects-list.component';
import { SelectChildListComponent } from './parents/select-child-list/select-child-list.component';
import { TeacherScheduleComponent } from './teacher-schedule/teacher-schedule.component';
import { MessageThreadsComponent } from './message-threads/message-threads.component';
import { NotesComponent } from './notes/notes.component';
import { UserNotesComponent } from './user/user-notes/user-notes.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { UserAttendanceComponent } from './user/user-attendance/user-attendance.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rejestracja', component: RegisterComponent},
  {path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {path: 'oceny', component: ClassesListComponent},
      {path: 'oceny/:classId', component: ClassesSubjectsListComponent},//, resolve: {class: classDetailedResolver}},
      {path: 'oceny/:classId/:subjectId', component: GradesComponent},//, resolve: {class: classSubjectDetailedResolver}},
      //{path: 'uzytkownik/:id/oceny', component: UserGradesComponent}, //resolve: {class: userDetailedResolver}},
      {path: 'oceny/:classId/:subjectId/:userId', component: UserGradesComponent}, //resolve: {class: userDetailedResolver}},
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
      
    ]
  },
  {path: '**', component: HomeComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
