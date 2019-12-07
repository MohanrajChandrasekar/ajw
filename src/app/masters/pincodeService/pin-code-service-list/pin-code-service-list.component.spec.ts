import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinCodeServiceListComponent } from './pin-code-service-list.component';

describe('PinCodeServiceListComponent', () => {
  let component: PinCodeServiceListComponent;
  let fixture: ComponentFixture<PinCodeServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinCodeServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinCodeServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
