import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGroupGuard } from './auth-group.guard';

describe('authGroupGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGroupGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
