import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinCodeServiceFormComponent } from './pin-code-service-form.component';

describe('PinCodeServiceFormComponent', () => {
  let component: PinCodeServiceFormComponent;
  let fixture: ComponentFixture<PinCodeServiceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinCodeServiceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinCodeServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
