import { Pipe, PipeTransform } from '@angular/core';

export interface IPipeInput {
    format: FormatterEnums;
    culture: string;
    currencyCode?: string;
    fractionDigits?: number;
}

export interface IPipeNumberAbbreviateInput {
    format: FormatterEnums;
    currencySymbol: string;
    abbrNumber: string;
}

export enum FormatterEnums {
    Percentage = '%',
    Money = 'm',
    Integer = 'i',
    Float = 'f',
    Integer_Money = 'i-m',
    Float_Money = 'f-m',
    Integer_Percentage = 'i-%',
    Float_Percentage = 'f-%'
}

@Pipe({
    name: 'formatter',
    pure: false
})
export class FormatterPipe implements PipeTransform {
    private _culture = 'en-US';
    private _currencyCode = 'USD';
    private _currencySymbol = '$';
    private _fractionDigits = 2;

    constructor() { }

    public transform(value: any, input: IPipeInput): any {

        this._culture = input.culture;
        this._currencyCode = input.currencyCode;
        this._fractionDigits = input.fractionDigits;

        switch (input.format) {
            case FormatterEnums.Integer_Percentage:
            case FormatterEnums.Float_Percentage:
            case FormatterEnums.Percentage: {
                return new Intl.NumberFormat(this._culture,
                    {
                        style: 'percent',
                        maximumFractionDigits: this._fractionDigits,
                        minimumFractionDigits: this._fractionDigits
                    }).format(value);
            }
            // Both are of same format
            case FormatterEnums.Money:
            case FormatterEnums.Float_Money: {
                return new Intl.NumberFormat(this._culture,
                    {
                        style: 'currency',
                        currency: this._currencyCode,
                        currencyDisplay: 'symbol',
                        maximumFractionDigits: this._fractionDigits,
                        minimumFractionDigits:
                            this._fractionDigits
                    }).format(value);
            }
            case FormatterEnums.Integer_Money: {
                return new Intl.NumberFormat(this._culture, {
                    style: 'currency', currency: this._currencyCode,
                    maximumFractionDigits: this._fractionDigits, minimumFractionDigits: this._fractionDigits
                }).format(value);
            }
            case FormatterEnums.Float:
            case FormatterEnums.Integer:
            default: {
                return new Intl.NumberFormat(this._culture,
                    {
                        style: 'decimal',
                        maximumFractionDigits: this._fractionDigits,
                        minimumFractionDigits: this._fractionDigits
                    }).format(value);
            }
        }

    }

    public abbreviateNumber(value: any, input: IPipeNumberAbbreviateInput): any {
        this._currencySymbol = input.currencySymbol;
        const numberValue: string = '' + value + '';

        switch (input.format) {
            case FormatterEnums.Float:
            case FormatterEnums.Money:
            case FormatterEnums.Float_Money:
            case FormatterEnums.Integer_Money: {
                return numberValue.includes('-') ?
                    '-' + this._currencySymbol + this.suffixabbreviateNumber(numberValue.split('-')[1], input.abbrNumber)
                    : this._currencySymbol + this.suffixabbreviateNumber(numberValue, input.abbrNumber);
            }
            case FormatterEnums.Integer: {
                return this.suffixabbreviateNumber(numberValue, input.abbrNumber);
            }
            case FormatterEnums.Percentage:
            case FormatterEnums.Float_Percentage:
            case FormatterEnums.Integer_Percentage: {
                const PercentageValue = (value * 100).toFixed();
                return this.suffixabbreviateNumber(PercentageValue, input.abbrNumber) + '%';
            }
        }
    }

    private suffixabbreviateNumber(number: any, postFix: string) {
        const SI_POSTFIXES = postFix === '' ? ['', 'K', 'M', 'B', 'T', 'P', 'E'] : postFix.split(',');

        // tslint:disable-next-line:no-bitwise
        const tier = Math.log10(Math.abs(number)) / 3 | 0;
        if (tier === 0) { return number; }
        const postfix = SI_POSTFIXES[tier];
        const scale = Math.pow(10, tier * 3);
        const scaled = number / scale;
        let formatted = scaled.toFixed(1) + '';
        if (/\.0$/.test(formatted)) {
            formatted = formatted.substr(0, formatted.length - 2);
        }
        return formatted + postfix;
    }
}
