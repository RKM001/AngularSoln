import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule, MatDialogModule } from '@angular/material';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MomentModule } from 'angular2-moment';
import { CoreModule } from '@srai.cms25.core.module';

import {
  SalesTreeComponent, ExportButtonComponent, IconButtonComponent, SraiTooltipComponent,
  NotificationComponent, ApplicationErrorComponent, PdfViewerComponent, ModalPopupComponent
} from './components';
import { ExportEventsService, NotificationService, TrackerService, UtilityService } from './services';
import { TooltipDirective, PhraseKeyDirective } from './directives';

import { AuthenticatedGuard } from './utilities';
import { FormatterPipe } from './utilities/pipes/formatter-pipe';
import { UnitsPipe } from './utilities/pipes/units.pipe';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatTooltipModule,
    MomentModule,
    PdfViewerModule,
    MatDialogModule
  ],
  declarations: [
    ApplicationErrorComponent,
    ExportButtonComponent,
    IconButtonComponent,
    NotificationComponent,
    SalesTreeComponent,
    SraiTooltipComponent,
    PdfViewerComponent,
    PhraseKeyDirective,
    TooltipDirective,
    FormatterPipe,
    UnitsPipe,
    ModalPopupComponent
  ],
  exports: [
    SalesTreeComponent,
    ExportButtonComponent,
    IconButtonComponent,
    SraiTooltipComponent,
    PdfViewerComponent,
    TooltipDirective,
    PhraseKeyDirective,
    NotificationComponent,
    ApplicationErrorComponent,
    FormatterPipe,
    UnitsPipe,
    ModalPopupComponent
  ],
  entryComponents: [ModalPopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AuthenticatedGuard,
    ExportEventsService,
    NotificationService,
    TrackerService,
    UtilityService
  ]
})
export class CommonSraiModule { }

