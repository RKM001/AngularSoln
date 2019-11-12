import * as _ from 'lodash';
import { TreeRow, ITreeViewDetails } from '../models';
import { PhraseKeyConstants } from '../../shared/models/constants';
import { FormatterPipe } from '../utilities/pipes/formatter-pipe';



export class SalesTreeHelper {

    public static getTreeValues(items: any, treeInfo: ITreeViewDetails, that: any, legends: any) {
        const retVal = [];
        _.forIn(_.groupBy(items,
            (item) => item[treeInfo.key]),
            (collection, index) => {
                const treeObj = SalesTreeHelper.getValues(collection, treeInfo, that, legends);
                retVal.push(new TreeRow(_.snakeCase(_.lowerCase(index)), treeObj['key'], treeObj['value']));
            });
        return retVal;
    }

    private static getValues(collection: any, treeInfo: ITreeViewDetails, that: any, legends: any) {
        const retVal = { key: '', value: { title: undefined, data: [] } };
        const format = new FormatterPipe();
        let treeValue;
        legends.forEach(legend => {
            const nodeInfo = _.find(collection, [treeInfo.legendKey, legend]);
            if (nodeInfo) {
                const key = _.snakeCase(_.lowerCase(nodeInfo[treeInfo.parentKey]));
                retVal.key = key === 'null' ? null : key;
                // Fetching the localize value of specified key.
                const title = that._phraseBaseService.getPhrase(nodeInfo[treeInfo.titleKey]);
                if (nodeInfo[treeInfo.valueKey] && nodeInfo[treeInfo.valueKey].toString().toUpperCase() === PhraseKeyConstants.metric.NoAccess) {
                    treeValue = that._phraseBaseService.getPhrase(nodeInfo[treeInfo.valueKey]);
                } else {
                    treeValue = format.transform(nodeInfo[treeInfo.valueKey],
                        {
                            format: nodeInfo[treeInfo.formatKey],
                            culture: that.culture,
                            currencyCode: that.currencyCode,
                            fractionDigits: nodeInfo[treeInfo.nuOfDecimal]
                        });
                }
                retVal.value.title = title;
                retVal.value.data.push(treeValue);
            } else { retVal.value.data.push(''); }
        });
        return retVal;
    }
}
