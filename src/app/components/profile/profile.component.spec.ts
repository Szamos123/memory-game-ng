import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let httpMock: HttpTestingController;

  const mockUser = {
    id: 1,
    email: 'mockEmail1',
    password: 'mockPassword1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProfileComponent],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.setItem('userEmail', mockUser.email);
    fixture.detectChanges();

    const req = httpMock.expectOne((req) =>
      req.url.includes(`user?email=${mockUser.email}`)
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should change password successfully', fakeAsync(() => {
    component.user = { ...mockUser };
    component.currentPassword = 'mockPassword1';
    component.newPassword = 'newMockPassword1';

    component.onChangePassword();

    const req = httpMock.expectOne((req) =>
      req.url.includes(`user/${mockUser.id}`)
    );
    expect(req.request.method).toBe('PUT');
    req.flush({});

    tick();

    expect(component.user.password).toBe('newMockPassword1');
  }));

  it('should not change password if current password is incorrect', () => {
    component.user = { ...mockUser };
    component.currentPassword = 'wrongPassword';
    component.newPassword = 'newMockPassword1';

    spyOn(window, 'alert');

    component.onChangePassword();

    expect(window.alert).toHaveBeenCalledWith(
      '❌ Current password is incorrect.'
    );
  });

  it('should toggle change password form', () => {
    component.showChangeForm = false;
    component.toggleChangePassword();
    expect(component.showChangeForm).toBe(true);

    component.toggleChangePassword();
    expect(component.showChangeForm).toBe(false);
  });

  it('should fetch user data on init', fakeAsync(() => {
    const email = 'mockEmail1';
    localStorage.setItem('userEmail', email);

    component.ngOnInit();

    const req = httpMock.expectOne((req) =>
      req.url.includes(`user?email=${email}`)
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);

    tick();

    expect(component.user).toEqual(mockUser);
  }));
});
