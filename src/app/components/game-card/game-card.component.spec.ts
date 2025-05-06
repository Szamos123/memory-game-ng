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

  it('should emit cardClicked event with correct data when toggleCardState is called', () => {
    component.toggleCardState();
    expect(cardClickedSpy).toHaveBeenCalledWith(mockCardData);
  });
});
