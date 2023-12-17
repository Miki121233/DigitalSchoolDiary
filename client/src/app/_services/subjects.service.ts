import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { SchoolSubject } from "../_models/schoolSubject";
import { PostSubject } from "../_models/postSubject";

@Injectable({
    providedIn: 'root'
})
export class SubjectsService {
    baseUrl = environment.apiUrl;
    
    constructor(private http: HttpClient) { }

    getAllSubjects() {
        return this.http.get<SchoolSubject[]>(this.baseUrl + 'subjects/');
    }

    // string bo wyciagam to z url
    getSubjectFromId(id: string) {
        return this.http.get<SchoolSubject>(this.baseUrl + 'subjects/' + id);
    }

    // string bo wyciagam to z url
    getSubjectsFromClassId(id: string | number) {
        return this.http.get<SchoolSubject[]>(this.baseUrl + 'classes/' + id + '/subjects');
    }

    getSubjectsContainingString(contains: string) {
        let params = new HttpParams();
        params = params.append('contains', contains);

        return this.http.get<SchoolSubject[]>(this.baseUrl + 'subjects/search', { params });
    }

    postSubject(postSubject: PostSubject) {
        return this.http.post<SchoolSubject>(this.baseUrl + 'subjects', postSubject);
    }

    deleteSubject(id: number) {
        return this.http.delete(this.baseUrl + 'subjects/' + id);
    }
}