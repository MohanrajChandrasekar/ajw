import { TestBed, inject } from '@angular/core/testing';

import { AgentDeliveryService } from './agent-delivery.service';

describe('AgentDeliveryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgentDeliveryService]
    });
  });

  it('should be created', inject([AgentDeliveryService], (service: AgentDeliveryService) => {
    expect(service).toBeTruthy();
  }));
});
