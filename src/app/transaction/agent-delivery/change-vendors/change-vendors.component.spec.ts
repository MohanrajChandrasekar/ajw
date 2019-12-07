import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeVendorsComponent } from './change-vendors.component';

describe('ChangeVendorsComponent', () => {
  let component: ChangeVendorsComponent;
  let fixture: ComponentFixture<ChangeVendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeVendorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
