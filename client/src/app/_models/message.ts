export interface Message {
    id: number
    senderId: number
    senderFullName: string
    senderAccountType: string
    recipientId: number
    recipientFullName: string
    recipientAccountType: string
    content: string
    dateRead?: string
    messageSent: string
}