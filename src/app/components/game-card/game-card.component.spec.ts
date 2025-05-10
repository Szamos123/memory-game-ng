import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCardComponent } from './game-card.component';
import { CardData } from '../../interfaces/card-data';
import { CommonModule } from '@angular/common';

describe('GameCardComponent', () => {
  let component: GameCardComponent;
  let fixture: ComponentFixture<GameCardComponent>;
  let cardClickedSpy: jasmine.Spy;

  const mockCardData: CardData = {
    imageId: 'mock-image-id',
    imageUrl: 'mock-image-url',
    cardState: 'default',
    backImageUrl: 'mock-back-image-url',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, GameCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GameCardComponent);
    component = fixture.componentInstance;
    component.data = mockCardData;
    fixture.detectChanges();

    cardClickedSpy = spyOn(component.cardClicked, 'emit');
  });

  it('should emit cardClicked event with correct data when toggleCardState is called and conditions are met', () => {
    component.gameStarted = true;  
    component.revealing = false;   
    component.data.cardState = 'default';  
  
    component.toggleCardState();
    expect(cardClickedSpy).toHaveBeenCalledWith(mockCardData);
  });
  it('should not emit cardClicked event if game has not started', () => {
    component.gameStarted = false;
    component.revealing = false;
    component.data.cardState = 'default';
  
    component.toggleCardState();
    expect(cardClickedSpy).not.toHaveBeenCalled();
  });
  
  it('should not emit cardClicked event if the card is revealing', () => {
    component.gameStarted = true;
    component.revealing = true;
    component.data.cardState = 'default';
  
    component.toggleCardState();
    expect(cardClickedSpy).not.toHaveBeenCalled();
  });
  
  it('should not emit cardClicked event if the card is matched', () => {
    component.gameStarted = true;
    component.revealing = false;
    component.data.cardState = 'matched';
  
    component.toggleCardState();
    expect(cardClickedSpy).not.toHaveBeenCalled();
  });
    
});
