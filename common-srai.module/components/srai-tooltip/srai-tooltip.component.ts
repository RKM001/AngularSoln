import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhraseBaseService, LogService } from '@srai.cms25.core.module';

// Usage: 1
// <srai-tooltip tooltipKey="PHRASE_KEY">
//    <!-- Content to which tooltip needs to be displayed -->
// </srai-tooltip>
// Usage: 2
// <srai-tooltip [tooltipKey]="'PHRASE_KEY'">
//    <!-- Content -->
// </srai-tooltip>
//
// where phkey is a variable in declared in the *.component.ts file
// Usage: 3
// <srai-tooltip [tooltipKey]="phKey">
//    <!-- Content -->
// </srai-tooltip>
// Usage: 4
// <srai-tooltip tooltipKey="{{phKey}}>
//    <!-- Content -->
// </srai-tooltip>

@Component({
  selector: 'srai-tooltip',
  templateUrl: './srai-tooltip.component.html',
  styleUrls: ['./srai-tooltip.component.css']
})
export class SraiTooltipComponent implements OnInit, OnDestroy {

  constructor(
    private readonly _phraseService: PhraseBaseService,
    private readonly _log: LogService
  ) { }

  private _subscriptions: Subscription;

  private _phraseKey: string;
  @Input('tooltipKey')
  public set phraseKey(val: string) {
    this._phraseKey = val;
    if (!this.isValid()) { return; }
    this.resolvePhrase();
  }

  public tooltipText: string;

  public ngOnInit() {
  }

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
        const text = this._phraseService.getPhrase(this._phraseKey);
        this.tooltipText = text;
      });
  }
}
