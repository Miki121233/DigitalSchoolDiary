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
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";

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
    eventContent: this.handleEventContent.bind(this),
    locale: plLocale,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
    
  };

  handleEventContent(arg: any): string {
    const event = arg.event;
    
    if (event.extendedProps.assignedTeacherId != 0 && typeof(event.extendedProps.assignedTeacherId) !== typeof(undefined) &&
    event.extendedProps.assignedTeacherLastName && event.extendedProps.assignedTeacherFirstName) {
      const description = ' - ' + event.extendedProps.assignedTeacherLastName + ' ' + event.extendedProps.assignedTeacherFirstName;
      return `${event.title} ${description}`;
    }

    return `${event.title}`;
  }

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
          event.start = arg.event._instance.range.start;
          event.startHours = eventFromClick.extendedProps.startHours;
          event.endHours = eventFromClick.extendedProps.endHours;
          event.assignedTeacherId = eventFromClick.extendedProps.assignedTeacherId;
          console.log('event');
          console.log(event);
          console.log('eventFromClick');
          console.log(eventFromClick);
          
          const dialogRef = this.dialog.open(ScheduleEventDialogComponent, {
            width: '300px',
            data: { title: event.title, event: event, showDeleteButton: true },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              const eventFromResult = result.data.event;
              const calendarApi = this.fullCalendar.getApi();
              const eventStart = new Date(eventFromResult.start);
              eventStart.setHours(parseInt(eventFromResult.startHours.split(':')[0], 10), parseInt(eventFromResult.startHours.split(':')[1], 10));
              const eventEnd= new Date(eventFromResult.end);
              eventEnd.setHours(parseInt(eventFromResult.endHours.split(':')[0], 10), parseInt(eventFromResult.endHours.split(':')[1], 10));
              event.start = eventStart;
              event.end = eventEnd;

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
      //const endDate = new Date(arg.date);
      //endDate.setDate(startDate.getDate() + 1);
      var startHour;
      var endHour;

      if(startDate.getHours() < 9) {
        if(startDate.getMinutes() == '0') {
          startHour = '0' + startDate.getHours() + ':' + '00';
          endHour = '0' + (startDate.getHours() + 1) + ':' + '00';
        }
        else if (startDate.getMinutes() != '0')  {
          startHour = '0' + startDate.getHours() + ':' + startDate.getMinutes();
          endHour = '0' + (startDate.getHours() + 1) + ':' + startDate.getMinutes();
        }  
      }
      else if (startDate.getHours() == 9) {
        if(startDate.getMinutes() == '0') {
          startHour = '0' + startDate.getHours() + ':' + '00';
          endHour = (startDate.getHours() + 1) + ':' + '00';
        }
        else if (startDate.getMinutes() != '0')  {
          startHour = '0' + startDate.getHours() + ':' + startDate.getMinutes();
          endHour = (startDate.getHours() + 1) + ':' + startDate.getMinutes();
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

      if(startHour && endHour) {
        const startWithStartTime = new Date(startDate);
        startWithStartTime.setHours(parseInt(startHour.split(':')[0], 10), parseInt(startHour.split(':')[1], 10));

        const endWithEndTime = new Date(startDate);
        endWithEndTime.setHours(parseInt(endHour.split(':')[0], 10), parseInt(endHour.split(':')[1], 10));

        this.openEventDialog({ 
          title: 'Nowe wydarzenie', 
          start: startWithStartTime, 
          end: endWithEndTime,
          startHours: startHour, 
          endHours: endHour,
          editable: true
          //startRecur: startDate
        });

      }
      else console.error('Problem z inicjalizacja startHour i endHour');
    }
  }

  addEvent() 
  {
    this.openEventDialog({ 
      title: 'Nowe wydarzenie',
      start: new Date(),
      startHours: '13:00',
      endHours: '14:00',
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
        console.log('event 11111')
        console.log(event)
        const calendarApi = this.fullCalendar.getApi();

        if(event.repeatWeekly && event.repeatWeekly == true) {
          const dayOfWeek = event.start.getDay();
          event.startTime = event.startHours;
          event.endTime = event.endHours;
          event.daysOfWeek = [dayOfWeek];
          calendarApi.addEvent(event);

        }
        else if(!event.repeatWeekly || event.repeatWeekly == false ) {
          event.startTime = undefined;
          event.endTime = undefined;
          event.daysOfWeek = undefined;
          calendarApi.addEvent(event);
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

  deleteEvent(id: number) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Czy na pewno chcesz usunąć to wydarzenie?' },
    });
  
    confirmationDialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        const calendarApi = this.fullCalendar.getApi();
        this.eventsService.deleteEvent(id).subscribe({
        next: () => {
          this.toastr.success("Pomyślnie usunięto wydarzenie");
          this.loadEventsFromClass();
          calendarApi.refetchEvents();
        },
        error: error => {
          console.error(error);
          this.toastr.error("Błąd podczas usuwania wydarzenia");
        }
        });
      }
    });

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
            event.startTime = event.startHours;
            event.endTime = event.endHours;
  
          }
          else if(!event.repeatWeekly || event.repeatWeekly == false ) {
            event.startTime = undefined;
            event.endTime = undefined;
            event.daysOfWeek = undefined;
          }
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
