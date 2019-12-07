import { TestBed, inject } from '@angular/core/testing';

import { IncomeLoadService } from './income-load.service';

describe('IncomeLoadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IncomeLoadService]
    });
  });

  it('should be created', inject([IncomeLoadService], (service: IncomeLoadService) => {
    expect(service).toBeTruthy();
  }));
});
