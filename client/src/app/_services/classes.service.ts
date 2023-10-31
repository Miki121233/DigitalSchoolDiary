import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getClasses() {
    return this.http.get(this.baseUrl + 'classes');
  }

  getStudentsFromClass(id: number) {
    return this.http.get(this.baseUrl + 'classes/' + id + '/students');
  }
}
