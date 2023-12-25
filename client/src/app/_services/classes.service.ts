import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Class } from '../_models/class';
import { User } from '../_models/user';
import { Grade } from '../_models/grade';
import { PostClass } from '../_models/postClass';
import { SchoolSubject } from '../_models/schoolSubject';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getClass(id: number | string) {
    return this.http.get<Class>(this.baseUrl + 'classes/' + id);
  }

  getClasses() {
    return this.http.get<Class[]>(this.baseUrl + 'classes');
  }

  getStudentsFromClass(id: number | string) {
    return this.http.get<User[]>(this.baseUrl + 'classes/' + id + '/students');
  }

  getGradesFromClassId(id: number | string) {
    return this.http.get<Grade[]>(this.baseUrl + 'classes/' + id + '/grades');
  }

  getSchoolIdFromClassId(classId: number | string) {
    return this.http.get<string>(this.baseUrl + 'classes/get-school-id/' + classId, { responseType: 'text' as 'json' });
  }

  addStudentToClass(classId: number, studentId: number) {
    return this.http.post<User>(this.baseUrl + 'classes/' + classId + '/students/' + studentId, {});
  }

  addSubjectToClass(classId: number, subjectId: number) {
    return this.http.post<SchoolSubject>(this.baseUrl + 'classes/' + classId + '/subjects/' + subjectId, {});
  }

  removeStudentFromClass(classId: number, studentId: number) {
    return this.http.delete(this.baseUrl + 'classes/' + classId + '/students/' + studentId);
  }

  removeSubjectFromClass(classId: number, subjectId: number) {
    return this.http.delete(this.baseUrl + 'classes/' + classId + '/subjects/' + subjectId);
  }

  postClass(classDto: PostClass) {
    return this.http.post<Class>(this.baseUrl + 'classes', classDto);
  }

  deleteClass(id: number) {
    return this.http.delete(this.baseUrl + 'classes/' + id);
  }

}
