import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { LoadingSpinnerComponent } from './layout/iu/loading-spinner/loading-spinner.component';
import { BooksComponent } from './pages/books/books.component';
import { ShortsComponent } from './pages/shorts/shorts.component';
import { BookComponent } from './pages/book/book.component';
import { AdminComponent } from './pages/admin/admin.component';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ShortComponent } from './pages/short/short.component';
import { OnscreenComponent } from './pages/onscreen/onscreen.component';
import { PlayerComponent } from './templates/youtube/player/player.component';
import { ScreenComponent } from './pages/screen/screen.component';
import { AdminOldComponent } from './pages/admin-old/admin-old.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoadingSpinnerComponent,
    HomeComponent,
    BooksComponent,
    BookComponent,
    ShortsComponent,
    AdminComponent,
    NotFoundComponent,
    AboutComponent,
    SettingsComponent,
    ShortComponent,
    OnscreenComponent,
    PlayerComponent,
    ScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class AppBootstrapModule { }
