import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Homework } from "../_models/homework";
import { PostHomeworkDto } from "../_models/postHomeworkDto";

@Injectable({
  providedIn: 'root'
})
export class HomeworksService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getHomeworksFromClassIdAndSubjectId(classId: number | string, subjectId: number | string) {
    return this.http.get<Homework[]>(this.baseUrl+ 'homeworks/' + classId + '/' + subjectId);
  }

  postHomeworkForClass(classId: number | string, homeworkDto: PostHomeworkDto) {
    return this.http.post<Homework>(this.baseUrl + 'homeworks/' + classId, homeworkDto);
  }

  deleteHomework(id: number) {
    return this.http.delete(this.baseUrl+ 'homeworks/' + id);
  }
}
