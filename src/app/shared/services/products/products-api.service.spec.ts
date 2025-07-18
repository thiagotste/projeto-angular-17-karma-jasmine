import { TestBed } from '@angular/core/testing';

import { ProductsApiService } from './products-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductsApiService', () => {
  let service: ProductsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsApiService]
    });
    service = TestBed.inject(ProductsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
