import { TestBed, inject } from '@angular/core/testing';

import { FailedCnnoHandlingService } from './failed-cnno-handling.service';

describe('FailedCnnoHandlingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FailedCnnoHandlingService]
    });
  });

  it('should be created', inject([FailedCnnoHandlingService], (service: FailedCnnoHandlingService) => {
    expect(service).toBeTruthy();
  }));
});
