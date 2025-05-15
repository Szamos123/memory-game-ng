# **Memory Card Game - Angular**
A memory card game where users earn gold by matching pairs, and spend the gold on skins for the back of the cards.  
This project demonstrates Angular state management, HTTP requests and integration of a mock backend API.

The project was made using Angular, RxJS and TailwindCSS.  

## **Features:**  

**User Authentication:** Users can register and log in.  

**Memory Card Game:** Classic memory game with dynamic card skins.

**Skin Shop:** Users can purchase skins using in-game currency.  

**Inventory:** Users can see the skins they own and equip one they like.  

**Gold Management:** In-game currency (Gold) is updated based on gameplay and purchases.

**Dynamic Card Skins:** All users start with a default skin, but they can unlock and equip new skins.

**Unit tests:** All components have unit tests using Karma + Jasmine.  

**Continuous Integration (CI):** CI with GitHub Actions that runs, tests and builds the project on every push and pull request to the main branch.  

## **Tech stack:**  
**Frontend framework:** Angular 19  

**State Management:** RxJS  

**UI Frameworks:** Tailwind CSS, Flowbite  

**API:** I used a website called mockAPI, where i could create resources and send requests to.  

## **Potential improvements:**  

**Responsiveness on mobile and tablet devices**  

**Using Supabase or other alternatives instead of MockAPI**

**More things the user can do on their profile(upload profile pictures, etc.)**

**Integrate a notification service instead of alerts**

# **Setup and installation**   
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/Szamos123/memory-game-ng.git

2. **Move into the project directory**
   ```bash
   cd <memory-game-ng>
3. **Install dependencies**
   ```bash
   npm install
4. **Start development server**
   ```bash
   ng serve
5. **To run tests**
   ```bash
   ng test

