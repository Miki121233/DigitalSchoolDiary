import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Class } from '../_models/class';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  //id jako string bo problem z paramMap.get('id')
  getClass(id: string) {
    return this.http.get<Class>(this.baseUrl + 'classes/' + id);
  }

  getClasses() {
    return this.http.get(this.baseUrl + 'classes');
  }

  getStudentsFromClass(id: number) {
    return this.http.get(this.baseUrl + 'classes/' + id + '/students');
  }
}
