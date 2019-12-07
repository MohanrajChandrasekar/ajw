import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoaderRateFormComponent } from './coloader-rate-form.component';

describe('ColoaderRateFormComponent', () => {
  let component: ColoaderRateFormComponent;
  let fixture: ComponentFixture<ColoaderRateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColoaderRateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoaderRateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
