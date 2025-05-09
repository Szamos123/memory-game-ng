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

  
  updateOwnedItems(newItemId: string): void {
  const currentUser = this._user();
  if (!currentUser) return;

  const updatedOwnedItems = [...currentUser.ownedCardImages, newItemId];

  const updatedUser = {
    ...currentUser,
    ownedCardImages: updatedOwnedItems,
  };

  this.http.put(`https://681109923ac96f7119a35d5a.mockapi.io/user/${currentUser.id}`, updatedUser)
    .subscribe(
      () => {
        this._user.set(updatedUser);
        console.log('Owned items updated successfully:', updatedOwnedItems);
      },
      (error) => {
        console.error('Failed to update owned items:', error);
        alert('❌ Something went wrong while updating your items.');
      }
    );
  }
  updateUserGold(goldChange: number): void {
  const currentUser = this._user();
  
  if (!currentUser) return;

  const updatedGold = currentUser.gold + goldChange;

  const updatedUser = { ...currentUser, gold: updatedGold };

  this.http.put(`https://681109923ac96f7119a35d5a.mockapi.io/user/${currentUser.id}`, updatedUser)
    .subscribe(
      () => {
        console.log(`✅ User gold updated by ${goldChange}. New gold: ${updatedGold}`);
        this._user.set(updatedUser); 
      },
      (error) => {
        console.error('Failed to update user gold:', error);
        alert('❌ Something went wrong while updating your gold.');
      }
    );
  }
  
  getUserGold(): number {
    const user = this._user();
    return user ? user.gold : 0;
  }
  
}

    


