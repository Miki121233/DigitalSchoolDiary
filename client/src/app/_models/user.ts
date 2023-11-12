export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    accountType: string;
    token: string;
    classId?: number; //if student
}