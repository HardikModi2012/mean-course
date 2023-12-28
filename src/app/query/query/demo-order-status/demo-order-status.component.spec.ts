import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DemoOrderStatusComponent} from './demo-order-status.component';

describe('DemoOrderStatusComponent', () => {
  let component: DemoOrderStatusComponent;
  let fixture: ComponentFixture<DemoOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoOrderStatusComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
