import { TestBed, inject } from '@angular/core/testing';

import { ConsignmentTrackingService } from './consignment-tracking.service';

describe('ConsignmentTrackingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsignmentTrackingService]
    });
  });

  it('should be created', inject([ConsignmentTrackingService], (service: ConsignmentTrackingService) => {
    expect(service).toBeTruthy();
  }));
});
