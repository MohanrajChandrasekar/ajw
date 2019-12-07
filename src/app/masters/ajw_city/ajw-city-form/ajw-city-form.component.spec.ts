import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjwCityFormComponent } from './ajw-city-form.component';

describe('AjwCityFormComponent', () => {
  let component: AjwCityFormComponent;
  let fixture: ComponentFixture<AjwCityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjwCityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjwCityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
