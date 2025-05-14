import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnedComponent } from './owned.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';  // To mock the observable returned by ActivatedRoute
import { UserService } from '../../services/user.service';

describe('OwnedComponent', () => {
  let component: OwnedComponent;
  let fixture: ComponentFixture<OwnedComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OwnedComponent], 
      providers: [
        {
          provide: ActivatedRoute,
          
          useValue: { snapshot: { paramMap: of({}) } } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch owned skins and set ownedSkins on success', () => {
    const mockSkins = [{ id: '1', name: 'Skin1' }, { id: '2', name: 'Skin2' }];
    userService = TestBed.inject(UserService);
    spyOn(userService, 'fetchOwnedSkins').and.returnValue(of(mockSkins));
    component.fetchOwnedSkins();
    expect(component.ownedSkins).toEqual(mockSkins);
  });


  it('should call selectSkin with the correct skinId', () => {
    userService = TestBed.inject(UserService);
    const selectSkinSpy = spyOn(userService, 'selectSkin');
    const skinId = '123';
    component.selectSkin(skinId);
    expect(selectSkinSpy).toHaveBeenCalledWith(skinId);
  });
});
