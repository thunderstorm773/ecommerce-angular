import { TestBed } from '@angular/core/testing';

import { SystemParameterService } from './system-parameter.service';

describe('SystemParameterService', () => {
  let service: SystemParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
