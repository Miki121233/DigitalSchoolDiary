import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Attendance } from '../_models/attendance';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendancesService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAttendancesForStudentFromIdAndSubjectId(studentId: number, subjectId: number) {
    return this.http.get<Attendance[]>(this.baseUrl + 'attendances/students/'+ studentId + '/' + subjectId);
  }

  getAttendancesFromClassId(classId: number) {
    return this.http.get<Attendance[]>(this.baseUrl + 'attendances/classes/' + classId);
  }

  getStudentsAttendances(classId: number, subjectId: string) {
    return this.http.get(this.baseUrl + 'attendances/' + classId + '/' + subjectId);  
  }

  postAttendanceForUser(id: number, attendance: Attendance) {
    return this.http.post<Attendance>(this.baseUrl + 'attendances/' + id, attendance);
  }
  
  deleteAttendance(id: number) {
    return this.http.delete<Attendance>(this.baseUrl + 'attendances/' + id);
  }
}
