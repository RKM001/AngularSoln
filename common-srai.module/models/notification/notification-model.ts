export interface INotification {
    title: string;
    content: string;
    type: NotificationType;
    link: string;
    dateTime: Date;
}

export class NotificationModel implements INotification {
    public title: string;
    public content: string;
    public type: NotificationType;
    public link: string;
    public dateTime: Date;
    constructor(title: string, content: string, type: NotificationType, link: string, dateTime: Date) {
        this.title = title;
        this.content = content;
        this.type = type;
        this.link = link;
        this.dateTime = dateTime;
    }
}
export enum NotificationType {
    Success = 1,
    Info = 2,
    Warning = 3,
    Error = 4
}
