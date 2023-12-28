import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RfidStockQueryComponent} from './rfid-stock-query.component';

describe('RfidStockQueryComponent', () => {
  let component: RfidStockQueryComponent;
  let fixture: ComponentFixture<RfidStockQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RfidStockQueryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfidStockQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
