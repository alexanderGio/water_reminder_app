//importando dependencias
import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User} from "@angular/fire/auth";
import { onAuthStateChanged } from 'firebase/auth';//avisa sempre que um usuário entra, sai ou muda.
import { BehaviorSubject } from 'rxjs'; //guarda um valor e emite, no caso o usuário atual

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null); //cria um valor null sem nenhum usuário logado

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, user => this.user$.next(user));
  }

  get currentUser$() {
    return this.user$.asObservable();
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}