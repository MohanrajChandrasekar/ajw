import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingPacketManifestListComponent } from './outgoing-packet-manifest-list.component';

describe('OutgoingPacketManifestListComponent', () => {
  let component: OutgoingPacketManifestListComponent;
  let fixture: ComponentFixture<OutgoingPacketManifestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingPacketManifestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingPacketManifestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
