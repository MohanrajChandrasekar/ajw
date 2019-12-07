import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeCardDetailsComponent } from './office-card-details.component';

describe('OfficeCardDetailsComponent', () => {
  let component: OfficeCardDetailsComponent;
  let fixture: ComponentFixture<OfficeCardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeCardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
