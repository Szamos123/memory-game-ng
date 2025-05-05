import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: { navigate: jasmine.createSpy() } } // Mock the Router
      ]
    });
    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });


  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });
});
