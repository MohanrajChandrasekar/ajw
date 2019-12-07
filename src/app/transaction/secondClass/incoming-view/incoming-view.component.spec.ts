import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingViewComponent } from './incoming-view.component';

describe('IncomingViewComponent', () => {
  let component: IncomingViewComponent;
  let fixture: ComponentFixture<IncomingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
