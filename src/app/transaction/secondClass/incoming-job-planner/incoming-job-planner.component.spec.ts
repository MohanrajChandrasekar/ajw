import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingJobPlannerComponent } from './incoming-job-planner.component';

describe('IncomingJobPlannerComponent', () => {
  let component: IncomingJobPlannerComponent;
  let fixture: ComponentFixture<IncomingJobPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingJobPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingJobPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
