import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeliveryOrderStatusComponent} from './delivery-order-status.component';

describe('DeliveryOrderStatusComponent', () => {
  let component: DeliveryOrderStatusComponent;
  let fixture: ComponentFixture<DeliveryOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryOrderStatusComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
