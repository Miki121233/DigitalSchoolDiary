import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, take } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Member } from "../_models/member";
import { User } from "../_models/user";
import { UserParams } from "../_models/userParams";
import { AccountService } from "./account.service";
import { Grade } from "../_models/grade";
import { StudentChildren } from "../_models/studentChildren";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl = environment.apiUrl;
    user: User | undefined;
    private currentChildSource = new BehaviorSubject<StudentChildren | null>(null);
    currentChild$ = this.currentChildSource.asObservable();

    constructor(private http: HttpClient, private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => {
          if (user) {
            this.user = user; 
          }
        }
      });
    }

    //id jako string bo problem z paramMap.get('id')
    getUser(id: string | number) {
      return this.http.get<User>(this.baseUrl + 'users/' + id);
    }

    getParentWithChildrenIds(id: number) {
      return this.http.get<User>(this.baseUrl + 'users/parent/' + id);
    }

    pickChild(child: StudentChildren)
    {
      localStorage.removeItem('child');
      
      localStorage.setItem('child', JSON.stringify(child));
      this.currentChildSource.next(child);
    }
  
}