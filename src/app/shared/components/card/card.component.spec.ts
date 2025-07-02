import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { Product } from '../../../types/product.inteface';
import { By } from '@angular/platform-browser';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve redenrizar o produto no template', () => {
    const produto: Product = {
      id: 1,
      title: 'OnePlus',
      price: '600',
      category: 'eletrônico',
      description: 'Smartphone',
      image: '/src/assets/image.img'
    };

    component.product = produto;

    fixture.detectChanges();

    const productImg: HTMLImageElement = fixture.debugElement.query(By.css('img')).nativeElement;
    const productTitle: HTMLElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    const productDescription = fixture.debugElement.query(By.css('p')).nativeElement;
    const productPrice = fixture.debugElement.query(By.css('h3')).nativeElement;

    expect(productImg.src).toContain(produto.image);
    expect(productTitle.textContent).toContain(produto.title);
    expect(productPrice.textContent).toContain(produto.price);
    expect(productDescription.textContent).toContain(produto.description);
  });

  it('deve emitir o evento onDelete quando clicar no delete', () => {
    const produto: Product = {
      id: 1,
      title: 'OnePlus',
      price: '600',
      category: 'eletrônico',
      description: 'Smartphone',
      image: '/src/assets/image.img'
    };

    const spy = spyOn(component.onDelete, 'emit');

    component.product = produto;
    component.isManagable = true;

    fixture.detectChanges();

    const managableElement: HTMLElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(managableElement).not.toBeNull();

    component.onDeleteClick();

    expect(spy).toHaveBeenCalledWith(produto)
  });

  it('deve emitir o evento onEdit quando clicar no edit', () => {
    const produto: Product = {
      id: 1,
      title: 'OnePlus',
      price: '600',
      category: 'eletrônico',
      description: 'Smartphone',
      image: '/src/assets/image.img'
    };

    const spy = spyOn(component.onEdit, 'emit');

    component.product = produto;
    component.isManagable = true;

    fixture.detectChanges();

    const managableElement: HTMLElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(managableElement).not.toBeNull();

    component.onEditClick();

    expect(spy).toHaveBeenCalledWith(produto)
  });
});
