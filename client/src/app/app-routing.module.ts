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

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: '',
    canActivate: [authGuard],
    children: [
      {path: 'oceny', component: GradesComponent},
      {path: 'zadania', component: HomeworkComponent},
      {path: 'plan', component: ScheduleComponent},
      {path: 'wiadomosci', component: MessagesComponent},
      {path: 'kalendarz', component: CalendarComponent},
      {path: 'uwagi', component: CommentsComponent},
      
    ]
  },
  {path: '**', component: RegisterComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
