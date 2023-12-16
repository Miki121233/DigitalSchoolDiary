export interface Attendance {
    id?: number;
    description: string;
    value: boolean;
    subject: string;
    teacherId: number;
    date?: Date;
}