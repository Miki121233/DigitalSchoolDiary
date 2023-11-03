import { Member } from "./member";

export interface Class {
    id: number;
    schoolId: string;
    teachers: Member[];
    students: Member[];
}