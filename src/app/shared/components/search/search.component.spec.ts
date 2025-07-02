import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar o metodo onInputChange quando o valor do input mudar', () => {
    // const value = 'teste';
    // const event = { target: { value } } as unknown as Event;
    // const spy = spyOn(component.searchText, 'emit');

    // component.onInputChange(event);

    // expect(spy).toHaveBeenCalledWith(value);

    const spy = spyOn(component.searchText, 'emit');
    const inputEvent = new InputEvent('input');
    const input: HTMLElement = fixture.nativeElement.querySelector('input');

    input.setAttribute('value', 'teste');
    input.dispatchEvent(inputEvent);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('teste');
  });
});
