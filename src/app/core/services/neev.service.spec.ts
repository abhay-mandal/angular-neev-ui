import { TestBed } from '@angular/core/testing';

import { NeevService } from './neev.service';

describe('NeevService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeevService = TestBed.get(NeevService);
    expect(service).toBeTruthy();
  });
});
