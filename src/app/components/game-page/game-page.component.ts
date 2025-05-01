import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';  
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
  cards$!: Observable<CardData[]>; 
  gameStarted$!: Observable<boolean>; 
  
  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.cards$ = this.gameService.cards$; 
    this.gameStarted$ = this.gameService.gameStarted$; 
  }

  ngOnDestroy(): void {
    
  }

  startGame(): void {
    this.gameService.startGame(); 
  }
  restartGame(): void {
    this.gameService.restartGame(); 
  }

  onCardClicked(card: CardData): void {
    this.gameService.onCardClicked(card);  
  }
}
