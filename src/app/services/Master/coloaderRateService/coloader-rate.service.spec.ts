import { TestBed, inject } from '@angular/core/testing';

import { ColoaderRateService } from './coloader-rate.service';

describe('ColoaderRateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColoaderRateService]
    });
  });

  it('should be created', inject([ColoaderRateService], (service: ColoaderRateService) => {
    expect(service).toBeTruthy();
  }));
});
