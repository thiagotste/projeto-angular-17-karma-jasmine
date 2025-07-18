import { TestBed } from '@angular/core/testing';

import { StorageObject, StorageService } from './storage.service';
import { Product } from '../../../types/product.inteface';

const dataMock: StorageObject<Product> = {
  key: 'product',
  value: {
    id: 2,
    title: 'Produto2',
    description: 'Descrição2',
    category: 'Categoria',
    price: '20',
    image: 'teste.png',
  },
};

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve salvar os dados no sessionStorage', () => {
    const spy = spyOn(sessionStorage, 'setItem');
    const id = 'teste';

    service.save(id, dataMock);

    expect(spy).toHaveBeenCalledWith(id, JSON.stringify(dataMock.value));
  });

  it('deve recuperar do sessionStorage a informação armazenada quando a session tiver o id', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(
      JSON.stringify(dataMock.value)
    );
    expect(service.get('teste')).not.toBeNull();
  });

  it('deve retornar null quando não existir id na session', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    expect(service.get('teste')).toBeNull();
  });

  it('deve recuperar todas as informações do sessionStorage', () => {
    const data1 = { id: 1, name: 'Test 1' };
    const data2 = { id: 2, name: 'Test 2' };
    sessionStorage.setItem('1', JSON.stringify(data1));
    sessionStorage.setItem('2', JSON.stringify(data2));

    const storedData = service.getAll();
    expect(storedData).toEqual([
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' },
    ]);
  });

  it('deve retornar o último item armazenado na sessionStorage', () => {
      sessionStorage.clear();

      const data1 = { id: 1, name: 'Test 1' };
      const data2 = { id: 2, name: 'Test 2' };
      sessionStorage.setItem('1', JSON.stringify(data1));
      sessionStorage.setItem('2', JSON.stringify(data2));

      const lastItem = service.getLastItem();
      expect(lastItem).toEqual({ key: '2', value: { id: 2, name: 'Test 2' } });
    });

    it('deve retornar null se a sessionStorage estiver vazia', () => {
      sessionStorage.clear();

      const lastItem = service.getLastItem();
      expect(lastItem).toBeNull();
    });

    it('deve remover os dados da sessionStorage', () => {
      const key = 'testKey';
      const value = { name: 'test' };
      sessionStorage.setItem(key, JSON.stringify(value));
      service.remove(key);
      const storedValue = sessionStorage.getItem(key);

      expect(storedValue).toBeNull();
    });
});
