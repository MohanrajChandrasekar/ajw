import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplCustFormComponent } from './spl-cust-form.component';

describe('SplCustFormComponent', () => {
  let component: SplCustFormComponent;
  let fixture: ComponentFixture<SplCustFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplCustFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplCustFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
