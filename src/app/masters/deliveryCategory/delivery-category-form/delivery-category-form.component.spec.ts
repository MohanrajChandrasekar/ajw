import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryCategoryFormComponent } from './delivery-category-form.component';

describe('DeliveryCategoryFormComponent', () => {
  let component: DeliveryCategoryFormComponent;
  let fixture: ComponentFixture<DeliveryCategoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryCategoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
