import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductComponent } from './create-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { CreateProductService } from './services/create-product.service';
import { CreateProductApiService } from './services/create-product-api.service';
import { Product } from '../../../types/product.inteface';
import { BASE64_IMAGE } from '../../../shared/mocks/base64-image.mock';

class MockCreateProductApiService {
  getAllCategories(): Observable<string[]> {
    return of([
      'electronics',
      'jewelery',
      `men's clothing`,
      `women's clothing`,
    ]);
  }
}

const productMock: Product = {
  id: 1,
  title: 'Produto',
  description: 'Descrição',
  category: 'Categoria',
  price: ' ',
  image: BASE64_IMAGE,
};

const dialogRefMock = {
  close: jasmine.createSpy('close'),
};

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let createProductService: CreateProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        HttpClientTestingModule,
        CreateProductComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: productMock },
        CreateProductService,
        CreateProductApiService,
      ],
    }).compileComponents();

    TestBed.overrideComponent(CreateProductComponent, {
      set: {
        providers: [
          {
            provide: CreateProductApiService,
            useClass: MockCreateProductApiService,
          },
        ],
      },
    });

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    createProductService = TestBed.inject(CreateProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve rertornar a lista de categorias', (done: DoneFn) => {
    const categorias = [
      'electronics',
      'jewelery',
      `men's clothing`,
      `women's clothing`,
    ];
    component.categories$.subscribe((resultado) => {
      console.log(resultado);
      expect(categorias).toEqual(resultado);
      done();
    });
  });

  it('deve ter certeza que as informções estão no formulaŕio', () => {
    expect(component.formGroup.get('id')?.value).toEqual(productMock.id);
    expect(component.formGroup.get('title')?.value).toEqual(productMock.title);
    expect(component.formGroup.get('description')?.value).toEqual(
      productMock.description
    );
    expect(component.formGroup.get('category')?.value).toEqual(
      productMock.category
    );
    expect(component.formGroup.get('price')?.value).toEqual(productMock.price);
  });

  it('deve chamar o metodo onCancelClick ao clicar no botão fechar ', () => {
    component.onCancelClick();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('deve chamar o método save do createProductService ao enviar o formulário', () => {
    spyOn(createProductService, 'save').and.returnValue(Promise.resolve());
    const evento = {
      target: {
        files: [new File([''], 'imagem.jpeg', { type: 'image/jpeg' })],
      },
    };
    component.onImageSelected(evento);
    component.onSubmitForm();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(createProductService.save).toHaveBeenCalled();
    });
  });
});
