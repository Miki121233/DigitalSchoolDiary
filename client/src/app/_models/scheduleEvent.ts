export interface ScheduleEvent {
    id: any
    title: string
    start: any
    end: any
    startTime?: string 
    endTime?: string 
    startHours: string 
    endHours: string 
    startRecur: string 
    endRecur?: string 
    repeatWeekly: boolean 
    editable: boolean
    allDay?: boolean
    daysOfWeek?: any
    assignedTeacherId?: number
    assignedTeacherFirstName?: number
    assignedTeacherLastName?: number
    classSchoolId? : string
    creatorId: number | string
}