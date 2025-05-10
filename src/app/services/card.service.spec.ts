import { CardService } from './card.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

describe('CardService', () => {
  let service: CardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardService],
    });

    service = TestBed.inject(CardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch and set cards', fakeAsync(() => {
    let result: any;

    service.cards$.subscribe((cards) => {
      result = cards;
    });

    service.fetchAndSetCards(6);

    const requests = httpMock.match(() => true);

    requests.forEach((req) => {
      req.flush({
        photos: [
          { src: { medium: 'url1' } },
          { src: { medium: 'url2' } },
          { src: { medium: 'url3' } },
        ],
      });
    });

    tick();

    expect(result).toBeDefined();
    expect(result.length).toBe(6);

    const allUrls = result.map((card: { imageUrl: any }) => card.imageUrl);
    expect(allUrls).toContain('url1');
    expect(allUrls).toContain('url2');
    expect(allUrls).toContain('url3');

    httpMock.verify();
  }));
});
