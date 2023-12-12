import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Note } from '../_models/note';
import { PostNote } from '../_models/postNote';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNotesForStudent(studentId: number) {
    return this.http.get<Note[]>(this.baseUrl + 'notes/students/' + studentId);
  }

  getStudentsWithNotesFromClass(classId: number) {
    return this.http.get<User[]>(this.baseUrl + 'notes/classes/' + classId);
  }

  postNote(studentId: number, postNote: PostNote) {
    return this.http.post<Note>(this.baseUrl + 'notes/students/' + studentId, postNote);
  }

  deleteNote(noteId: number) {
    return this.http.delete(this.baseUrl + 'notes/' + noteId);
  }
}
