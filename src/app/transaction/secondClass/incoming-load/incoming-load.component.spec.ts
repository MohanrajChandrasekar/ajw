import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingLoadComponent } from './incoming-load.component';

describe('IncomingLoadComponent', () => {
  let component: IncomingLoadComponent;
  let fixture: ComponentFixture<IncomingLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
