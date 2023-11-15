import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { SchoolSubject } from "../_models/schoolSubject";

@Injectable({
    providedIn: 'root'
})
export class SubjectsService {
    baseUrl = environment.apiUrl;
    
    constructor(private http: HttpClient) { }

    // string bo wyciagam to z url
    getSubjectFromId(id: string) {
        return this.http.get<SchoolSubject>(this.baseUrl + 'subjects/' + id);
    }

    // string bo wyciagam to z url
    getSubjectsFromClassId(id: string) {
        return this.http.get<SchoolSubject[]>(this.baseUrl + 'classes/' + id + '/subjects');
    }
}