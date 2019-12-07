import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffReportComponent } from './tariff-report.component';

describe('TariffReportComponent', () => {
  let component: TariffReportComponent;
  let fixture: ComponentFixture<TariffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TariffReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
