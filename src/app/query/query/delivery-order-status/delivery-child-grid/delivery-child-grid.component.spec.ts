import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DeliveryChildGridComponent} from './delivery-child-grid.component';

describe('ChildComponentComponent', () => {
  let component: DeliveryChildGridComponent;
  let fixture: ComponentFixture<DeliveryChildGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryChildGridComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryChildGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
