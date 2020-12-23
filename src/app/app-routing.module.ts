import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

import { HomeComponent } from './pages/home/home.component';
import { BooksComponent } from './pages/books/books.component';
import { BookComponent } from './pages/book/book.component';
import { ShortsComponent } from './pages/shorts/shorts.component';
import { ShortComponent } from './pages/short/short.component';
import { OnscreenComponent } from './pages/onscreen/onscreen.component';
import { ScreenComponent } from './pages/screen/screen.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
// import { AuthGuard } from './services/auth.guard';
// import { EditorGuard } from './services/editor.guard';
import { AdminGuard } from './services/admin.guard';
import { AdminComponent } from './pages/admin/admin.component';

import { AboutComponent } from './pages/about/about.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { 'path': '', component: HomeComponent },
  { 'path': 'books', component: BooksComponent},
  { 'path': 'books/:type/:slug', component: BookComponent},
  { 'path': 'stories', component: ShortsComponent},
  { 'path': 'stories/:type/:slug', component: ShortComponent},
  { 'path': 'onscreen', component: OnscreenComponent},
  { 'path': 'movie/:slug', component: ScreenComponent },
  { 'path': 'tv/:slug', component: ScreenComponent },
  { 'path': 'about', component: AboutComponent},
  { 'path': 'settings', component: SettingsComponent},
  { 'path': 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  { 'path': '**',component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: environment.useHash})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
