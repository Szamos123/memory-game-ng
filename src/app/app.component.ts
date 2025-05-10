import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { CardService } from './services/card.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  template: `
    <app-header />
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent implements OnInit {
  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.cardService.fetchAndSetCards();
    initFlowbite();
  }
}
