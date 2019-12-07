import { TestBed, inject } from '@angular/core/testing';

import { CodeGenService } from './code-gen.service';

describe('CodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodeGenService]
    });
  });

  it('should be created', inject([CodeGenService], (service: CodeGenService) => {
    expect(service).toBeTruthy();
  }));
});
