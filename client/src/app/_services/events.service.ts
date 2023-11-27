import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { ScheduleEvent } from "../_models/scheduleEvent";

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEventsFromClassId(classId: number | string) {
    return this.http.get<ScheduleEvent[]>(this.baseUrl + 'events/classes/' + classId);
  }

  postEventForClass(classId: number | string, event: ScheduleEvent) {
    return this.http.post(this.baseUrl + 'events/classes/' + classId, event);
  }
  
  loadTeacherEventsFromId(teacherId: number | string) {
    return this.http.get<ScheduleEvent[]>(this.baseUrl + 'events/teachers/' + teacherId);
  }

  editEvent(id: number, scheduleEvent: ScheduleEvent) {
    return this.http.put(this.baseUrl + 'events/' + id, scheduleEvent);
  }

  deleteEvent(id: number) {
    return this.http.delete(this.baseUrl + 'events/' + id);
  }
}
