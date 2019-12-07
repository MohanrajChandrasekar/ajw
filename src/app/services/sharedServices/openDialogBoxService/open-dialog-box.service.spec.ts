import { TestBed, inject } from '@angular/core/testing';

import { OpenDialogBoxService } from './open-dialog-box.service';

describe('OpenDialogBoxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenDialogBoxService]
    });
  });

  it('should be created', inject([OpenDialogBoxService], (service: OpenDialogBoxService) => {
    expect(service).toBeTruthy();
  }));
});
