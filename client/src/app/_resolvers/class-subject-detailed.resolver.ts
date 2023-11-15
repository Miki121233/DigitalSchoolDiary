import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { Class } from '../_models/class';
import { ClassesService } from '../_services/classes.service';
import { SubjectsService } from '../_services/subjects.service';
import { SchoolSubject } from '../_models/schoolSubject';

// export const classDetailedResolver: ResolveFn<Class, Subject> = (route, state) => {
//   const classesService = inject(ClassesService)

//   return classesService.getClass(route.paramMap.get('id')!)
// };

export const classSubjectDetailedResolver: ResolveFn<{ class: Class, subject: SchoolSubject }> = (route, state) => {
  const classesService = inject(ClassesService);
  const subjectsService = inject(SubjectsService);

  const classData = classesService.getClass(route.paramMap.get('id')!);
  const subjectData = subjectsService.getSubjectFromId('1');

  return forkJoin({ class: classData, subject: subjectData });
  
};