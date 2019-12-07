import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMasterListComponent } from './agent-master-list.component';

describe('AgentMasterListComponent', () => {
  let component: AgentMasterListComponent;
  let fixture: ComponentFixture<AgentMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
