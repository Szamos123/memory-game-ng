import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CardData } from '../../interfaces/card-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  imports: [CommonModule],
})
export class GameCardComponent implements OnInit {
  @Input() data: CardData = { imageId: '', imageUrl: '', cardState: 'default', backImageUrl: '' };
  @Input() gameStarted: boolean = false;
  @Input() revealing: boolean = false;
  @Input() backImageUrl: string = '';
  @Output() cardClicked = new EventEmitter<CardData>();

  isImageLoaded: boolean = false;
  isLoading: boolean = true; 

  toggleCardState(): void {
    if (!this.gameStarted || this.revealing || this.data.cardState === 'matched') return;
    this.cardClicked.emit(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['backImageUrl']) {
      this.isImageLoaded = false; 
      this.isLoading = true;
    }
  }

  ngOnInit(): void {
    if (this.backImageUrl) {
      const img = new Image();
      img.src = this.backImageUrl;
      img.onload = () => {
        this.isImageLoaded = true;
        this.isLoading = false;
      };
      img.onerror = () => {
        this.isLoading = false;
      };
    }
  }
}