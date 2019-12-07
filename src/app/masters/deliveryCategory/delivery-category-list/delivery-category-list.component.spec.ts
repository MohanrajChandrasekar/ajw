import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryCategoryListComponent } from './delivery-category-list.component';

describe('DeliveryCategoryListComponent', () => {
  let component: DeliveryCategoryListComponent;
  let fixture: ComponentFixture<DeliveryCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
