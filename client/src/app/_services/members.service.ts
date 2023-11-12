import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { take } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Member } from "../_models/member";
import { User } from "../_models/user";
import { UserParams } from "../_models/userParams";
import { AccountService } from "./account.service";
import { Grade } from "../_models/grade";

@Injectable({
    providedIn: 'root'
})
export class MembersService {
    baseUrl = environment.apiUrl;
    //members: Member[] = [];
    user: User | undefined;
    
    constructor(private http: HttpClient, private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => {
          if (user) {
            this.user = user; 
          }
        }
      });
    }

}