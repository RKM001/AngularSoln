import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Retailers } from '../../enums';

@Pipe({
    name: 'units',
    pure: false,
})
export class UnitsPipe implements PipeTransform {
    private _abbrev = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    private _abbrevLCL = ['', 'K', 'M', 'Mds', 'T', 'P', 'E'];

    constructor(private readonly _currencyPipe: CurrencyPipe) { }

    public transform(value: number, ...args: any[]) {
        const retailerId = args && args.length ? args[1] : 12;
        let order: number;
        let suffix: string;
        if (retailerId === Retailers.LCL) {
            order = value === 0
                ? 0
                : Math.min(Math.floor(Math.log10(Math.abs(value)) / 3), this._abbrevLCL.length - 1);
            suffix = this._abbrevLCL[order];
        } else {
            order = value === 0
                ? 0
                : Math.min(Math.floor(Math.log10(Math.abs(value)) / 3), this._abbrev.length - 1);
            suffix = this._abbrev[order];
        }

        const currencyCode = args && args.length > 1 ? args[1] : undefined;
        const precision = args && args.length ? args[0] : 2;

        const fv = (value / Math.pow(10, order * 3)).toFixed(precision);

        const ret = currencyCode ? this._currencyPipe.transform(fv, currencyCode) : fv;

        return (fv + suffix);
    }
}
