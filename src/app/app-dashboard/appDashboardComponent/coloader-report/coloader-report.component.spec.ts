import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoaderReportComponent } from './coloader-report.component';

describe('ColoaderReportComponent', () => {
  let component: ColoaderReportComponent;
  let fixture: ComponentFixture<ColoaderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColoaderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoaderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
