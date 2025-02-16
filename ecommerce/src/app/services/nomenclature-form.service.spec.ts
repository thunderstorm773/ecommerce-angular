import { TestBed } from '@angular/core/testing';

import { NomenclatureFormService } from './nomenclature-form.service';

describe('NomenclatureFormService', () => {
  let service: NomenclatureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NomenclatureFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
