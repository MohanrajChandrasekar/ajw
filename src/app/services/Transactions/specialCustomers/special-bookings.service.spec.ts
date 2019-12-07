import { TestBed, inject } from '@angular/core/testing';

import { SpecialBookingsService } from './special-bookings.service';

describe('SpecialBookingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecialBookingsService]
    });
  });

  it('should be created', inject([SpecialBookingsService], (service: SpecialBookingsService) => {
    expect(service).toBeTruthy();
  }));
});
