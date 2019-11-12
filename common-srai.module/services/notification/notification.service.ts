import { Injectable } from '@angular/core';
import { INotification, NotificationType } from '../../models';
import { IEvent, Event } from '@srai.cms25.core.module';

@Injectable()
export class NotificationService {

  private _notificationEvent: IEvent<INotification> = new Event<INotification>();

  constructor() { }

  public get notificationEvent(): IEvent<INotification> {
    return this._notificationEvent;
  }

  public pushNotification(title: string, content: string, type: NotificationType, link: string = '') {
    const notificationObj: INotification = {
      title: title,
      content: content,
      type: type,
      link: link,
      dateTime: new Date()
    };
    this.notificationEvent.publish(notificationObj);
  }
}
