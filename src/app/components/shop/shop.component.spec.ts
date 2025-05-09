import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { UserService } from '../../services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;
  let userService: UserService;

  const mockShopItems = [
    { id: '1', name: 'Card Back 1', price: 50 },
    { id: '2', name: 'Card Back 2', price: 150 },
    { id: '3', name: 'Card Back 3', price: 100 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [UserService] 
    }).compileComponents();

    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  beforeEach(() => {
    
    spyOn(userService, 'updateUserGold');
    spyOn(userService, 'updateOwnedItems');
    spyOn(window, 'alert'); 
  });

  it('should not purchase item if user does not have enough gold', () => {
    const mockItem = { ...mockShopItems[1], price: 150, description: 'Another sample description', imageUrl: 'another-sample-image-url' };
    const mockUser = { id: '1', email: 'mockEmail1', gold: 100, ownedCardImages: [] };

    spyOn(userService, 'user').and.returnValue(mockUser);

    component.purchaseItem(mockItem);

    expect(window.alert).toHaveBeenCalledWith('❌ You do not have enough gold!');
  });

  it('should purchase item successfully if user has enough gold', () => {
    const mockItem = { ...mockShopItems[0], price: 50, description: 'A sample description', imageUrl: 'sample-image-url' };
    const mockUser = { id: '1', email: 'mockEmail1', gold: 100, ownedCardImages: [] };

    spyOn(userService, 'user').and.returnValue(mockUser);

    component.purchaseItem(mockItem);

    expect(userService.updateUserGold).toHaveBeenCalledWith(-50);
    expect(userService.updateOwnedItems).toHaveBeenCalledWith(mockItem.id);
  });
  it('should not purchase item if user data is not available', () => {
    const mockItem = { ...mockShopItems[0], price: 50, description: 'A sample description', imageUrl: 'sample-image-url' };
    
    spyOn(userService, 'user').and.returnValue(null); // Simulate no user data

    component.purchaseItem(mockItem);

    expect(userService.updateUserGold).not.toHaveBeenCalled();
    expect(userService.updateOwnedItems).not.toHaveBeenCalled();
  });
});
