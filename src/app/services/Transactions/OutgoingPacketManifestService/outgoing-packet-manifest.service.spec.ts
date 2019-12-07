import { TestBed, inject } from '@angular/core/testing';

import { OutgoingPacketManifestService } from './outgoing-packet-manifest.service';

describe('OutgoingPacketManifestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OutgoingPacketManifestService]
    });
  });

  it('should be created', inject([OutgoingPacketManifestService], (service: OutgoingPacketManifestService) => {
    expect(service).toBeTruthy();
  }));
});
