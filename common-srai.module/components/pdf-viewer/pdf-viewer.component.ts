import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { MessageHelper, MessageType, ExportHelper } from '../../utilities';
import { FileInfo } from '../../models';

@Component({
  selector: 'srai-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit, OnChanges {

  @Input() public pdfSrc: string | ArrayBuffer | SharedArrayBuffer;

  @Input() public title: string;

  @Input() public noContent: boolean;

  @Input() public zoom = 1.2;

  @Input() public page = 1;

  @Input() public originalSize = true;

  @Input() public fileInfo: FileInfo;

  @Output() public pdfLoaded: EventEmitter<boolean> = new EventEmitter();

  public totalPages: number;
  public msgr: MessageHelper = new MessageHelper();

  constructor(
  ) { }

  public ngOnInit() { }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['pdfSrc'] || changes['noContent']) {
      this.page = 1;
      this.msgr.clear();
      if (this.noContent) { this.msgr.set(MessageType.NoData); }
    }
  }

  public onError(error: any) {
    this.msgr.set(MessageType.NoData);
    this.pdfLoaded.emit(true);
  }

  // for zoom in and zoom out
  public incrementZoom(amount: number) {
    this.zoom += amount;
  }
  // for showing total pages in PDF
  public afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.pdfLoaded.emit(true);
  }
  public nextPage() {
    this.page++;
  }
  public prevPage() {
    this.page--;
  }
  public downloadFile() {
    if (typeof this.pdfSrc === 'string') {
      const link = document.createElement('a');
      link.download = this.title;
      link.href = this.pdfSrc;
      link.click();
    } else {
      ExportHelper.openOrSaveFile(this.fileInfo);
    }
  }
  public resetZoom() {
    this.zoom = 1.2;
  }
}
