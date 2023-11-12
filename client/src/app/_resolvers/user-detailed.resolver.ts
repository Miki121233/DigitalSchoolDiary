import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ClassesService } from '../_services/classes.service';
import { Class } from '../_models/class';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

export const userDetailedResolver: ResolveFn<User> = (route, state) => {
  const classesService = inject(UserService)

  return classesService.getUser(route.paramMap.get('id')!);
};
