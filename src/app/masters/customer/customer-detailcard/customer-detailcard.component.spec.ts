import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailcardComponent } from './customer-detailcard.component';

describe('CustomerDetailcardComponent', () => {
  let component: CustomerDetailcardComponent;
  let fixture: ComponentFixture<CustomerDetailcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
