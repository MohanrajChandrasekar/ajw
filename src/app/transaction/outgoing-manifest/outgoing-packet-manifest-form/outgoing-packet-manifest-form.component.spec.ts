import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingPacketManifestFormComponent } from './outgoing-packet-manifest-form.component';

describe('OutgoingPacketManifestFormComponent', () => {
  let component: OutgoingPacketManifestFormComponent;
  let fixture: ComponentFixture<OutgoingPacketManifestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingPacketManifestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingPacketManifestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
