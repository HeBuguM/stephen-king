import { TestBed } from '@angular/core/testing';

import { IMDbService } from './imdb.service';

describe('IMDbService', () => {
  let service: IMDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IMDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
