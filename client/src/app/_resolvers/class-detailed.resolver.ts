import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ClassesService } from '../_services/classes.service';
import { Class } from '../_models/class';

export const classDetailedResolver: ResolveFn<Class> = (route, state) => {
  const classesService = inject(ClassesService)

  return classesService.getClass(route.paramMap.get('id')!)
};
