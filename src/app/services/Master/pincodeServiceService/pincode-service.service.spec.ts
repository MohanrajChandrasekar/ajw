import { TestBed, inject } from '@angular/core/testing';

import { PincodeServiceService } from './pincode-service.service';

describe('PincodeServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PincodeServiceService]
    });
  });

  it('should be created', inject([PincodeServiceService], (service: PincodeServiceService) => {
    expect(service).toBeTruthy();
  }));
});
