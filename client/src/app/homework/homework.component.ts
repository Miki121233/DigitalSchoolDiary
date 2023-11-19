import { Component, OnInit } from '@angular/core';
import { Homework } from '../_models/homework';
import { ActivatedRoute } from '@angular/router';
import { HomeworksService } from '../_services/homeworks.service';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { PostHomeworkDto } from '../_models/postHomeworkDto';
import { ClassesService } from '../_services/classes.service';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent implements OnInit{
  homeworks: Homework[] = [];
  dateForComparison: Date = new Date;
  user: User | null = null;
  classId: string | null = null;
  schoolId: string | null = null;
  subjectId: string | null = null;
  descriptionForm: string | null = null;
  commentForm: string | null = null;
  deadlineForm: Date | null = null;
  homeworkDto: PostHomeworkDto | null = null;

  constructor(private route: ActivatedRoute, private homeworksService: HomeworksService, private accountService: AccountService,
    private toastr: ToastrService, private datePipe: DatePipe, private classesService: ClassesService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.getHomeworksFromClassId();
    this.getSchoolIdFromClassId();
  }

  getHomeworksFromClassId() {
    this.route.paramMap.subscribe(params => {
      this.classId = params.get('classId')!
      this.subjectId = params.get('subjectId')!
      this.homeworksService.getHomeworksFromClassIdAndSubjectId(this.classId, this.subjectId).subscribe({
        next: response => {
          this.homeworks = response
        }
      });
    });
  }

  assignHomework() {
    console.log(this.descriptionForm + ', ' + this.commentForm +', '+this.deadlineForm);
    const formattedDeadline = this.datePipe.transform(this.deadlineForm, 'dd-MM-yyyy');

    if(this.descriptionForm && this.subjectId && this.user)
      this.homeworkDto = {
        description: this.descriptionForm,
        teacherId: this.user.id,
        subjectId: this.subjectId 
      }
    if(this.commentForm && this.homeworkDto) this.homeworkDto.comment = this.commentForm;
    if(this.deadlineForm && this.homeworkDto) this.homeworkDto.deadline = this.deadlineForm;
    console.log(this.homeworkDto)
    if(this.classId && this.homeworkDto) {
      console.log(this.homeworkDto)
      this.homeworksService.postHomeworkForClass(this.classId, this.homeworkDto).subscribe({
        next: response => {
          console.log(response)
        },
        error: err => console.log(err.error)
      });
      this.toastr.success(`Opublikowano zadanie ${this.descriptionForm} dla klasy ${this.schoolId} do dnia: ${formattedDeadline}`);

    }
  }

  getSchoolIdFromClassId() {
    this.classesService.getSchoolIdFromClassId(this.classId!).subscribe({
      next: schoolId => {
        this.schoolId = schoolId
      }
    });
  }

  timeToEvent(date: Date) : string {
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    console.log('data przed:')
    console.log(formattedDate)
    if (formattedDate) {
        const parsedDate = new Date(formattedDate);
        console.log('data:')
        console.log(parsedDate)
        return formatDistanceToNow(parsedDate, { addSuffix: true, locale: pl });
      } else {
        return 'Brak terminu';
      }
  }

}
