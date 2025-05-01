import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user = signal<any | null> (null);
  user = computed(() => this._user())
  setUser(user: any){
    this._user.set(user);
  }

  constructor(private http: HttpClient) { this.loadUser()}

  loadUser(){
    const email = localStorage.getItem('userEmail');
    if(!email) return;

    this.http.get<any[]> (`https://681109923ac96f7119a35d5a.mockapi.io/user?email=${email}`).subscribe((users) =>{
      if(users.length > 0){
        this._user.set(users[0])
      }
    });
  }

  updateGold(newGold: number) {
    const currentUser = this._user();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, gold: newGold };

    this.http.put(`https://681109923ac96f7119a35d5a.mockapi.io/user/${currentUser.id}`, updatedUser)
      .subscribe(() => {
        this._user.set(updatedUser);
      });
  }
}
