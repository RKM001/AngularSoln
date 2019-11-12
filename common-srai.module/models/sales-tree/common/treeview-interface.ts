
export interface ITreeViewDetails {
    key: string;
    parentKey: string;
    titleKey: string;
    legendKey: string;
    valueKey: string;
    formatKey: string;
    nuOfDecimal: string;
}

export class TreeViewDetails implements ITreeViewDetails {
    public key: string;
    public parentKey: string;
    public titleKey: string;
    public legendKey: string;
    public valueKey: string;
    public formatKey: string;
    public nuOfDecimal: string;

    constructor(key: string, parentKey: string, titleKey: string, legendKey: string,
        valueKey: string, formatKey: string, nuOfDecimal: string) {
        this.key = key;
        this.parentKey = parentKey;
        this.titleKey = titleKey;
        this.legendKey = legendKey;
        this.valueKey = valueKey;
        this.formatKey = formatKey;
        this.nuOfDecimal = nuOfDecimal;
    }
}
