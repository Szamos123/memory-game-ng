import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Router, useValue: routerMock }],
    });

    guard = TestBed.inject(AuthGuard);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow activation when user is logged in', () => {
    localStorage.setItem('isLoggedIn', 'true');

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should block activation and redirect to login when not logged in', () => {
    localStorage.setItem('isLoggedIn', 'false');

    spyOn(window, 'alert'); 

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(window.alert).toHaveBeenCalledWith('Please log in first!');
  });
});
