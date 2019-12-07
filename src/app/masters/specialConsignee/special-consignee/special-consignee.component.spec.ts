import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialConsigneeComponent } from './special-consignee.component';

describe('SpecialConsigneeComponent', () => {
  let component: SpecialConsigneeComponent;
  let fixture: ComponentFixture<SpecialConsigneeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialConsigneeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialConsigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
