import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningClosingReportComponent } from './opening-closing-report.component';

describe('OpeningClosingReportComponent', () => {
  let component: OpeningClosingReportComponent;
  let fixture: ComponentFixture<OpeningClosingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningClosingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningClosingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
