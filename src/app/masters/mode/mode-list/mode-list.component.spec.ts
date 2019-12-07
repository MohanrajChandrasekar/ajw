import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeListComponent } from './mode-list.component';

describe('ModeListComponent', () => {
  let component: ModeListComponent;
  let fixture: ComponentFixture<ModeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
