import { TestBed, inject } from '@angular/core/testing';

import { ExpenseManagerService } from './expense-manager.service';

describe('ExpenseManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseManagerService]
    });
  });

  it('should be created', inject([ExpenseManagerService], (service: ExpenseManagerService) => {
    expect(service).toBeTruthy();
  }));
});
