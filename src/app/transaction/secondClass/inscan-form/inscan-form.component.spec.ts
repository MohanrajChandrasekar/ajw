import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscanFormComponent } from './inscan-form.component';

describe('InscanFormComponent', () => {
  let component: InscanFormComponent;
  let fixture: ComponentFixture<InscanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
