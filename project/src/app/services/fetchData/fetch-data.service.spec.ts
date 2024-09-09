import { TestBed } from '@angular/core/testing';

import { FetchDataService } from './fetch-data.service';
import {provideHttpClient} from "@angular/common/http";

describe('FetchDataService', () => {
  let service: FetchDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(FetchDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
