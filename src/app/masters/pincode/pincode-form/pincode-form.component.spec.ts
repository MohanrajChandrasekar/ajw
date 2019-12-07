import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeFormComponent } from './pincode-form.component';

describe('PincodeFormComponent', () => {
  let component: PincodeFormComponent;
  let fixture: ComponentFixture<PincodeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PincodeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
