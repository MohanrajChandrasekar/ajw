import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMasterFormComponent } from './agent-master-form.component';

describe('AgentMasterFormComponent', () => {
  let component: AgentMasterFormComponent;
  let fixture: ComponentFixture<AgentMasterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentMasterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
