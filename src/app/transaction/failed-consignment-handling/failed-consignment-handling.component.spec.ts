import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedConsignmentHandlingComponent } from './failed-consignment-handling.component';

describe('FailedConsignmentHandlingComponent', () => {
  let component: FailedConsignmentHandlingComponent;
  let fixture: ComponentFixture<FailedConsignmentHandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailedConsignmentHandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedConsignmentHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
