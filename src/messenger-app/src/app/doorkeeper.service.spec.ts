import { TestBed } from '@angular/core/testing';

import { DoorkeeperService } from './doorkeeper.service';

describe('DoorkeeperService', () => {
  let service: DoorkeeperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoorkeeperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
