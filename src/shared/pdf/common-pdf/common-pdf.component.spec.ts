/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommonPdfComponent } from './common-pdf.component';

describe('CommonPdfComponent', () => {
  let component: CommonPdfComponent;
  let fixture: ComponentFixture<CommonPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
