export enum ComponentTypes {
  Grid = 0,
  Chart = 1,
  Tree = 2
}
export enum GridFiletypes {
  Pdf = 0,
  Excel = 1
}
export enum TreeFiletypes {
  Print = 0,
  Png = 1,
  Jpeg = 2,
  Pdf = 3,
  Svg = 4
}

export class FileInfo {
  public file64: any;
  public fileName: string;
  public mimeType: string;
}

export class ExportFileType {
  constructor(
    public id: number,
    public phraseKey: string,
    public icon: string,
    public text: string = ''
  ) { }
}
