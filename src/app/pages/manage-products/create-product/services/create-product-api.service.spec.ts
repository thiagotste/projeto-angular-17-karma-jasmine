import { TestBed } from '@angular/core/testing';
import { CreateProductApiService } from './create-product-api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../types/product.inteface';

fdescribe('CreateProductApiService', () => {
  let service: CreateProductApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreateProductApiService],
    });

    service = TestBed.inject(CreateProductApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar todas as categorias da api', (done: DoneFn) => {
    const categoriesMock = ['eletrônicos', 'roupas masculinas', 'joias'];
    service.getAllCategories().subscribe((categories) => {
      expect(categories).toEqual(categoriesMock);
      done();
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/products/categories`
    );
    expect(req.request.method).toBe('GET');
    req.flush(categoriesMock);
    httpTestingController.verify();
  });

  it('deve retornar o número de produtos', (done: DoneFn) => {
    const categoriesMock: Product[] = [
      {
        id: 1,
        title: 'Produto',
        description: 'Descrição',
        category: 'Categoria',
        price: ' ',
        image: 'teste.png',
      },
      {
        id: 2,
        title: 'Produto2',
        description: 'Descrição2',
        category: 'Categoria',
        price: ' ',
        image: 'teste.png',
      },
    ];
    service.getCountProduct().subscribe((contidade) => {
      expect(contidade).toEqual(2);
      done();
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/products?limit=200`
    );
    expect(req.request.method).toBe('GET');
    req.flush(categoriesMock);
    httpTestingController.verify();
  });
});
