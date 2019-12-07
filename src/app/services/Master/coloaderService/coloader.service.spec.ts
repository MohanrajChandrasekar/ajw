import { TestBed, inject } from '@angular/core/testing';

import { ColoaderService } from './coloader.service';

describe('ColoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColoaderService]
    });
  });

  it('should be created', inject([ColoaderService], (service: ColoaderService) => {
    expect(service).toBeTruthy();
  }));
});
