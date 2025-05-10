import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnedComponent } from './owned.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OwnedComponent', () => {
  let component: OwnedComponent;
  let fixture: ComponentFixture<OwnedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnedComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
