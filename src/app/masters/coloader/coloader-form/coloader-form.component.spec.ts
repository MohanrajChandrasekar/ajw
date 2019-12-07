import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoaderFormComponent } from './coloader-form.component';

describe('ColoaderFormComponent', () => {
  let component: ColoaderFormComponent;
  let fixture: ComponentFixture<ColoaderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColoaderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoaderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
