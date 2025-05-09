import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CardService } from '../../services/card.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule]
})
export class LoginComponent {
  loginObj = new Login();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cardService: CardService,
    private userService: UserService
  ) {}

  onLogin() {
    const apiUrl = 'https://681109923ac96f7119a35d5a.mockapi.io/user';

    this.http.get<any[]>(`${apiUrl}?email=${this.loginObj.email}&password=${this.loginObj.password}`).subscribe(users => {
      if (users.length > 0) {
        const user = users[0]; 

        
      
        if (this.loginObj.password === user.password) {
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('username', user.username);
          localStorage.setItem('profilePic', user.profilePic);
          localStorage.setItem('gold', user.gold.toString());
          localStorage.setItem('selectedCardImage', user.selectedCardImage);
          localStorage.setItem('ownedCardImages', JSON.stringify(user.ownedCardImages));

          alert('✅ Login successful!');
          this.userService.loadUser();
          this.authService.login(user.email);
          this.cardService.fetchAndSetCards();  
          this.router.navigate(['/home']);
        } else {
          alert('❌ Invalid email or password');
        }
      } else {
        alert('❌ No user found with this email');
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
  username: string = '';
  profilePic: string ='';
  gold: number = 0;
  selectedCardImage: string = '';
  ownedCardImages: string[] = [];

}
