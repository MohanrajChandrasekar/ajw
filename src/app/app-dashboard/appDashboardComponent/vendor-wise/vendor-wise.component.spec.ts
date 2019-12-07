import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorWiseComponent } from './vendor-wise.component';

describe('VendorWiseComponent', () => {
  let component: VendorWiseComponent;
  let fixture: ComponentFixture<VendorWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
