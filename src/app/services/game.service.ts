import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardData } from '../interfaces/card-data';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameStartedSubject = new BehaviorSubject<boolean>(false);
  gameStarted$ = this.gameStartedSubject.asObservable();

  private cardsSubject = new BehaviorSubject<CardData[]>([]);
  cards$ = this.cardsSubject.asObservable();

  private flippedCards: CardData[] = [];
  private streakCounter: number = 0;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

 
  initCards(cards: CardData[]): void {
    this.cardsSubject.next(this.shuffleArray(cards));
  }

  
  startGame(): void {
    this.gameStartedSubject.next(true);
    let currentCards = this.cardsSubject.getValue();

    currentCards.forEach(card => {
      card.cardState = 'flipped';
    });

    this.cardsSubject.next(currentCards);

    setTimeout(() => {
      currentCards = currentCards.map(card => {
        card.cardState = 'default';
        return card;
      });

      this.cardsSubject.next(currentCards);
    }, 1600);
  }

  
  onCardClicked(card: CardData): void {
    if (!this.gameStartedSubject.getValue() || card.cardState === 'flipped') {
      return;
    }

    card.cardState = 'flipped';
    this.flippedCards.push(card);

    this.isMatch();
  }

  
  isMatch(): void {
    if (this.flippedCards.length === 2) {
      const [first, second] = this.flippedCards;

      const matched = first.imageId === second.imageId;
      const isSameCard = first === second;

      if (matched && !isSameCard) {
       
        setTimeout(() => {
          first.cardState = 'matched';
          second.cardState = 'matched';

          this.flippedCards = [];
          const bonusGold = 10 + this.streakCounter * 5;

          this.updateUserGold(bonusGold);

          this.streakCounter++;
          this.checkGameOver();
          console.log("🔥 Streak: " + this.streakCounter + " → Earned gold: " + bonusGold);
        }, 600);
      } else {
        setTimeout(() => {
          first.cardState = 'default';
          second.cardState = 'default';
          this.streakCounter = 0;
          console.log("💔 Streak broken. Counter reset.");
          this.flippedCards = [];
        }, 1000);
      }
    }
  }

  
  updateUserGold(earnedGold: number): void {
    const currentUser = this.userService.user();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, gold: currentUser.gold + earnedGold };

    this.http.put(`https://681109923ac96f7119a35d5a.mockapi.io/user/${currentUser.id}`, updatedUser)
      .subscribe(() => {
        console.log(`✅ User earned ${earnedGold} gold for matching.`);
        this.userService.setUser(updatedUser);
      });
  }

  
  private shuffleArray(cards: CardData[]): CardData[] {
    return cards
      .map((card): [number, CardData] => [Math.random(), card])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

 
  checkGameOver(): void {
    const allMatched = this.cardsSubject.getValue().every(card => card.cardState === 'matched');
    if (allMatched) {
      this.gameStartedSubject.next(false);
      console.log("🏆 Game Over! All cards matched.");
    }
  }
  restartGame(): void {
    this.streakCounter = 0;
    this.gameStartedSubject.next(true);
    this.initCards(this.cardsSubject.getValue());
    this.startGame();
  }
  
}
