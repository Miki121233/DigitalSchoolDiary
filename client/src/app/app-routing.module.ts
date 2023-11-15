import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './_guards/auth.guard';
import { GradesComponent } from './grades/grades.component';
import { HomeworkComponent } from './homework/homework.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MessagesComponent } from './messages/messages.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CommentsComponent } from './comments/comments.component';
import { ParentRegisterComponent } from './parent-register/parent-register.component';
import { ClassesListComponent } from './classes/classes-list/classes-list.component';
import { classDetailedResolver } from './_resolvers/class-detailed.resolver';
import { userDetailedResolver } from './_resolvers/user-detailed.resolver';
import { UserGradesComponent } from './user/user-grades/user-grades.component';
import { classSubjectDetailedResolver } from './_resolvers/class-subject-detailed.resolver';
import { ClassesSubjectsListComponent } from './classes/classes-subjects-list/classes-subjects-list.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rejestracja', component: RegisterComponent},
  {path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {path: 'oceny', component: ClassesListComponent},
      {path: 'oceny/:id', component: ClassesSubjectsListComponent},//, resolve: {class: classDetailedResolver}},
      {path: 'oceny/:id/:idPrzedmiotu', component: GradesComponent},//, resolve: {class: classSubjectDetailedResolver}},
      //{path: 'uzytkownik/:id/oceny', component: UserGradesComponent, resolve: {class: userDetailedResolver}},
      {path: 'zadania', component: HomeworkComponent},
      {path: 'plan', component: ScheduleComponent},
      {path: 'wiadomosci', component: MessagesComponent},
      {path: 'kalendarz', component: CalendarComponent},
      {path: 'uwagi', component: CommentsComponent},
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
