import { SchoolSubject } from "./schoolSubject"

export interface Homework {
    id: number
    description: string
    comment: string
    teacherId: number
    classId: number
    publishDate: Date 
    deadline: Date
    isActive: boolean
    subject: SchoolSubject
}