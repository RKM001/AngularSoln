import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class UtilityService {

    /**
     * A place for all the utility methods which will be needed across application.
     */
    constructor(
        private _sanitizer: DomSanitizer
    ) { }

    public sanitizeImageUrl(imageStr: string): string {
        if (imageStr.startsWith('data:image')) {
            // This is a sanitized image string
            return imageStr;
        } else {
            return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageStr) as string;
        }
    }

    public sanitizeUrl(url: string): string {
        return this._sanitizer.bypassSecurityTrustResourceUrl(url) as string;
    }

    /**
     * Application base url will be returned.
     */
    public getAppBaseUrl(): string {
        return document.getElementsByTagName('base')[0].href;
    }

    /**
     * Reloads / refreshes page
     */
    public reloadPage(): void {
        window.location.reload();
    }
}
