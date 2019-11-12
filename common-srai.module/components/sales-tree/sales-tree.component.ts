import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
import { PhraseBaseService } from '@srai.cms25.core.module';
import { Subscription } from 'rxjs';
import { ExportEventsService } from '../../services/export-events/export-events.service';
import { ExtendTreeView, ITreeViewDetails, TreeFiletypes } from '../../models';
import { SalesTreeHelper, ExportHelper } from '../../utilities';

@Component({
  selector: 'srai-sales-tree',
  templateUrl: './sales-tree.component.html',
  styleUrls: ['./sales-tree.component.css']
})
export class SalesTreeComponent implements OnInit, OnChanges {

  @Input() public treeDetails: ITreeViewDetails;

  @Input() public colors: any[];

  @Input() public width: number;

  @Input() public height: number;

  @Input() public title: string;

  @Input() public currencyCode: string;

  @Input() public culture: string;

  @Input() public download: TreeFiletypes;

  @Input() public items: any;

  @Input() public reload: boolean;

  @Input() public distance = 0.0;

  @ViewChild('chartTarget') public chartTarget: ElementRef;

  public chart: Highcharts.ChartObject;

  private subscriptions: Subscription[] = new Array();

  private _init = true;

  private tree;

  constructor(
    private readonly _phraseBaseService: PhraseBaseService,
    private readonly _eventService: ExportEventsService) { }

  public ngOnInit() {
    this._init = false;
    this.tree = new ExtendTreeView();
    this.tree.distanceWidth(this.distance);
    this.tree.bindTreeView();
    this.subscriptions.push(
      this._eventService.exportTree.subscribe((type) => this.exportTo(type)));

    this.subscriptions.push(
      this._phraseBaseService.loaded
        .filter(ready => ready).subscribe(() => {
          this.init();
        }));
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['width'] || changes['height'] || (changes['reload']
      && this.reload && this._init === false)) {
      this.reload = false;
      if (this.tree) {
        this.tree.distanceWidth(this.distance);
      }
      this.init();
    }
    if (changes['download'] && this.download) {
      this.exportTo(this.download);
    }
  }

  private init() {
    this.parser(this.treeDetails).then((data) => {
      this.initView(data);
    });
  }

  private initView(collection: any) {
    // Bind Tree View HighChart
    this.chart = Highcharts.chart(this.chartTarget.nativeElement, {
      chart: {
        type: 'tree',
        style: { fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif', fontSize: '12px' },
        width: this.width,
        height: this.height,
      },
      series: [{ data: [collection] }],
      title: { text: '' },
      credits: { enabled: false },
      exporting: {
        allowHTML: true,
        filename: this.title, // get the title as the file name
      },
      colors: this.colors,
    });
  }

  public parser(treeInfo: ITreeViewDetails): Promise<any> {
    const that = this;

    return new Promise(resolve => {

      const retVal = { tree: [], legends: [] };
      // Get the all possible Legends from data set and bind into an array.
      const legends = _.map(_.uniqBy(this.items, treeInfo.legendKey), treeInfo.legendKey);
      legends.forEach(element => {
        retVal.legends.push({ text: this._phraseBaseService.getPhrase(element) });
      });

      retVal.tree = SalesTreeHelper.getTreeValues(this.items, treeInfo, that, legends);

      resolve(retVal);
    });
  }

  private exportTo(type: TreeFiletypes): void {
    this.chart.update({
      exporting: {
        sourceWidth: this.chart['chartWidth'],
        sourceHeight: this.chart['chartHeight'],
        printMaxWidth: this.chart['chartWidth']
      }
    });

    ExportHelper.exportChart(this.chart, type);
  }
}
