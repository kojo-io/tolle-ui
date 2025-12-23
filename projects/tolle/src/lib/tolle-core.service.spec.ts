import { TestBed } from '@angular/core/testing';

import { TolleCoreService } from './tolle-core.service';

describe('TolleCoreService', () => {
  let service: TolleCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TolleCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
