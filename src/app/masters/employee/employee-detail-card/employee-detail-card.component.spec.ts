import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailCardComponent } from './employee-detail-card.component';

describe('EmployeeDetailCardComponent', () => {
  let component: EmployeeDetailCardComponent;
  let fixture: ComponentFixture<EmployeeDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
