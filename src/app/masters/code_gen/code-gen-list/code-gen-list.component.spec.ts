import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeGenListComponent } from './code-gen-list.component';

describe('CodeGenListComponent', () => {
  let component: CodeGenListComponent;
  let fixture: ComponentFixture<CodeGenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeGenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeGenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
