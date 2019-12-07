import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingBulkComponent } from './tracking-bulk.component';

describe('TrackingBulkComponent', () => {
  let component: TrackingBulkComponent;
  let fixture: ComponentFixture<TrackingBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
