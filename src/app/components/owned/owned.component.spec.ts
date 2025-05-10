import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnedComponent } from './owned.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';  // To mock the observable returned by ActivatedRoute

describe('OwnedComponent', () => {
  let component: OwnedComponent;
  let fixture: ComponentFixture<OwnedComponent>;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
