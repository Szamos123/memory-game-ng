import { Component, computed } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  imports: [CommonModule, RouterLink],
})
export class ShopComponent {
  shopItems: ShopItem[] = [];
  user: any;
  userGold: any;
  private readonly shopApiUrl = 'https://681109923ac96f7119a35d5a.mockapi.io/shop-items';

  constructor(private userService: UserService, private http: HttpClient) {
    this.user = this.userService.user;
    this.userGold = computed(() => this.user()?.gold ?? 0);
  }

  ngOnInit(): void {
    this.fetchShopItems();
  }

  fetchShopItems(): void {
    

    this.http.get<ShopItem[]>(this.shopApiUrl).subscribe(
      (items) => {
        this.shopItems = items.filter((item) => item.id !== '1');
        console.log('Shop items loaded:', this.shopItems);
      },
      (error) => {
        console.error('Failed to fetch shop items:', error);
      }
    );
  }

  purchaseItem(item: ShopItem): void {
    const user = this.userService.user();

    if (!user) {
      alert('❌ User data not available.');
      return;
    }

    const currentGold = user.gold;

    console.log(
      `User Gold: ${currentGold}, Item Price: ${item.price}, Item ID: ${item.id}`
    );

    if (currentGold >= item.price) {
      console.log(`Attempting to purchase ${item.name} for ${item.price} gold`);

      this.userService.updateUserGold(-item.price).subscribe((updatedUser) => {
        if (updatedUser) {
          this.userService.updateOwnedItems(item.id);
          alert(`✅ Successfully purchased ${item.name}!`);
        }
      });
    } else {
      alert('❌ You do not have enough gold!');
    }
  }

  isItemOwned(itemId: string): boolean {
    const user = this.userService.user();
    console.log('Owned items:', user?.ownedCardImages);
    return user?.ownedCardImages?.includes(itemId) ?? false;
  }
}
