import { Injectable, signal, computed } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp;
  public auth: Auth;
  public db: Firestore;
  public storage: FirebaseStorage;

  // Signal for tracking the current authenticated admin user
  private _currentUser = signal<User | null>(null);
  public currentUser = computed(() => this._currentUser());
  
  // Signal indicating if the user is logged in
  public isAuthenticated = computed(() => this._currentUser() !== null);

  constructor() {
    // Initialize Firebase
    this.app = initializeApp(environment.firebase);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);

    // Monitor authentication state changes and update the signal
    onAuthStateChanged(this.auth, (user) => {
      this._currentUser.set(user);
    });
  }
}
