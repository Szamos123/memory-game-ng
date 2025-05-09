import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;
  let httpMock: HttpTestingController;
  let userService: UserService;

  const mockUser = {
    id: '1',
    email: 'mockEmail1',
    password: 'mockPassword1',
    gold: 100,
    ownedCardImages: ['1']
  };

  const mockShopItems = [
    { id: '1', name: 'Card Back 1', description: 'Cool card back', price: 50, imageUrl: 'http://example.com/card1.jpg' },
    { id: '2', name: 'Card Back 2', description: 'Cooler card back', price: 75, imageUrl: 'http://example.com/card2.jpg' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ShopComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            user: () => mockUser,
            updateUserGold: jasmine.createSpy('updateUserGold'),
            updateOwnedItems: jasmine.createSpy('updateOwnedItems')
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call purchaseItem method when purchase button is clicked', () => {
    // Mock the shop items response
    const req = httpMock.expectOne('https://681109923ac96f7119a35d5a.mockapi.io/shop-items');
    expect(req.request.method).toBe('GET');
    req.flush(mockShopItems);

    fixture.detectChanges();

    spyOn(component, 'purchaseItem');

    // Find the purchase button for the second item and click it
    const button = fixture.debugElement.queryAll(By.css('button'))[1];
    button.triggerEventHandler('click', null);

    expect(component.purchaseItem).toHaveBeenCalledWith(mockShopItems[1]);
  });
});
