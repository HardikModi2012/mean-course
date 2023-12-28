import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StockQueryComponent} from './stock-query.component';

describe('StockQueryComponent', () => {
  let component: StockQueryComponent;
  let fixture: ComponentFixture<StockQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockQueryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
