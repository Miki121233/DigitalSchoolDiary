import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Homework } from "../_models/homework";

@Injectable({
  providedIn: 'root'
})
export class HomeworksService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getHomeworksFromClassIdAndSubjectId(classId: string, subjectId: string) {
    return this.http.get<Homework[]>(this.baseUrl+ 'homeworks/' + classId + '/' + subjectId);
  }

}
