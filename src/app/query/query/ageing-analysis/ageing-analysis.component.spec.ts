import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AgeingAnalysisComponent} from './ageing-analysis.component';

describe('AgeingAnalysisComponent', () => {
  let component: AgeingAnalysisComponent;
  let fixture: ComponentFixture<AgeingAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgeingAnalysisComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeingAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
