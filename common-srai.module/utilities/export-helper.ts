import { TreeFiletypes, FileInfo } from '../models/export';

export class ExportHelper {

    public static exportChart(chart: Highcharts.ChartObject, type: TreeFiletypes): void {
        if (type === TreeFiletypes.Print) {
            chart.print();
        } else {
            let typeStr: string;
            // Allowed type strings for export are:
            // image/png, image/jpeg, application/pdf and image/svg+xml
            switch (type) {
                case TreeFiletypes.Png: typeStr = 'image/png'; break;
                case TreeFiletypes.Jpeg: typeStr = 'image/jpeg'; break;
                case TreeFiletypes.Pdf: typeStr = 'application/pdf'; break;
                case TreeFiletypes.Svg: typeStr = 'image/svg+xml'; break;
            }

            chart.exportChart({ type: typeStr });
        }
    }

    public static openOrSaveFile(fileInfo: FileInfo): void {
        const blob = ExportHelper.b64toBlob(fileInfo.file64, fileInfo.mimeType, null);
        // msSaveOrOpenBlob only supports to IE and Edge not chrome
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileInfo.fileName);
        } else {
            const objectUrl = URL.createObjectURL(blob);
            const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
            a.href = objectUrl;
            a.download = fileInfo.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);
        }
    }

    private static b64toBlob(b64Data: string, contentType: string, sliceSize: number): Blob {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
}
