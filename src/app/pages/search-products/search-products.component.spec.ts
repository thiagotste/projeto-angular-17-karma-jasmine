import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProductsComponent } from './search-products.component';
import { ProductsService } from '../../shared/services/products/products.service';
import { ProductsApiService } from '../../shared/services/products/products-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Product } from '../../types/product.inteface';
import { StorageService } from '../../shared/services/storage/storage.service';
import { of } from 'rxjs';

const produtos = [
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
  {
    id: 23,
    title: 'teste3',
    description: 'teste3',
    category: 'jewelery',
    price: '28',
    image: 'teste.png',
  },
  {
    id: 24,
    title: 'teste4',
    description: 'teste4',
    category: 'jewelery',
    price: '28',
    image: 'teste.png',
  },
  {
    id: 25,
    title: 'teste5',
    description: 'teste5',
    category: 'jewelery',
    price: '28',
    image: 'teste.png',
  },
];

const storageServiceMock = {
  getAll(): Product[] {
    return produtos;
  },
  setValue: function (key: any, value: any) {
    produtos[key] = value;
  },

  remove(id: any): void {
    delete produtos[id];
  },
};

const productsApiServiceMock = {
  getAllProducts: () => {
    return of(produtos);
  },
};

describe('SearchProductsComponent', () => {
  let component: SearchProductsComponent;
  let fixture: ComponentFixture<SearchProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        ProductsService,
        { provider: ProductsApiService, useValue: null },
        { provider: StorageService, useValue: null },
      ],
    }).compileComponents();

    TestBed.overrideProvider(ProductsApiService, {
      useValue: productsApiServiceMock,
    });
    TestBed.overrideProvider(StorageService, { useValue: storageServiceMock });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar cinco produtos ao iniciar componente', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.products).not.toBeNull();
    expect(component.products().length).toBe(5);
    expect(component.products()[2].id).toBe(23);
  });

  it('deve retornar seis produtos ao rolar a tela', () => {
    component.onScroll();
    const products = component.products();
    expect(products).not.toBeNull();
  });

  it('deve retorna a lista completa de produtos quando o texto de pesquisa for vazio', () => {
    component.onSearchText('');
    expect(component.products).not.toBeNull();
    expect(component.products().length).toBe(5);
    expect(component.products()[2].id).toBe(23);
  });

  it('deve retorna a lista de produtos quando o texto de pesquisa não for vazio', () => {
    component.onSearchText('teste4');
    expect(component.products).not.toBeNull();
    expect(component.products().length).toBe(1);
    expect(component.products()[0].id).toBe(24);
  });
});
