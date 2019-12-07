import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisroutedReportComponent } from './misrouted-report.component';

describe('MisroutedReportComponent', () => {
  let component: MisroutedReportComponent;
  let fixture: ComponentFixture<MisroutedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisroutedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisroutedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
