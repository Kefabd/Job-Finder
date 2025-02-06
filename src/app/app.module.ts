import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({"projectId":"myjobfinder-93bd0","appId":"1:225733513014:web:071dbb30a6fb5b69252d97","storageBucket":"myjobfinder-93bd0.firebasestorage.app","apiKey":"AIzaSyAn0Jc-VyzfXO7UDZr2ZujKF0gssSdZRyE","authDomain":"myjobfinder-93bd0.firebaseapp.com","messagingSenderId":"225733513014"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
