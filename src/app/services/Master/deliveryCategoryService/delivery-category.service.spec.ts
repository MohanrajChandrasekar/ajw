import { TestBed, inject } from '@angular/core/testing';

import { DeliveryCategoryService } from './delivery-category.service';

describe('DeliveryCategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryCategoryService]
    });
  });

  it('should be created', inject([DeliveryCategoryService], (service: DeliveryCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
