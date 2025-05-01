import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardData } from '../interfaces/card-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsSubject = new BehaviorSubject<CardData[]>([]);
  cards$ = this.cardsSubject.asObservable();

  private readonly apiKey = 'NmCmxM05Yx4suPBh3ffIksxGRpXAAu14A86qtRQ7tgzZgXAnZQ7feLpH'; // Replace with your actual key
  private readonly apiUrl = 'https://api.pexels.com/v1/search';

  constructor(private http: HttpClient) {}

  fetchAndSetCards(query: string = 'nature', perPage: number = 6): void {
    const headers = new HttpHeaders({ Authorization: this.apiKey });

    this.http.get<any>(`${this.apiUrl}?query=${query}&per_page=${perPage}`, { headers })
      .subscribe(response => {
        const imageUrls: string[] = response.photos.map((photo: any) => photo.src.medium);
        const cards = this.setupCards(imageUrls);
        this.setCards(this.shuffleArray(cards));
      }, error => {
        console.error('Error fetching cards:', error);
      });
  }

  private setupCards(imageUrls: string[]): CardData[] {
    const cards: CardData[] = [];

    imageUrls.forEach(imageUrl => {
      const cardData: CardData = {
        imageId: imageUrl, // using the URL as ID for simplicity
        cardState: 'default',
        imageUrl: imageUrl
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

  private setCards(cards: CardData[]): void {
    this.cardsSubject.next(cards);
  }
}
