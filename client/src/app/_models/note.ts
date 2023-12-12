export interface Note {
    id: number;
    description: string; 
    isPositive: boolean;
    teacherId: number;
    teacherFullName: string;
    created: Date;
}