import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxDetailDialogComponent } from './box-detail-dialog.component';

describe('BoxDetailDialogComponent', () => {
  let component: BoxDetailDialogComponent;
  let fixture: ComponentFixture<BoxDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
