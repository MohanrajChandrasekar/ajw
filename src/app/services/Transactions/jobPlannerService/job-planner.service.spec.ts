import { TestBed, inject } from '@angular/core/testing';

import { JobPlannerService } from './job-planner.service';

describe('JobPlannerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobPlannerService]
    });
  });

  it('should be created', inject([JobPlannerService], (service: JobPlannerService) => {
    expect(service).toBeTruthy();
  }));
});
