import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BinVolumeQueryComponent} from './bin-volume-query.component';

describe('BinVolumeQueryComponent', () => {
  let component: BinVolumeQueryComponent;
  let fixture: ComponentFixture<BinVolumeQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BinVolumeQueryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinVolumeQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
