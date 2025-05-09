import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CardData } from '../../interfaces/card-data'; 
import { FormsModule } from '@angular/forms';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule]
})
export class LoginComponent {
  loginObj = new Login();

  cards: CardData[] = [];

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private authService: AuthService, 
    private cardService: CardService
  ) {}

  onLogin() {
  const apiUrl = 'https://681109923ac96f7119a35d5a.mockapi.io/user';



  this.http.get<any[]>(`${apiUrl}?email=${this.loginObj.email}&password=${this.loginObj.password}`)
    .subscribe(users => {
      if (users.length > 0) {
        localStorage.setItem('userEmail', this.loginObj.email);
        alert('✅ Login successful!');
        this.authService.login(this.loginObj.email);
        this.cardService.fetchAndSetCards(); 
        this.router.navigate(['/home']);
      } else {
        alert('❌ Invalid email or password');
      }
    }, error => {
      console.error('Login failed:', error);
      alert('🚨 Something went wrong during login.');
    });
}

  
}

export class Login {
  email: string = '';
  password: string = '';
  gold: number = 0;
}
