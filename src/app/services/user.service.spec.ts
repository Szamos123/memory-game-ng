import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser = { id: '1', email: 'test@example.com', gold: 100 };

  beforeEach(() => {
    localStorage.setItem('userEmail', 'test@example.com');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should load user from API based on localStorage email', fakeAsync(() => {
    const req = httpMock.expectOne(
      'https://681109923ac96f7119a35d5a.mockapi.io/user?email=test@example.com'
    );
    req.flush([mockUser]);
    expect(req.request.method).toBe('GET');

    tick();

    expect(service.user()).toEqual(mockUser);
  }));
});
