import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutPackedManifestReportComponent } from './out-packed-manifest-report.component';

describe('OutPackedManifestReportComponent', () => {
  let component: OutPackedManifestReportComponent;
  let fixture: ComponentFixture<OutPackedManifestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutPackedManifestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutPackedManifestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
