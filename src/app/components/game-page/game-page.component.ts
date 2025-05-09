import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
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
  private cardsSubscription!: Subscription;
  
  constructor(
    private cardService: CardService,
    private http: HttpClient,
    private authService: AuthService, 
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.cardsSubscription = this.cardService.cards$.subscribe(cards => {
      this.cards = cards;
    })
  }

  onCardClicked(card: CardData): void {
    if (!this.gameStarted && this.flippedCards.length >= 2 && card.cardState !== 'flipped') {
      return;
    }
    

    if(card.cardState !== 'flipped' && this.flippedCards.filter(c => c.imageId === card.imageId && c.cardState !== 'flipped' ) .length === 0){
      card.cardState = 'flipped';
      this.flippedCards.push(card);
      if(this.flippedCards.length === 2){
        this.isMatch()
      }

    }
  }
  isMatch(): void{
    
    if(this.flippedCards.length === 2){
      const[first, second] = this.flippedCards;

      const matched = first.imageId === second.imageId;
      const isSameCard = first === second;
      if(matched && !isSameCard){
        //match found
        setTimeout(() => {
          first.cardState = 'matched';
          second.cardState = 'matched';
          this.flippedCards = [];
          var bonusGold = 10+this.streakCounter*5;
          this.updateUserGold(bonusGold);
          this.streakCounter++;
          console.log("🔥 Streak: " + this.streakCounter + " → Earned gold: " + bonusGold);
          
          
          this.checkEndOfGame();
        }, 600);
      }else{
        setTimeout(()=>{
            
            first.cardState = 'default';
            second.cardState = 'default';
            this.streakCounter = 0;
            console.log("💔 Streak broken. Counter reset.");
            this.flippedCards = [];
        }, 1000)
      } 
    }

  }

  ngOnDestroy(): void {
    
    if (this.cardsSubscription) {
      this.cardsSubscription.unsubscribe();
    }
  }
  
  shuffleArray(anArray: any[]): any[] {
    return anArray
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
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
  startGame(): void {
    this.gameStarted = false; 
    this.revealingCards = true;
  
    // Show all cards for 1.5 seconds
    this.cards.forEach(card => {
      card.cardState = 'flipped';
    });
  
    setTimeout(() => {
      this.cards.forEach(card => {
        card.cardState = 'default';
      });
  
      this.revealingCards = false;
      this.gameStarted = true;
    }, 1500);
  }
  checkEndOfGame(): void {
    console.log("Checking end of game...")
    const allMatched = this.cards.every(card => card.cardState === 'matched'); 
    console.log(allMatched);

    if (allMatched) {
      console.log('🎉 Game Over! All cards matched!');
      this.resetGame();
    }
  }

  resetGame(): void {
  console.log("🔄 Resetting game...");

  
  this.flippedCards = [];
  this.streakCounter = 0;
  this.gameStarted = false;
  this.revealingCards = false;

  
  this.cardService.fetchAndSetCards();
}
}