import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryBreakupComponent } from './delivery-breakup.component';

describe('DeliveryBreakupComponent', () => {
  let component: DeliveryBreakupComponent;
  let fixture: ComponentFixture<DeliveryBreakupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryBreakupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
