import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { CardData } from '../../interfaces/card-data';
import { CardService } from '../../services/card.service';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from '../game-card/game-card.component';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  imports: [CommonModule, GameCardComponent],
})
export class GamePageComponent implements OnInit, OnDestroy {
  cards: CardData[] = [];
  flippedCards: CardData[] = [];
  streakCounter: number = 0;
  gameStarted: boolean = false;
  revealingCards: boolean = false;
  selectedSkinImageUrl: string = '';
  private cardsSubscription!: Subscription;
  private userLoadedSubscription!: Subscription;
  private processingCards: boolean = false;

  constructor(
    private cardService: CardService,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.cards.length === 0) {
      this.cardService.fetchAndSetCards();
    }
    this.cardsSubscription = this.cardService.cards$.subscribe((cards) => {
      if (cards.length > 0) {
        this.cards = cards;
        console.log('Cards loaded:', this.cards);
        this.userLoadedSubscription = this.userService.userLoaded$.subscribe(
          (userLoaded) => {
            if (userLoaded) {
              this.loadSelectedSkin();
            }
          }
        );
      }
    });
  }

  loadSelectedSkin(): void {
    const selectedCardSkinId = this.userService.user()?.selectedCardImage;

    if (selectedCardSkinId) {
      this.userService.fetchOwnedSkins().subscribe((skins) => {
        const selectedSkin = skins.find(
          (skin) => skin.id === selectedCardSkinId
        );
        if (selectedSkin) {
          console.log('Selected Skin:', selectedSkin);
          this.applySkinToCards(selectedSkin.imageUrl);
        }
      });
    }
  }
  applySkinToCards(skinImageUrl: string): void {
    this.cards = this.cards.map((card) => ({
      ...card,
      backImageUrl: skinImageUrl,
    }));
    this.cdr.detectChanges();
  }
  onCardClicked(card: CardData): void {
    if (this.processingCards || !this.gameStarted) return;
    if (this.flippedCards.length >= 2) return;

    if (
      card.cardState !== 'flipped' &&
      this.flippedCards.filter(
        (c) => c.imageId === card.imageId && c.cardState !== 'flipped'
      ).length === 0
    ) {
      card.cardState = 'flipped';
      this.flippedCards.push(card);
      if (this.flippedCards.length === 2) {
        this.isMatch();
      }
    }
  }
  isMatch(): void {
    if (this.flippedCards.length === 2) {
      const [first, second] = this.flippedCards;

      const matched = first.imageId === second.imageId;
      const isSameCard = first === second;
      if (matched && !isSameCard) {
        //match found
        setTimeout(() => {
          first.cardState = 'matched';
          second.cardState = 'matched';
          this.flippedCards = [];

          var bonusGold = 5 + this.streakCounter * 2;
          this.userService.updateUserGold(bonusGold).subscribe(() => {
            console.log(`User received ${bonusGold} gold for matching cards.`);
          });

          this.streakCounter++;

          this.checkEndOfGame();
        }, 600);
      } else {
        setTimeout(() => {
          first.cardState = 'default';
          second.cardState = 'default';

          this.streakCounter = 0;
          this.flippedCards = [];
        }, 1000);
      }
    }
  }

  shuffleArray(anArray: any[]): any[] {
    return anArray
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }
  startGame(): void {
    this.gameStarted = false;
    this.revealingCards = true;

    this.cards.forEach((card) => {
      card.cardState = 'flipped';
    });
    setTimeout(() => {
      this.cards.forEach((card) => {
        card.cardState = 'default';
      });

      this.revealingCards = false;
      this.gameStarted = true;
    }, 1500);
  }
  checkEndOfGame(): void {
    const allMatched = this.cards.every((card) => card.cardState === 'matched');
    console.log(allMatched);

    if (allMatched) {
      this.resetGame();
    }
  }

  resetGame(): void {
    this.flippedCards = [];
    this.streakCounter = 0;
    this.gameStarted = false;
    this.revealingCards = false;
    this.processingCards = false;

    this.cardService.fetchAndSetCards();
  }

  ngOnDestroy(): void {
    if (this.cardsSubscription) {
      this.cardsSubscription.unsubscribe();
    }
    if (this.userLoadedSubscription) {
      this.userLoadedSubscription.unsubscribe();
    }
  }
}
