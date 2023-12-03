import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  percentage: number = 0;
  daysRemaining?: number | string;

  constructor(public accountService: AccountService) {}

  ngOnInit(): void {
    this.howManyDaysRemainingForHolidays();
  }

  howManyDaysRemainingForHolidays() {
    const today = new Date();
    if (today > new Date(today.getFullYear(), 5, 22) && today < new Date(today.getFullYear(), 8, 1)){
      this.percentage = 100;
      this.daysRemaining = '0 - teraz są wakacje!'
    }
    else {
      // 21 czerwca - 5, bo zaczynaja sie od zera
      const nextSummerVacation = new Date(today.getFullYear(), 5, 21);
      
      if (today >= nextSummerVacation) {
        nextSummerVacation.setFullYear(today.getFullYear() + 1);
      }

      this.daysRemaining = Math.floor((nextSummerVacation.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
      this.percentage = Math.min((1 - this.daysRemaining / (365-72)) * 100, 100);
      console.log('this.percentage');
      console.log(this.percentage);
      console.log('this.daysRemaining');
      console.log(this.daysRemaining);
    }
    
  }
}