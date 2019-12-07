import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagazineFormComponent } from './magazine-form.component';

describe('MagazineFormComponent', () => {
  let component: MagazineFormComponent;
  let fixture: ComponentFixture<MagazineFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagazineFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagazineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
