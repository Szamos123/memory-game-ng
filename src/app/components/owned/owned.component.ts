import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-owned',
  templateUrl: './owned.component.html',
  styleUrls: ['./owned.component.scss'],
  imports: [CommonModule, RouterLink],
})
export class OwnedComponent implements OnInit {
  ownedSkins: any[] = [];

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.userService.userLoaded$.subscribe((isLoaded) => {
      if (isLoaded) {
        this.fetchOwnedSkins();
      }
    });

    this.userService.loadUser();
  }

  fetchOwnedSkins(): void {
    this.userService.fetchOwnedSkins().subscribe(
      (skins) => {
        this.ownedSkins = skins;
      },
      (error) => {
        console.error('Error fetching owned skins:', error);
      }
    );
  }

  selectSkin(skinId: string): void {
    this.userService.selectSkin(skinId);
  }
}
