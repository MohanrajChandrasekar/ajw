import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeRateMasterListComponent } from './pincode-rate-master-list.component';

describe('PincodeRateMasterListComponent', () => {
  let component: PincodeRateMasterListComponent;
  let fixture: ComponentFixture<PincodeRateMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PincodeRateMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeRateMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
