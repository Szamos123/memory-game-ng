import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login, LoginComponent } from './login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CardService } from '../../services/card.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let cardServiceMock: jasmine.SpyObj<CardService>;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    cardServiceMock = jasmine.createSpyObj('CardService', ['fetchAndSetCards']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, LoginComponent],
      declarations: [],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CardService, useValue: cardServiceMock },
         
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should login successfully and navigate to home', fakeAsync(() => {
    
    component.loginObj.email = 'test@example.com';
    component.loginObj.password = 'password123';

   
    component.onLogin();

    const req = httpMock.expectOne(`https://681109923ac96f7119a35d5a.mockapi.io/user?email=test@example.com&password=password123`);
    expect(req.request.method).toBe('GET');

    
    req.flush([{ id: 1, email: 'test@example.com', password: 'password123' }]);

    tick(); // http get is async,
            //  need this to finish the request before checking the expectations
    
    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com');
    expect(cardServiceMock.fetchAndSetCards).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  }));
});
