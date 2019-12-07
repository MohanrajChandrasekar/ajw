import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplCustDetailBookingComponent } from './spl-cust-detail-booking.component';

describe('SplCustDetailBookingComponent', () => {
  let component: SplCustDetailBookingComponent;
  let fixture: ComponentFixture<SplCustDetailBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplCustDetailBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplCustDetailBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
