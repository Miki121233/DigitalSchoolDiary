export interface PostHomeworkDto {
    description: string;
    comment?: string;
    teacherId: number;
    deadline?: Date;
    subjectId: string;
}