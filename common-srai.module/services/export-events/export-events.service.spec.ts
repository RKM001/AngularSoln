import { TestBed, inject } from '@angular/core/testing';

import { ExportEventsService } from './export-events.service';

describe('ExportEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportEventsService]
    });
  });

  it('should be created', inject([ExportEventsService], (service: ExportEventsService) => {
    expect(service).toBeTruthy();
  }));
});
