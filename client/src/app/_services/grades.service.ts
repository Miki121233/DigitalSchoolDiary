import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Grade } from "../_models/grade";

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getGradesFromClassId(id: number) {
    return this.http.get<Grade[]>(this.baseUrl + 'grades/' + id);
  }

  getGradesForStudentFromId(id: number) {
    return this.http.get<Grade[]>(this.baseUrl + 'users/'+ id + '/grades');
  }
}
