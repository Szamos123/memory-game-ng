import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CardService } from './card.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CardData } from '../interfaces/card-data';

describe('CardService', () => {
  let service: CardService;
  let httpMock: HttpTestingController;

  const mockResponse = {
    photos: [
      { src: { medium: 'url1' } },
      { src: { medium: 'url2' } },
      { src: { medium: 'url3' } }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardService]
    });

    service = TestBed.inject(CardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch and set duplicated & shuffled cards', fakeAsync(() => {
    let result: CardData[] | undefined;

    service.cards$.subscribe(cards => {
      result = cards;
    });

    service.fetchAndSetCards('test', 3);

    const req = httpMock.expectOne(`https://api.pexels.com/v1/search?query=test&per_page=3`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBeTruthy();

    req.flush(mockResponse);
    tick(); // simulate passage of time for async operations

    expect(result).toBeDefined();
    expect(result!.length).toBe(6); 
    const allUrls = result!.map(card => card.imageUrl);
    expect(allUrls).toContain('url1');
    expect(allUrls).toContain('url2');
    expect(allUrls).toContain('url3');
  }));
});
