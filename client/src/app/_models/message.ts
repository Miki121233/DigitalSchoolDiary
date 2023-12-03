export interface Message {
    id: number
    senderId: number
    senderFullName: string
    recipientId: number
    recipientFullName: string
    content: string
    dateRead?: string
    messageSent: string
}