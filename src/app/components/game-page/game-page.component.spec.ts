import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GamePageComponent } from './game-page.component';
import { CardData } from '../../interfaces/card-data';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from '../game-card/game-card.component';
import { UserService } from '../../services/user.service';

fdescribe('GamePageComponent', () => {
  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;
  let mockCardService: any;
  let mockUserService: jasmine.SpyObj<UserService>;

  const mockCards: CardData[] = [
    { imageId: '1', imageUrl: 'url1', cardState: 'default' },
    { imageId: '1', imageUrl: 'url1', cardState: 'default' },
    { imageId: '2', imageUrl: 'url2', cardState: 'default' }
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['setUser']);
    mockCardService = {
      cards$: of([...mockCards])
    };
    await TestBed.configureTestingModule({
      imports: [CommonModule, GameCardComponent, HttpClientTestingModule, GamePageComponent],
      
      providers: [
        { provide: 'CardService', useValue: mockCardService },
        { provide: 'UserService', useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should flip a card and add it to flippedCards if valid', () => {
    const card = { ...mockCards[0] };
    component.onCardClicked(card);

    expect(card.cardState).toBe('flipped');
    expect(component.flippedCards.length).toBe(1);
  });

  fit('should reset cards if not matched', fakeAsync(() => {
    const card1 = { ...mockCards[0] };
    const card2 = { ...mockCards[2] };

    component.onCardClicked(card1);
    component.onCardClicked(card2);

    tick(1000); 

    expect(card1.cardState).toBe('default');
    expect(card2.cardState).toBe('default');
    expect(component.streakCounter).toBe(0);
    expect(component.flippedCards.length).toBe(0);
  }));

  fit('should not flip card if already flipped', () => {
    const card = { ...mockCards[0], cardState: 'flipped' as CardData['cardState'] };
    component.onCardClicked(card);
    expect(component.flippedCards.length).toBe(0);
  });

  fit('should not flip third card while two are already flipped and game not started', () => {
    const card1 = { ...mockCards[0] };
    const card2 = { ...mockCards[1] };
    const card3 = { ...mockCards[2] };

    component.onCardClicked(card1);
    component.onCardClicked(card2);
    component.onCardClicked(card3);

    expect(component.flippedCards.length).toBe(2);
    expect(card3.cardState).toBe('default');
  });

 
  
  fit('should reset streak counter on mismatch', fakeAsync(() => {
    const card1 = { ...mockCards[0] };
    const card2 = { ...mockCards[2] };

    component.onCardClicked(card1);
    component.onCardClicked(card2);

    tick(2000); 

    expect(component.streakCounter).toBe(0);
  }
  ));
  fit('should shuffle cards', () => {
    const cards = [
      { id: 1, imageId: 1 },
      { id: 2, imageId: 2 },
      { id: 3, imageId: 3 },
      { id: 4, imageId: 4 }
    ];
  
    const originalCards = [...cards];
    const shuffledCards = component.shuffleArray([...cards]);
  
    expect(shuffledCards).not.toEqual(originalCards); // Now should pass
  });
  fit('should run checkEndOfGame', () => {
    component.cards = [{ imageId: '1', imageUrl: 'url1', cardState: 'matched' }, { imageId: '2', imageUrl: 'url2', cardState: 'matched' }];
    component.checkEndOfGame();
    expect(component.gameStarted).toBe(false);
    expect(component.streakCounter).toBe(0);
  });
});
