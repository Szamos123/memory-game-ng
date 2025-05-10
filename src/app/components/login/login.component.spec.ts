import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Login, LoginComponent } from './login.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CardService } from '../../services/card.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let cardServiceMock: jasmine.SpyObj<CardService>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    cardServiceMock = jasmine.createSpyObj('CardService', ['fetchAndSetCards']);
    userServiceMock = jasmine.createSpyObj('UserService', ['loadUser']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, LoginComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CardService, useValue: cardServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should login successfully and navigate to home', fakeAsync(() => {
    spyOn(window, 'alert');

    component.loginObj.email = 'test@example.com';
    component.loginObj.password = 'password123';

    component.onLogin();

    const req = httpMock.expectOne(
      'https://681109923ac96f7119a35d5a.mockapi.io/user?email=test@example.com&password=password123'
    );
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        email: 'test@example.com',
        password: 'password123',
        username: 'TestUser',
        profilePic: 'test.png',
        gold: 100,
        selectedCardImage: 'card1.png',
        ownedCardImages: ['card1.png', 'card2.png'],
      },
    ]);

    tick();

    expect(localStorage.getItem('userEmail')).toBe('test@example.com');
    expect(localStorage.getItem('username')).toBe('TestUser');
    expect(localStorage.getItem('profilePic')).toBe('test.png');
    expect(localStorage.getItem('gold')).toBe('100');
    expect(localStorage.getItem('selectedCardImage')).toBe('card1.png');
    expect(localStorage.getItem('ownedCardImages')).toBe(
      JSON.stringify(['card1.png', 'card2.png'])
    );

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com');
    expect(cardServiceMock.fetchAndSetCards).toHaveBeenCalled();
    expect(userServiceMock.loadUser).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    expect(window.alert).toHaveBeenCalledWith('✅ Login successful!');
  }));

  it('should handle login with incorrect password', fakeAsync(() => {
    spyOn(window, 'alert');

    component.loginObj.email = 'test@example.com';
    component.loginObj.password = 'wrongpassword';

    component.onLogin();

    const req = httpMock.expectOne(
      'https://681109923ac96f7119a35d5a.mockapi.io/user?email=test@example.com&password=wrongpassword'
    );
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        email: 'test@example.com',
        password: 'password123',
        username: 'TestUser',
        profilePic: 'test.png',
        gold: 100,
        selectedCardImage: 'card1.png',
        ownedCardImages: ['card1.png', 'card2.png'],
      },
    ]);

    tick();

    expect(window.alert).toHaveBeenCalledWith('❌ Invalid email or password');
    expect(authServiceMock.login).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));

  it('should handle user not found scenario', fakeAsync(() => {
    spyOn(window, 'alert');

    component.loginObj.email = 'notfound@example.com';
    component.loginObj.password = 'password123';

    component.onLogin();

    const req = httpMock.expectOne(
      'https://681109923ac96f7119a35d5a.mockapi.io/user?email=notfound@example.com&password=password123'
    );
    expect(req.request.method).toBe('GET');

    req.flush([]);

    tick();

    expect(window.alert).toHaveBeenCalledWith(
      '❌ No user found with this email'
    );
    expect(authServiceMock.login).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));
});
