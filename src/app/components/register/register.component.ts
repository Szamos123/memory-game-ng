import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerObj = new Register();

  constructor(private http: HttpClient, private router: Router) {}

  onRegister(){
    const apiUrl = "https://681109923ac96f7119a35d5a.mockapi.io/user";
    
    this.http.post(apiUrl, this.registerObj).subscribe(
      res => {
        alert("Registration successful");
        this.router.navigate(['/login']);
      },
      err => {
        alert("Registration failed");
        console.error('Registration error:', err)
      }

    )
  }

}

export class Register{
  email: string = '';
  password: string = '';
  gold: number = 0;
}
