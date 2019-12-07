import { TestBed, inject } from '@angular/core/testing';

import { PincodeRateMasterService } from './pincode-rate-master.service';

describe('PincodeRateMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PincodeRateMasterService]
    });
  });

  it('should be created', inject([PincodeRateMasterService], (service: PincodeRateMasterService) => {
    expect(service).toBeTruthy();
  }));
});
