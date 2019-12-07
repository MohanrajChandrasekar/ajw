import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjwCityListComponent } from './ajw-city-list.component';

describe('AjwCityListComponent', () => {
  let component: AjwCityListComponent;
  let fixture: ComponentFixture<AjwCityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjwCityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjwCityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
