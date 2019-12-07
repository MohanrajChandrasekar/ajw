import { TestBed, inject } from '@angular/core/testing';

import { GlobalErrorHandlerServiceService } from './global-error-handler-service.service';

describe('GlobalErrorHandlerServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandlerServiceService]
    });
  });

  it('should be created', inject([GlobalErrorHandlerServiceService], (service: GlobalErrorHandlerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
