import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedBookingComponent } from './detailed-booking.component';

describe('DetailedBookingComponent', () => {
  let component: DetailedBookingComponent;
  let fixture: ComponentFixture<DetailedBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
