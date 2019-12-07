import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentTrackingComponent } from './consignment-tracking.component';

describe('ConsignmentTrackingComponent', () => {
  let component: ConsignmentTrackingComponent;
  let fixture: ComponentFixture<ConsignmentTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsignmentTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
