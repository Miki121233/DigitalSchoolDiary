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
  selectedSlotMin: string | null = null;
  selectedSlotMax: string | null = null;

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
    slotMinTime: '06:00',
    slotMaxTime: '22:00',
    events: this.events!,
    locale: plLocale,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
    
  };

  handleSlotMinChange() {
    if (this.selectedSlotMin) {
      const calendarApi = this.fullCalendar.getApi();
      calendarApi.setOption("slotMinTime", this.selectedSlotMin)
    }
  }

  handleSlotMaxChange() {
    if (this.selectedSlotMax) {
      const calendarApi = this.fullCalendar.getApi();
      calendarApi.setOption("slotMaxTime", this.selectedSlotMax)
    }
  }

  handleEventClick(arg: any) {
    if (arg.event && this.events) {
      var eventFromClick = arg.event.toPlainObject();
      this.events.forEach(event => {
        if (eventFromClick.id == event.id) { // == porównuje wartosci
          const dialogRef = this.dialog.open(ScheduleEventDialogComponent, {
            width: '250px',
            data: { title: 'Edytuj wydarzenie', event: event, showDeleteButton: true },
          });
          dialogRef.afterClosed().subscribe((result) => {
            const calendarApi = this.fullCalendar.getApi();
            if (result) {
              if (result.action === 'delete') {
                this.deleteEvent(event.id);
              } 
              else if (result.action === 'save') {
                this.editEvent(event.id, event);
              } 
              else { } //anulowanie
              calendarApi.refetchEvents();
            }
         });
        }
      });
    }
  }
  
  handleDateClick(arg: any) { //dodanie eventu przez klikniecie na kalendarz
    if (this.user && this.user.accountType==='Teacher') {
      const startDate = arg.date;
      const endDate = new Date(arg.date);
      endDate.setDate(startDate.getDate() + 1);
      var startHour;
      var endHour;

      if(startDate.getHours() < 10) {
        if(startDate.getMinutes() == '0') {
          startHour = '0' + startDate.getHours() + ':' + '00';
          endHour = '0' + (startDate.getHours() + 1) + ':' + '00';
        }
        else if (startDate.getMinutes() != '0')  {
          startHour = '0' + startDate.getHours() + ':' + startDate.getMinutes();
          endHour = '0' + (startDate.getHours() + 1) + ':' + startDate.getMinutes();
        }  
      }
      else if (startDate.getHours() >= 10) {
        if(startDate.getMinutes() == '0') {
          startHour = startDate.getHours() + ':' + '00';
          endHour = (startDate.getHours() + 1) + ':' + '00';
        }
        else if (startDate.getMinutes() != '0')  {
          startHour = startDate.getHours() + ':' + startDate.getMinutes();
          endHour = (startDate.getHours() + 1) + ':' + startDate.getMinutes();
        }
      }

      this.openEventDialog({ 
        title: 'Nowe wydarzenie', 
        start: startDate, 
        startTime: startHour, 
        endTime: endHour,
        startRecur: startDate,
        end: endDate
      });
    }
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
    const dialogRef = this.dialog.open(ScheduleEventDialogComponent, {
      width: '300px',
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const event = result.data.event;
        console.log('event')
        console.log(event)
        const calendarApi = this.fullCalendar.getApi();
        if(event.repeatWeekly && event.repeatWeekly == true) {
          const dayOfWeek = event.start.getDay();
          calendarApi.addEvent({
            ...event,
            daysOfWeek: [dayOfWeek],
            startRecur:  event.start,
          });
        }
        else if(!event.repeatWeekly || event.repeatWeekly == false ) {
          //jednorazowo
          const endDate = new Date(event.date);
          console.log('endDate 2')
          console.log(endDate)
          calendarApi.addEvent(event);
          console.log({
            ...event,
            startRecur:  event.start
            //endRecur:
          })
        }
        this.postEventForClass(event);
        calendarApi.refetchEvents();
      }
    });
  }

  editEvent(id: number, scheduleEvent: ScheduleEvent) {
    this.eventsService.editEvent(id, scheduleEvent).subscribe({
      next: _ => {
        this.toastr.success("Pomyślnie edytowano wydarzenie")
        this.loadEventsFromClass();
      },
      error: error => {
        console.log(error.error)
        this.toastr.error("Błąd z edycją wydarzenia")
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
        error: error => {
          console.log(error.error)
          this.toastr.error("Błąd z utworzeniem wydarzenia")
        }
      });
    }
    else {
      this.toastr.error("Błąd z utworzeniem wydarzenia")
    }
  }

  deleteEvent(id: any) {
    const calendarApi = this.fullCalendar.getApi();
    //calendarApi.getEventById(id)?.remove();
    // Dodaj tutaj również logikę usuwania z backendu, używając serwisu eventsService

    console.log('Usuwanie!!!' + ', id: '+id);

    // this.eventsService.deleteEvent(id).subscribe({
    //   next: _ => {
    //     this.toastr.success("Pomyślnie usunięto wydarzenie");
    //     this.loadEventsFromClass();
    //     calendarApi.refetchEvents();
    //   },
    //   error: error => {
    //     console.error(error);
    //     this.toastr.error("Błąd podczas usuwania wydarzenia");
    //   }
    // });
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
      },
      error: error => {
        this.toastr.error("Problem z załadowaniem wydarzeń")
      }
    });
  }

}
