import { TestBed, inject } from '@angular/core/testing';

import { BookIssueService } from './book-issue.service';

describe('BookIssueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookIssueService]
    });
  });

  it('should be created', inject([BookIssueService], (service: BookIssueService) => {
    expect(service).toBeTruthy();
  }));
});
