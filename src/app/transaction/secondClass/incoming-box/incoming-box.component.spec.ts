import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingBoxComponent } from './incoming-box.component';

describe('IncomingBoxComponent', () => {
  let component: IncomingBoxComponent;
  let fixture: ComponentFixture<IncomingBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
