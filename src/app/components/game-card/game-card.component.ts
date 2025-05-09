import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardData } from '../../interfaces/card-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  imports: [CommonModule],
})
export class GameCardComponent {
  @Input() data: CardData = { imageId: '', imageUrl: '', cardState: 'default' };
  @Input() gameStarted: boolean = false;
  @Input() revealing: boolean = false;
  @Output() cardClicked = new EventEmitter<CardData>();

  toggleCardState(): void {
    if (!this.gameStarted || this.revealing || this.data.cardState === 'matched') return;
    this.cardClicked.emit(this.data);
  }
}
