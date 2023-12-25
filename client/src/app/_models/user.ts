import { StudentChildren } from "./studentChildren";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    accountType: string;
    token: string;
    classId?: number;
    studentChildren?: StudentChildren[]
}