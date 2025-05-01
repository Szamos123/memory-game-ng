import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';  // Assuming game logic is moved here
import { Observable } from 'rxjs';
import { CardData } from '../../interfaces/card-data'; 
import { CommonModule } from '@angular/common';
import { GameCardComponent } from '../game-card/game-card.component';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  imports:[CommonModule, GameCardComponent]
})
export class GamePageComponent implements OnInit, OnDestroy {
  cards$!: Observable<CardData[]>; // Cards will be observable
  gameStarted$!: Observable<boolean>; // Game state from the service
  
  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.cards$ = this.gameService.cards$; // Getting cards from service
    this.gameStarted$ = this.gameService.gameStarted$; // Getting game state from service
  }

  ngOnDestroy(): void {
    // Handle any cleanup if necessary
  }

  startGame(): void {
    this.gameService.startGame(); // Start game logic handled by the service
  }

  endGame(): void {
    this.gameService.endGame(); // End game logic handled by the service
  }

  onCardClicked(card: CardData): void {
    this.gameService.onCardClicked(card);  // Logic for flipping the card and matching handled by the service
  }
}
