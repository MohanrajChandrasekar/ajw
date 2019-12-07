import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDeliveryComponent } from './agent-delivery.component';

describe('AgentDeliveryComponent', () => {
  let component: AgentDeliveryComponent;
  let fixture: ComponentFixture<AgentDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
