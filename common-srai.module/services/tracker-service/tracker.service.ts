import { Injectable } from '@angular/core';
import { AppInsightBaseService, UserResolver } from '@srai.cms25.core.module';
import { Router } from '@angular/router';
import { FiltersLookup, ISelectedFilter } from '@srai.cms25.filters.module';

/**
 * Define events which needs tracking here.
 * These keywords will be used in the query in the azure dashboards.
 */
const TrackableEvents = {
  CcrReportAccess: 'CcrReports',
  ApplyFilter: 'ApplyFilter'
};

/**
 * Define application events which needs to be tracked as individual methods.
 * Each typeof event will have some mandatory fields, those translates to method arguments.
 */
@Injectable()
export class TrackerService {

  constructor(
    private readonly _tracker: AppInsightBaseService,
    private readonly _userResolver: UserResolver,
    private readonly _router: Router
  ) { }

  public trackPageView(pageName: string, url: string): void {
    const properties = { retailerId: this._userResolver.retailerId };
    this._tracker.logPageView(pageName, url, properties);
  }

  public trackApplyFilter(filterInput: FiltersLookup): void {
    const info = {};
    // Form the information to be logged
    for (const propertyName in filterInput) {
      // Prevents accidental iteration over properties
      // inherited from an object’s prototype
      if (filterInput.hasOwnProperty(propertyName)) {
        const propVal: ISelectedFilter[] = filterInput[propertyName];
        // combine all selection ids into coma seperated string
        const traceInfo = propVal.map(x => x.selectionId).join(',');
        info[propertyName] = traceInfo;
      }
    }
    this.trackEvent(TrackableEvents.ApplyFilter, info);
  }

  public trackCcrReportAccess(trackerId: string, mode: string, url: string): void {
    // Properties specific to ccr report access
    const properties = {
      trackerId: trackerId,
      mode: mode,
      url: url
    };
    this.trackEvent(TrackableEvents.CcrReportAccess, properties);
  }

  /**
   * Appends the common propertirs to the event and makes a call to Application Insight service.
   * @param eventName : event name, which will be displayed in azure portal
   * @param properties : event specific properties, if any
   */
  private trackEvent(eventName: string, properties?: any) {
    // if properties is not passed from caller, initialize it.
    if (!properties) { properties = {}; }

    // Append common event properties.
    properties.origin = this._router.url;
    properties.retailerId = this._userResolver.retailerId;

    this._tracker.logEvent(eventName, properties);
  }

}
