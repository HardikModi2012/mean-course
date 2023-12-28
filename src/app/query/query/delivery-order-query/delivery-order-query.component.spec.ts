import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeliveryOrderQueryComponent} from './delivery-order-query.component';

describe('DeliveryOrderQueryComponent', () => {
  let component: DeliveryOrderQueryComponent;
  let fixture: ComponentFixture<DeliveryOrderQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryOrderQueryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryOrderQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
