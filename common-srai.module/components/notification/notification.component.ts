import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { RetailerAttributeBaseService } from '@srai.cms25.core.module';
import { NotificationService } from '../../services';
import { INotification, } from '../../models';

@Component({
  selector: 'srai-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('toggleState', [
      state('true', style({ display: 'block', opacity: 1 })),
      state('false', style({ display: 'none', opacity: 0 })),
      // transition
      transition('* => *', animate('500ms ease-in-out'))
    ])
  ]
})

export class NotificationComponent implements OnInit, OnDestroy {

  public listOfNotification: INotification[] = [];
  public culture: string;
  private _subscriptions: Subscription;
  public toggle = false;
  public timer: any;

  constructor(
    private readonly _notificationService: NotificationService,
    private readonly _retailerAttribute: RetailerAttributeBaseService
  ) { }

  public ngOnInit() {
    this._subscriptions =
      this._notificationService.notificationEvent.subscribe(notification => this.loadNotification(notification));
    this._retailerAttribute.onReady.filter(ready => ready).subscribe(() => {
      this.culture = this._retailerAttribute.culture;
    });
  }
  public ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public loadNotification(notification: INotification) {
    this.listOfNotification.unshift(notification);
    if (this.listOfNotification.length > 10) {
      this.listOfNotification.pop();
    }
    this.toggle = true;
    this.setTimoutforNotification(this);
  }

  public toggleNotification() {
    this.toggle = !this.toggle;
    this.setTimoutforNotification(this);
  }

  public closeNotification() {
    this.toggle = false;
    this.clearTimeOut(this);
  }

  public closeNotificationItem(item: any) {
    this.listOfNotification.splice(this.listOfNotification.indexOf(item), 1);
    this.clearTimeOut(this.timer);
  }

  public setTimoutforNotification(self: any) {
    if (self.toggle) {
      self.clearTimeOut(self);
      self.timer = window.setTimeout(function () {
        self.toggle = false;
      }, 4000);
    }
  }
  public clearTimeOut(self: any) {
    window.clearTimeout(self.timer);
  }
  public mouseOut() {
    this.setTimoutforNotification(this);
  }

  public mouseOver() {
    this.clearTimeOut(this);
  }
}
