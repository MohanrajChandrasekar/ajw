import { TestBed, inject } from '@angular/core/testing';

import { ConsignServiceService } from './consign-service.service';

describe('ConsignServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsignServiceService]
    });
  });

  it('should be created', inject([ConsignServiceService], (service: ConsignServiceService) => {
    expect(service).toBeTruthy();
  }));
});
