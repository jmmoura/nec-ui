import { TestBed } from '@angular/core/testing';

import { LinkGeneratorService } from './link-generator.service';

describe('LinkGeneratorService', () => {
  let service: LinkGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
