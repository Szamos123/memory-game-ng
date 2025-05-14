import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let userService: UserService;

  beforeEach(() => {
    const userServiceMock = {
      user: () => ({
        id: '1',
        email: 'mockEmail1',
        gold: 0,
        ownedCardImages: [],
      }),
      updateUserGold: jasmine
        .createSpy('updateUserGold')
        .and.returnValue(of({})), // Return an observable
      updateOwnedItems: jasmine
        .createSpy('updateOwnedItems')
        .and.returnValue(of({})),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ShopComponent],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compileComponents();

    userService = TestBed.inject(UserService);
    component = TestBed.createComponent(ShopComponent).componentInstance;
  });

  it('should fetch shop items on init', () => {
    component.shopItems = [
      { id: '1', name: 'Item 1', price: 50, imageUrl: 'mockUrl' },
    ];

    expect(component.shopItems.length).toBeGreaterThan(0);
  });

  it('should purchase item if user has enough gold', () => {
    const mockUser = {
      id: '1',
      email: 'mockEmail1',
      gold: 100,
      ownedCardImages: [],
    };

    spyOn(userService, 'user').and.returnValue(mockUser);

    const mockItem = {
      id: '2',
      name: 'Pink Diamond',
      price: 100,
      imageUrl: '',
    };

    component.purchaseItem(mockItem);

    expect(userService.updateUserGold).toHaveBeenCalledWith(-100);
    expect(userService.updateOwnedItems).toHaveBeenCalledWith('2');
  });

  it('should not purchase item if user does not have enough gold', () => {
    component.user = {
      id: '1',
      email: 'mockEmail1',
      gold: 0,
      ownedCardImages: [],
    };
    const mockItem = {
      id: '2',
      name: 'Pink Diamond',
      price: 100,
      imageUrl: '',
    };

    spyOn(window, 'alert');
    component.purchaseItem(mockItem);

    expect(window.alert).toHaveBeenCalledWith(
      '❌ You do not have enough gold!'
    );
  });

  it('should check if item is owned', () => {
    const mockUser = {
      id: '1',
      email: 'mockEmail1',
      gold: 100,
      ownedCardImages: ['1'],
    };

    spyOn(userService, 'user').and.returnValue(mockUser);

    expect(component.isItemOwned('1')).toBeTrue();

    expect(component.isItemOwned('3')).toBeFalse();
  });
});
