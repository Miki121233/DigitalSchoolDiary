export interface Grade {
    id?: number;
    description: string;
    value: number;
    subject: string;
    teacherId: number;
    date?: Date;
}