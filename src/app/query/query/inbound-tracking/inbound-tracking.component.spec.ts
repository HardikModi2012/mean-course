import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InboundTrackingComponent} from './inbound-tracking.component';

describe('InboundTrackingComponent', () => {
  let component: InboundTrackingComponent;
  let fixture: ComponentFixture<InboundTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InboundTrackingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
