import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhraseBaseService, LogService } from '@srai.cms25.core.module';

@Component({
  selector: 'srai-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css']
})
export class IconButtonComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription;

  private _phraseKey: string;
  @Input('tooltipKey')
  public set phraseKey(val: string) {
    this._phraseKey = val;
    if (!this.isValid()) { return; }
    this.resolvePhrase();
  }

  // To store resolved tooltip
  public tooltip: string;

  /**
   * is content visible
   */
  @Input()
  public visible: boolean;

  /**
   * fa-icon class
   */
  @Input()
  public icon: string;

  constructor(
    private readonly _phraseService: PhraseBaseService,
    private readonly _log: LogService
  ) { }

  public ngOnInit() { }

  public ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  private isValid(): boolean {
    if (!this._phraseKey) {
      this._log.error('PhraseKey not set for srai-tooltip component');
      return false;
    }
    return true;
  }

  private resolvePhrase() {
    this._subscriptions =
      this._phraseService.loaded
        .filter(ready => ready)
        .subscribe(() => {
          // Once phrase service is ready, resolve the phrase
          this.tooltip = this._phraseService.getPhrase(this._phraseKey);
        });
  }

}
