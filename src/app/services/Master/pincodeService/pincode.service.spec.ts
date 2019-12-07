import { TestBed, inject } from '@angular/core/testing';

import { PincodeService } from './pincode.service';

describe('PincodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PincodeService]
    });
  });

  it('should be created', inject([PincodeService], (service: PincodeService) => {
    expect(service).toBeTruthy();
  }));
});
