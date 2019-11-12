import { Directive, ElementRef, Input } from '@angular/core';
import { PhraseBaseService, LogService } from '@srai.cms25.core.module';

// Simple directive appends title to the component by resolving the phrase
// Usage examples:
// <div sraiTooltip="FOCUS">Test Link1</div>
// <div [sraiTooltip]="'COMPARISON'">Test Link2</div>
@Directive({
  selector: '[sraiTooltip]'
})
export class TooltipDirective {

  constructor(
    private _el: ElementRef,
    private readonly _phraseService: PhraseBaseService,
    private readonly _log: LogService
  ) { }

  private _text: string;

  private _phraseKey: string;
  @Input('sraiTooltip')
  public set phraseKey(val: string) {
    this._phraseKey = val;
    if (!this.isValid()) { return; }
    this.resolvePhrase();
  }

  private isValid(): boolean {
    if (!this._phraseKey) {
      this._log.error('PhraseKey not set for sraiTooltip directive');
      return false;
    }
    return true;
  }

  private resolvePhrase() {
    this._phraseService.loaded
      .filter(ready => ready)
      .subscribe(() => {
        this.setTooltip();
      });
  }

  private setTooltip() {

    // Find the phrase value
    this._text = this._phraseService.getPhrase(this._phraseKey);

    // Set title for the element
    this._el.nativeElement.title = this._text;
  }

}
