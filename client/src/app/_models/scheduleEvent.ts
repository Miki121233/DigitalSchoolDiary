export interface ScheduleEvent {
    title: string
    start: string
    end: string
    startTime: string 
    endTime: string 
    startRecur: string 
    endRecur?: string 
    repeatWeekly: boolean 
    editable: boolean
    allDay?: boolean
    daysOfWeek?: any
    assignedPersonId?: number
    creatorId: number | string
}