import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanningManifestsComponent } from './scanning-manifests.component';

describe('ScanningManifestsComponent', () => {
  let component: ScanningManifestsComponent;
  let fixture: ComponentFixture<ScanningManifestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanningManifestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanningManifestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
