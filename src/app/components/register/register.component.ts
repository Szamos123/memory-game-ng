import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [FormsModule]
})
export class RegisterComponent {
  registerObj = new Register();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  onRegister() {
    const apiUrl = 'https://681109923ac96f7119a35d5a.mockapi.io/user';

   
    const newUser = {
      email: this.registerObj.email,
      password: this.registerObj.password,
      username: this.registerObj.username,
      profilePic: '',  
      gold: 0,  
      selectedCardImage: '1',  
      ownedCardImages: ["1"],  
    };

    
    this.http.post<any>(apiUrl, newUser).subscribe(
      (user) => {
        alert('✅ Registration successful!');
        this.authService.login(user.email);  
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Registration failed:', error);
        alert('🚨 Something went wrong during registration.');
      }
    );
  }
}

export class Register {
  email: string = '';
  password: string = '';
  username: string = '';
  profilePic: string = '';
  gold: number = 0;
  selectedCardImage: string = '';
  ownedCardImages: string[] = [];

}
