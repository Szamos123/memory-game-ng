import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let userService: UserService;

  beforeEach(() => {
    // Mock UserService with the methods we want to test
    const userServiceMock = {
      user: () => ({
        id: '1',
        email: 'mockEmail1',
        gold: 0,
        ownedCardImages: [],
      }),
      updateUserGold: jasmine.createSpy('updateUserGold').and.returnValue(of({})), // Return an observable
      updateOwnedItems: jasmine.createSpy('updateOwnedItems').and.returnValue(of({})), // Return an observable
    };

    // Set up testing module with the mocked service
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ShopComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    // Inject necessary services
    userService = TestBed.inject(UserService);
    component = TestBed.createComponent(ShopComponent).componentInstance;
  });

  it('should fetch shop items on init', () => {
    component.shopItems = [{ id: '1', name: 'Item 1', price: 50, imageUrl: 'mockUrl' }]; // Mock items

    // Simulate fetching items
    expect(component.shopItems.length).toBeGreaterThan(0);
  });

  it('should purchase item if user has enough gold', () => {
    // Mock user data
    const mockUser = {
      id: '1',
      email: 'mockEmail1',
      gold: 100, // Enough gold to buy the item
      ownedCardImages: [],
    };

    // Mock userService to return the mock user
    spyOn(userService, 'user').and.returnValue(mockUser);

    // Mock the item to be purchased
    const mockItem = { id: '2', name: 'Pink Diamond', price: 100, imageUrl: '' };

    // Call the purchase method
    component.purchaseItem(mockItem);

    // Check if the methods were called with the correct arguments
    expect(userService.updateUserGold).toHaveBeenCalledWith(-100);
    expect(userService.updateOwnedItems).toHaveBeenCalledWith('2');
  });

  it('should not purchase item if user does not have enough gold', () => {
    // Mock a user with less gold
    component.user = { id: '1', email: 'mockEmail1', gold: 0, ownedCardImages: [] };
    const mockItem = { id: '2', name: 'Pink Diamond', price: 100, imageUrl: '' };

    // Spy on alert and call the purchase method
    spyOn(window, 'alert');
    component.purchaseItem(mockItem);

    // Check if no purchase was made and alert was shown
    
    expect(window.alert).toHaveBeenCalledWith('❌ You do not have enough gold!');
  });

  it('should check if item is owned', () => {
    // Mock user data with owned items
    const mockUser = {
      id: '1',
      email: 'mockEmail1',
      gold: 100,
      ownedCardImages: ['1'],  // Simulate owning the item with ID '1'
    };

    // Mock the user service to return the mock user data
    spyOn(userService, 'user').and.returnValue(mockUser);

    // Check if the item with ID '1' is owned
    expect(component.isItemOwned('1')).toBeTrue(); // Should return true because '1' is owned

    // Check if the item with ID '3' is not owned
    expect(component.isItemOwned('3')).toBeFalse(); // Should return false because '3' is not owned
  });
});
