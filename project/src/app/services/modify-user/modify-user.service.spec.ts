import { TestBed } from '@angular/core/testing';

import { ModifyUserService } from './modify-user.service';
import {provideHttpClient} from "@angular/common/http";

describe('ModifyUserService', () => {
  let service: ModifyUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ModifyUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
