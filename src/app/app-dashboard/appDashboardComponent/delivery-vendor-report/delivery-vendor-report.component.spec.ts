import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryVendorReportComponent } from './delivery-vendor-report.component';

describe('DeliveryVendorReportComponent', () => {
  let component: DeliveryVendorReportComponent;
  let fixture: ComponentFixture<DeliveryVendorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryVendorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryVendorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
