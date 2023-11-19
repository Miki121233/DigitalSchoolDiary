import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Class } from '../_models/class';
import { User } from '../_models/user';
import { Grade } from '../_models/grade';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  //id jako number | string bo problem z paramMap.get('id') - chce miec stringa
  
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

}
