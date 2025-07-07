import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductsComponent } from './manage-products.component';
import { ProductsService } from '../../shared/services/products/products.service';
import { ProductsApiService } from '../../shared/services/products/products-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Product } from '../../types/product.inteface';
import { StorageService } from '../../shared/services/storage/storage.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

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
];
let data = produtos;

const StorageServiceMock = {
  getAll(): Product[] {
    return data;
  },
  setValue: function (key: any, value: any) {
    data[key] = value;
  },

  remove(id: any): void {
    delete data[id];
  },
};

describe('ManageProductsComponent', () => {
  let component: ManageProductsComponent;
  let fixture: ComponentFixture<ManageProductsComponent>;
  let productsService: ProductsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BannerComponent,
        SearchComponent,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      declarations: [ManageProductsComponent],
      providers: [
        MatDialog,
        ProductsService,
        ProductsApiService,
        { provide: StorageService, useValue: StorageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageProductsComponent);
    component = fixture.componentInstance;

    productsService = TestBed.inject(ProductsService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve abrir o dialogo de criação de produto quando chamar o metodo onSubscribeProduct', () => {
    component.onSubscribeProduct();
    spyOn(component.dialogRef, 'afterClosed').and.returnValue(of({}));
    component.dialogRef.close();
    expect(component.products).not.toBeNull();
  });

  it('deve deletar produto quando o metodo onDelete for chamado', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const spy = spyOn(component.products, 'update');
    component.onDelete(produtos[1]);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve atualizar a lista de produtos ao chamar onSearchText', () => {
    const searchText = 'teste';
    component.onSearchText(searchText);

    expect(component.products()).not.toBeNull();
    expect(component.products()[0].title).toEqual('teste');
  });

  it('deve retornar a lista completa de produtos quando o texto de pesquisa for vazio ao chamar onSearchText', () => {
    const searchText = 'teste';
    component.onSearchText(searchText);

    expect(component.products()).not.toBeNull();
    expect(component.products().length).toEqual(2);
    expect(component.products()[0].title).toEqual('teste');
  });

  it('deve retornar a lista completa de produtos quando chamar o método onEdit', (done: DoneFn) => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.onEdit(produtos[0]);
    component.dialogRef.close();
    component.dialogRef?.afterClosed().subscribe(() => {
      expect(component.products()).toBe(produtos);
      done();
    });
  });
});
