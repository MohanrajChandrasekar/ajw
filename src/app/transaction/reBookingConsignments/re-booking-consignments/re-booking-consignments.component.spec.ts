import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReBookingConsignmentsComponent } from './re-booking-consignments.component';

describe('ReBookingConsignmentsComponent', () => {
  let component: ReBookingConsignmentsComponent;
  let fixture: ComponentFixture<ReBookingConsignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReBookingConsignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReBookingConsignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
