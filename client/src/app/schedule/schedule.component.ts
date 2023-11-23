import { Component, ViewChild } from "@angular/core";
import { FullCalendarComponent } from '@fullcalendar/angular';  // Poprawiona importacja
import timeGridPlugin from '@fullcalendar/timegrid';
import plLocale from '@fullcalendar/core/locales/pl';
import { ScheduleEventDialogComponent } from "../schedule-event-dialog/schedule-event-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import interactionPlugin from '@fullcalendar/interaction';
import { EventsService } from "../_services/events.service";
import { ScheduleEvent } from "../_models/scheduleEvent";
import { ToastrService } from "ngx-toastr";
import { User } from "../_models/user";
import { take } from "rxjs";
import { AccountService } from "../_services/account.service";
import { UserService } from "../_services/user.service";
import { StudentChildren } from "../_models/studentChildren";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent {
  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent; // Dodana inicjalizacja
  classId: string | null = null;
  events: ScheduleEvent[] | null = null;
  user: User | null = null;
  child?: StudentChildren 

  constructor(private dialog: MatDialog, private eventsService: EventsService, private toastr: ToastrService,
    private accountService: AccountService, private userService: UserService, private route: ActivatedRoute) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user
        }
      }
    });
    this.userService.currentChild$.pipe(take(1)).subscribe({
      next: child => {
        if (child) {
          this.child = child; 
        }
      }});
    this.route.paramMap.subscribe(params => {
      this.classId = params.get('classId');
    });
    this.loadEventsFromClass();
  }

  calendarOptions = {
    plugins: [interactionPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    height: '600px',
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    weekends: false,
    events: this.events!,
    locale: plLocale,
    dateClick: this.handleDateClick.bind(this),
    //eventClick: this.handleEventClick.bind(this)
    
  };

  // handleEventClick(arg: any) { //edycja istniejacego klikajac na niego
  //   const dialogRef = this.dialog.open(ScheduleEventDialogComponent, {
  //     width: '250px',
  //     data: { title: 'Edytuj wydarzenie', event: arg.event },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       const calendarApi = this.fullCalendar.getApi();
  //       const endDate = new Date(result.event.date);

  //       calendarApi.getEventById(result.event.id)?.remove();
  //       //this.eventsService.postEventForClass(this.classId, )
  //       calendarApi.addEvent({
  //         ...result.event,
  //         id: result.event.id,
  //         startRecur: result.event.start,
  //         //endRecur: endDate,
  //       });

  //       calendarApi.refetchEvents();
          //this.loadEventsFromClass();
  //     }
  //   });
  // }

  // postEventForClass() {
  //   this.eventsService.postEventForClass();
  // }

  handleDateClick(arg: any) { //dodanie eventu przez klikniecie na kalendarz
    console.log('Clicked on date:', arg.date);
    const startDate = arg.date;
    const endDate = new Date(arg.date);
    endDate.setDate(startDate.getDate() + 1);
    var startHour;
    var endHour;
    if(startDate.getMinutes() == '0') {
      startHour = startDate.getHours() + ":" + '00';
      endHour = (startDate.getHours() + 1) + ":" + '00';
    }
    else  {
      startHour = startDate.getHours() + ":" + startDate.getMinutes();
      endHour = (startDate.getHours() + 1) + ":" + startDate.getMinutes();
    }
    this.openEventDialog({ 
      title: 'Nowe wydarzenie', 
      start: startDate, 
      startTime: startHour, 
      endTime: endHour,
      startRecur: startDate,
      end: endDate
    });
    console.log('endDate:', endDate.toString());
  }

  addEvent() 
  {
    this.openEventDialog({ 
      title: 'Nowe wydarzenie',
      start: new Date(),
      startTime: '13:00',
      endTime: '14:00',
      editable: true,
      allDay: false,
     });
  }

  openEventDialog(event: any): void {
    console.log('event')
    console.log(event)
    const dialogRef = this.dialog.open(ScheduleEventDialogComponent, {
      width: '300px',
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const calendarApi = this.fullCalendar.getApi();
        if(result.event.repeatWeekly && result.event.repeatWeekly == true) {
          const dayOfWeek = result.event.start.getDay();
          calendarApi.addEvent({
            ...result.event,
            daysOfWeek: [dayOfWeek],
            startRecur:  result.event.start,
          });
          console.log(result.event);
          console.log(result.event.start);
        }
        else if(!result.event.repeatWeekly || result.event.repeatWeekly == false ) {
          //jednorazowo
          const endDate = new Date(result.event.date);
          console.log('endDate 2')
          console.log(endDate)
          calendarApi.addEvent(result.event);
          console.log({
            ...result.event,
            startRecur:  result.event.start
            //endRecur:
          })
        }
        this.postEventForClass(result.event);
        calendarApi.refetchEvents();
      }
    });
  }

  postEventForClass(event: ScheduleEvent) {
    if(this.classId && this.user) {
      event.creatorId = this.user.id
      this.eventsService.postEventForClass(this.classId, event).subscribe({
        next: _ => {
          this.toastr.success("Pomyślnie utworzono wydarzenie")
          this.loadEventsFromClass();
      },
        error: error => console.log(error.error)
      });
    }
    else {
      this.toastr.error("Błąd z utworzeniem wydarzenia")
    }
  }

  loadEventsFromClass() {
    if(this.classId)
    this.eventsService.getEventsFromClassId(this.classId).subscribe({
      next: response => {
        this.events = response
        this.events.forEach(event => {
          if(event.repeatWeekly && event.repeatWeekly == true) {
            const dayOfWeek = new Date(event.start).getDay();
            event.daysOfWeek = [dayOfWeek]
          }
          //else - pojedyncze wydarzenie
        });

        console.log('loaded events')
        console.log(this.events)

        this.calendarOptions.events = this.events;
      }
    });
  }

}
