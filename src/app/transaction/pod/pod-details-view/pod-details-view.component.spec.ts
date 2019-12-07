import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodDetailsViewComponent } from './pod-details-view.component';

describe('PodDetailsViewComponent', () => {
  let component: PodDetailsViewComponent;
  let fixture: ComponentFixture<PodDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
