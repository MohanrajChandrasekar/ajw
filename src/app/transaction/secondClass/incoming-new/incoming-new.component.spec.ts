import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingNewComponent } from './incoming-new.component';

describe('IncomingNewComponent', () => {
  let component: IncomingNewComponent;
  let fixture: ComponentFixture<IncomingNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
