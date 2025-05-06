import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear(); // clean state
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear(); // clean after each
  });

  it('should initialize isLoggedIn from localStorage as false', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should initialize isLoggedIn from localStorage as true', () => {
    localStorage.setItem('isLoggedIn', 'true');

    
    service = new AuthService();// recreate to trigger re-read

    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should login and update state and localStorage', () => {
    service.login('test@example.com');

    expect(service.isLoggedIn()).toBeTrue();
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
    expect(localStorage.getItem('userEmail')).toBe('test@example.com');
  });

  it('should logout and clear state and localStorage', () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', 'test@example.com');

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(localStorage.getItem('userEmail')).toBeNull();
  });
});
