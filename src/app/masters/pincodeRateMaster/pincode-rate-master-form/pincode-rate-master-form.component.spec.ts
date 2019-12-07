import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeRateMasterFormComponent } from './pincode-rate-master-form.component';

describe('PincodeRateMasterFormComponent', () => {
  let component: PincodeRateMasterFormComponent;
  let fixture: ComponentFixture<PincodeRateMasterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PincodeRateMasterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeRateMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
