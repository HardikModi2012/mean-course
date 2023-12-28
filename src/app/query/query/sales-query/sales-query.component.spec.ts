import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SalesQueryComponent} from './sales-query.component';

describe('SalesQueryComponent', () => {
  let component: SalesQueryComponent;
  let fixture: ComponentFixture<SalesQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesQueryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
