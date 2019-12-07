import { TestBed, inject } from '@angular/core/testing';

import { MisroutedServicesService } from './misrouted-services.service';

describe('MisroutedServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MisroutedServicesService]
    });
  });

  it('should be created', inject([MisroutedServicesService], (service: MisroutedServicesService) => {
    expect(service).toBeTruthy();
  }));
});
