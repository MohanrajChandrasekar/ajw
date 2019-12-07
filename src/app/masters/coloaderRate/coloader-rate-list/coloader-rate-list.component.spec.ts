import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoaderRateListComponent } from './coloader-rate-list.component';

describe('ColoaderRateListComponent', () => {
  let component: ColoaderRateListComponent;
  let fixture: ComponentFixture<ColoaderRateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColoaderRateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoaderRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
