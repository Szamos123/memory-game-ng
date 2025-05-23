import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  currentPassword = '';
  newPassword = '';
  showChangeForm = false;
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    console.log('Retrieved email:', email);

    if (!email) {
      this.isLoading = false;
      return;
    }

    console.log('Fetching user data for email:', email);

    this.http
      .get<any[]>(
        `https://681109923ac96f7119a35d5a.mockapi.io/user?email=${email}`
      )
      .subscribe(
        (users) => {
          console.log('Fetched users:', users);
          if (users.length > 0) {
            this.user = users[0];
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching user data:', error);
          this.isLoading = false;
        }
      );
  }
  toggleChangePassword() {
    this.showChangeForm = !this.showChangeForm;
    this.currentPassword = '';
    this.newPassword = '';
  }

  onChangePassword() {
    if (this.currentPassword !== this.user.password) {
      alert('❌ Current password is incorrect.');
      return;
    }

    const updatedUser = { ...this.user, password: this.newPassword };

    this.http
      .put(
        `https://681109923ac96f7119a35d5a.mockapi.io/user/${this.user.id}`,
        updatedUser
      )
      .subscribe(
        () => {
          alert('✅ Password updated successfully!');
          this.user.password = this.newPassword;
          this.toggleChangePassword();
        },
        (error) => {
          console.error('Password update failed:', error);
          alert('❌ Failed to update password.');
        }
      );
  }
}
