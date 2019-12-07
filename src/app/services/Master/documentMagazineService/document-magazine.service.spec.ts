import { TestBed, inject } from '@angular/core/testing';

import { DocumentMagazineService } from './document-magazine.service';

describe('DocumentMagazineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentMagazineService]
    });
  });

  it('should be created', inject([DocumentMagazineService], (service: DocumentMagazineService) => {
    expect(service).toBeTruthy();
  }));
});
