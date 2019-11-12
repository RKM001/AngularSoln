import { Directive, Input, ElementRef } from '@angular/core';
import { PhraseBaseService, LogService } from '@srai.cms25.core.module';

// Usage examples:
// <div phraseKey="FOCUS"></div>
// <div [phraseKey]="'COMPARISON'"></div>
// <div [phraseKey]="phKey"></div>
//    where phkey is a variable in declared in the *.component.ts file
@Directive({
  selector: '[phraseKey]'
})
export class PhraseKeyDirective {

  constructor(
    private _element: ElementRef,
    private readonly _phraseService: PhraseBaseService,
    private readonly _log: LogService
  ) { }

  private _phraseKey: string;
  @Input('phraseKey')
  public set phraseKey(val: string) {
    this._phraseKey = val;
    if (!this.isValid()) { return; }
    this.resolvePhrase();
  }

  private isValid(): boolean {
    if (!this._phraseKey) {
      this._log.error('PhraseKey not set for phraseKey directive');
      return false;
    }
    return true;
  }

  private resolvePhrase() {
    this._phraseService.loaded
      .filter(ready => ready)
      .subscribe(() => {
        // Once phrase service is ready, resolve the phrase
        this.setText();
      });
  }

  private setText() {
    // Find the phrase value
    const text = this._phraseService.getPhrase(this._phraseKey);
    const el = this._element.nativeElement;
    // Some content is there, append the text.
    if (el.innerHTML) {
      el.innerHTML += text;
    } else {
      // Set text
      this._element.nativeElement.innerHTML = text;
    }

  }

}
