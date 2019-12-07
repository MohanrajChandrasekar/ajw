import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRoutedComponent } from './mis-routed.component';

describe('MisRoutedComponent', () => {
  let component: MisRoutedComponent;
  let fixture: ComponentFixture<MisRoutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisRoutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisRoutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
