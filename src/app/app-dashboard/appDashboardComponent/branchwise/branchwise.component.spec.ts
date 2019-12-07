import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchwiseComponent } from './branchwise.component';

describe('BranchwiseComponent', () => {
  let component: BranchwiseComponent;
  let fixture: ComponentFixture<BranchwiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchwiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
