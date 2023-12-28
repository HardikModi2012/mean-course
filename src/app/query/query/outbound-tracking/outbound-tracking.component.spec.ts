import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OutboundTrackingComponent} from './outbound-tracking.component';

describe('OutboundTrackingComponent', () => {
  let component: OutboundTrackingComponent;
  let fixture: ComponentFixture<OutboundTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutboundTrackingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
