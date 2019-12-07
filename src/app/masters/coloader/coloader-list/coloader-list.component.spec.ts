import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoaderListComponent } from './coloader-list.component';

describe('ColoaderListComponent', () => {
  let component: ColoaderListComponent;
  let fixture: ComponentFixture<ColoaderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColoaderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoaderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
