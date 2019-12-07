import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeGenFormComponent } from './code-gen-form.component';

describe('CodeGenFormComponent', () => {
  let component: CodeGenFormComponent;
  let fixture: ComponentFixture<CodeGenFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeGenFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeGenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
