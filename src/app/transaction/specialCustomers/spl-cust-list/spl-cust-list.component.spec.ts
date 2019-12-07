import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplCustListComponent } from './spl-cust-list.component';

describe('SplCustListComponent', () => {
  let component: SplCustListComponent;
  let fixture: ComponentFixture<SplCustListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplCustListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplCustListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
