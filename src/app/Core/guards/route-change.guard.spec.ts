import {TestBed} from '@angular/core/testing';

import {RouteChangeGuard} from './route-change.guard';

describe('RouteChangeGuard', () => {
  let guard: RouteChangeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RouteChangeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
