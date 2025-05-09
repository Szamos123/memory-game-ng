import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  const mockUser = {
    id: 1,
    email: 'mockEmail1',
    password: 'mockPassword1',
    username: 'mockUser',
    profilePic: 'default.jpg',
    selectedCardImage: 'default_card.jpg',
    ownedCardImages: [],
    gold: 0
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    httpMock.verify();
  }
  );

  it('should register a new user successfully', () => {
    component.registerObj = { ...mockUser };
    component.onRegister();

    const req = httpMock.expectOne('https://681109923ac96f7119a35d5a.mockapi.io/user');
    expect(req.request.method).toBe('POST');
    req.flush({}); 

    expect(component.registerObj).toEqual({ ...mockUser });
  });
  it('should handle registration error', () => {
    component.registerObj = { ...mockUser };
    component.onRegister();

    const req = httpMock.expectOne('https://681109923ac96f7119a35d5a.mockapi.io/user');
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Network error')); 

    expect(component.registerObj).toEqual({ ...mockUser });
  });

});
