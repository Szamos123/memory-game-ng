import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardData } from '../interfaces/card-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsSubject = new BehaviorSubject<CardData[]>([]);
  cards$ = this.cardsSubject.asObservable();
  userService = inject(UserService);

  private readonly apiKey = 'NmCmxM05Yx4suPBh3ffIksxGRpXAAu14A86qtRQ7tgzZgXAnZQ7feLpH'; 
  private readonly apiUrl = 'https://api.pexels.com/v1/search';

  constructor(private http: HttpClient, ) {}
  
  fetchAndSetCards(perPage: number = 6): void {
  const headers = new HttpHeaders({ Authorization: this.apiKey });

  const queries = [ 'Summer', 'Travel', 'Jungle', 'Rain', 'Ocean', 'Chef', 'Neon sign', 'Full moon'];
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];

  const randomPage = Math.floor(Math.random() * 10) + 1;

  this.http.get<any>(`${this.apiUrl}?query=${randomQuery}&per_page=${perPage}&page=${randomPage}`, { headers })
    .subscribe(response => {
      const imageUrls: string[] = response.photos.map((photo: any) => photo.src.medium);
      const cards = this.setupCards(imageUrls);
      const shuffledCards = this.shuffleArray(cards);
      this.cardsSubject.next(shuffledCards);
    }, error => {
      console.error('Error fetching cards:', error);
    });
}
  private setupCards(imageUrls: string[]): CardData[] {
    const cards: CardData[] = [];

    imageUrls.forEach(imageUrl => {
      const cardData: CardData = {
        imageId: imageUrl, 
        cardState: 'default',
        imageUrl: imageUrl,
        backImageUrl:'',
      };

      cards.push({ ...cardData });
      cards.push({ ...cardData });
    });

    return cards;
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array
      .map(item => ({ sortKey: Math.random(), value: item }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(item => item.value);
  }

 
}
