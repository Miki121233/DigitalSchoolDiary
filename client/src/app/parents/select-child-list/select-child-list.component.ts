import { Component } from '@angular/core';
import { take } from 'rxjs';
import { StudentChildren } from 'src/app/_models/studentChildren';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-select-child-list',
  templateUrl: './select-child-list.component.html',
  styleUrls: ['./select-child-list.component.css']
})
export class SelectChildListComponent {
  user: User | null = null;

  constructor(private accountService: AccountService, private userService: UserService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
    this.getParentWithChildrenIds();
  }

  getParentWithChildrenIds() {
    if(this.user)
    this.userService.getParentWithChildrenIds(this.user.id).subscribe({
      next: response => {
        if(this.user)
        this.user.studentChildren = response.studentChildren
      }
    });
  }

  getRouterLink(classId: number, childId: number): string {
    const currentPath = window.location.pathname;

    if (this.user) {
      if (currentPath.includes('/oceny')) {
        return `/oceny/${classId}`;
      } 
      else if (currentPath.includes('/zadania')) {
        return `/zadania/${classId}`;
      } 
      else if (currentPath.includes('/obecnosc')) {
        return `/obecnosc/${classId}`;
      } 
      else if (currentPath.includes('/plan')) {
        return `/plan/${classId}`;
      } 
      else if (currentPath.includes('/uwagi')) {
        return `/uwagi/${classId}/${childId}`;
      } 
      else {
        // Domyślnie, jeśli nie pasuje do żadnej ścieżki
        return `error`;
      }
    }
    else return "**";
  }

  pickChild(child: StudentChildren) {
    this.userService.pickChild(child);
  }
}
