import { Component, ViewChild } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import plLocale from '@fullcalendar/core/locales/pl';
import { ScheduleEvent } from '../_models/scheduleEvent';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventsService } from '../_services/events.service';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-teacher-schedule',
  templateUrl: './teacher-schedule.component.html',
  styleUrls: ['./teacher-schedule.component.css']
})
export class TeacherScheduleComponent {
  classesListSwitch: boolean | undefined;
  teacherScheduleSwitch: boolean | undefined;
  user: User | null = null;
  events: ScheduleEvent[] | null = null;
  selectedSlotMin?: string;
  selectedSlotMax?: string;
  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;

  constructor(private accountService: AccountService, private eventsService: EventsService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user; 
        }
      }
    });
    this.loadTeacherEvents();
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
    locale: plLocale
    
  };

  handleEventContent(arg: any): string {
    const event = arg.event;
    
    if (event.extendedProps.classSchoolId != 0 && typeof(event.extendedProps.classSchoolId) !== typeof(undefined)) {
      const description = ' - ' + event.extendedProps.classSchoolId;
      return `${event.title} ${description}`;
    }

    return `${event.title}`;
  }

  loadTeacherEvents() {
    if (this.user)
      this.eventsService.loadTeacherEventsFromId(this.user.id).subscribe({
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
      console.log('eventy nauczyciela');
      console.log(response);
    }
  })
  }


  switchTeacherSchedule() {
    if (this.teacherScheduleSwitch === true)
      this.teacherScheduleSwitch = false;
    else if (!this.teacherScheduleSwitch || this.teacherScheduleSwitch === false)
      this.teacherScheduleSwitch = true;
  }

  switchClassesList() {
    if (this.classesListSwitch === true)
      this.classesListSwitch = false;
    else if (!this.classesListSwitch || this.classesListSwitch === false)
      this.classesListSwitch = true;
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

}
