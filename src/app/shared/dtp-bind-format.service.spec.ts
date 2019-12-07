import { TestBed, inject } from '@angular/core/testing';

import { DtpBindFormatService } from './dtp-bind-format.service';

describe('DtpBindFormatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DtpBindFormatService]
    });
  });

  it('should be created', inject([DtpBindFormatService], (service: DtpBindFormatService) => {
    expect(service).toBeTruthy();
  }));
});
