import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { ProductsApiService } from './products-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { Product } from '../../../types/product.inteface';
import { StorageService } from '../storage/storage.service';
import { signal } from '@angular/core';

class ProductsApiServiceMock {
  getAllProducts(): Observable<Product[]> {
    return of([
      {
        id: 23,
        title: 'teste23',
        description: 'teste',
        category: 'jewelery',
        price: '23',
        image: 'teste.png',
      },
      {
        id: 24,
        title: 'teste24',
        description: 'teste2',
        category: 'jewelery',
        price: '28',
        image: 'teste.png',
      },
    ]);
  }
}

const produtosMock = [
  {
    id: 21,
    title: 'teste',
    description: 'teste',
    category: 'jewelery',
    price: '23',
    image: 'teste.png',
  },
  {
    id: 22,
    title: 'teste2',
    description: 'teste2',
    category: 'jewelery',
    price: '28',
    image: 'teste.png',
  },
];

class StorageServiceMock {
  private data: { [key: string]: any } = {};

  getAll(): any[] {
    return Object.values(this.data);
  }

  setValue(key: string, value: any): void {
    this.data[key] = value;
  }

  remove(key: string): void {
    delete this.data[key];
  }
}

describe('ProductsService', () => {
  let service: ProductsService;
  let storageServiceMock = new StorageServiceMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        { provide: ProductsApiService, useClass: ProductsApiServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
      ],
    });

    storageServiceMock.setValue('products', produtosMock);
    TestBed.overrideProvider(StorageService, { useValue: storageServiceMock });

    service = TestBed.inject(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve inicializar os produtos do storage', () => {
    const produtos = service.products().flat();

    expect(produtos[0].id).toEqual(produtosMock[0].id);
    expect(produtos[1].id).toEqual(produtosMock[1].id);
  });

  it('deve filtrar produtos pelo título', () => {
    service.products = signal<Array<Product>>(produtosMock);
    service.find('2');

    const produtos = service.products().flat();

    expect(produtos.length).toBe(1);
    expect(produtos[0].title).toBe('teste2');
  });

  it('deve retornar todod os produtos criados', () => {
    const produto = [
      {
        id: 21,
        title: 'teste',
        description: 'teste',
        category: 'jewelery',
        price: '23',
        image: 'teste.png',
      },
    ];
    storageServiceMock.setValue('products', produto);

    const produtos = service.fetchAllProductsCreated()().flat();
    expect(produtos).toEqual(produto);
  });

  it('deve retornar todos os produtos da api e do storage', () => {
    service.fetchAllProducts(6);

    expect(service.products().flat().length).toBe(4);
  });

  it('deve deletar um produto do storage', () => {
    const spy = spyOn(storageServiceMock, 'remove');
    const initialSize = storageServiceMock.getAll().length;

    service.delete(produtosMock[0]);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(storageServiceMock.getAll().length).toBeLessThanOrEqual(initialSize);
  });
});
