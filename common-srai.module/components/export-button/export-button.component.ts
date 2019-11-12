import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PhraseBaseService } from '@srai.cms25.core.module';
import { ExportEventsService } from '../../services/export-events/export-events.service';
import { ComponentTypes, TreeFiletypes, ExportFileType, GridFiletypes } from '../../models/export';
import { Subscription } from 'rxjs';
import { PhraseKeyConstants } from '../../../shared/models/constants';
@Component({
  selector: 'srai-export-button',
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.css']
})
export class ExportButtonComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription;
  // Default type is set to chart, so that we don't have to set it from line and segment charts
  @Input() public type: ComponentTypes = ComponentTypes.Chart;

  @Output() public export: EventEmitter<TreeFiletypes> = new EventEmitter();

  public gridFileTypes: ExportFileType[] = [
    new ExportFileType(GridFiletypes.Excel, PhraseKeyConstants.exportTokens.exportExcelToken, 'k-i-file-excel'),
    new ExportFileType(GridFiletypes.Pdf, PhraseKeyConstants.exportTokens.exportPDFToken, 'k-i-file-pdf')
  ];
  public treeOrChartFileTypes: ExportFileType[] = [
    new ExportFileType(TreeFiletypes.Print, 'printchart', 'k-i-print'),
    new ExportFileType(TreeFiletypes.Png, 'pngimage', 'k-i-image-export'),
    new ExportFileType(TreeFiletypes.Jpeg, 'jpgimage', 'k-i-image-export'),
    new ExportFileType(TreeFiletypes.Pdf, 'pdfdoc', 'k-i-file-pdf'),
    new ExportFileType(TreeFiletypes.Svg, 'svgimage', 'k-i-image-export'),
  ];

  constructor(
    private readonly _eventService: ExportEventsService,
    private readonly _phraseService: PhraseBaseService
  ) { }

  public ngOnInit() {
    this.subscriptions = this._phraseService.loaded
      .filter(ready => ready)
      .subscribe(() => this.localiseOptions());
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private localiseOptions(): void {
    // Repeated localisation logic
    const localise = (options: ExportFileType[]) => {
      options.forEach(type => {
        type.text = this._phraseService.getPhrase(type.phraseKey);
      });
    };

    localise(this.gridFileTypes);
    localise(this.treeOrChartFileTypes);
  }

  public get isGrid(): boolean {
    return this.type === ComponentTypes.Grid;
  }

  public exportGrid(type: GridFiletypes) {
    // At a time we have only one grid loaded in the view.
    // The visible grid component will take care of exporting the data.
    this._eventService.exportGrid.publish(type);
  }

  public exportTreeOrChart(type: TreeFiletypes) {
    if (this.type === ComponentTypes.Tree) {
      // At a time we have only one tree loaded in the view.
      // The visible tree component will take care of exporting the data.
      this._eventService.exportTree.publish(type);
    } else { // Chart
      // raise an output event as it is handled by direct parent
      this.export.emit(type);
    }
  }

}
