import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardData } from '../../interfaces/card-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  imports:[CommonModule]
})
export class GameCardComponent {
  @Input() data!: CardData; // Now, this already has imageUrl passed in
  @Output() cardClicked = new EventEmitter<CardData>();

  imageUrl: string = '';
  toggleCardState(): void{
    this.cardClicked.emit(this.data)
  }
  
}
