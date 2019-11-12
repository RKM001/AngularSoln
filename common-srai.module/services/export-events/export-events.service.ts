import { Injectable } from '@angular/core';
import { IEvent, Event } from '@srai.cms25.core.module';
import { GridFiletypes, TreeFiletypes } from '../..';

@Injectable()
export class ExportEventsService {

  private exportGridEvent: IEvent<GridFiletypes> = new Event<GridFiletypes>();
  private exportTreeEvent: IEvent<TreeFiletypes> = new Event<TreeFiletypes>();

  constructor() { }

  public get exportGrid(): IEvent<GridFiletypes> {
    return this.exportGridEvent;
  }
  public get exportTree(): IEvent<TreeFiletypes> {
    return this.exportTreeEvent;
  }

}
