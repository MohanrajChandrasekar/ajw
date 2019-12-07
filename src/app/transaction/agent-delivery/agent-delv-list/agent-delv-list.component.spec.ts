import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDelvListComponent } from './agent-delv-list.component';

describe('AgentDelvListComponent', () => {
  let component: AgentDelvListComponent;
  let fixture: ComponentFixture<AgentDelvListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentDelvListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDelvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
