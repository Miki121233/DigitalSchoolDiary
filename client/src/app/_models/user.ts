import { Grade } from "./grade";
import { Note } from "./note";
import { StudentChildren } from "./studentChildren";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    accountType: string;
    token: string;
    classId?: number; //if student
    // grades?: Grade[]; //if student
    // notes?: Note[];
    studentChildren?: StudentChildren[] //if parent 
}