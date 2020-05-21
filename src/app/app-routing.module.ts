import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './pages/books/books.component';
import { BookComponent } from './pages/book/book.component';
import { ShortsComponent } from './pages/shorts/shorts.component';
// import { AuthGuard } from './services/auth.guard';
// import { EditorGuard } from './services/editor.guard';
import { AdminGuard } from './services/admin.guard';
import { AdminComponent } from './pages/admin/admin.component';

import { environment } from 'src/environments/environment';

const routes: Routes = [
  { 'path': '', component: BooksComponent },
  { 'path': 'books', component: BooksComponent},
  { 'path': 'book/:bookId', component: BookComponent},
  { 'path': 'shorts', component: ShortsComponent},
  { 'path': 'admin', component: AdminComponent, canActivate: [AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: environment.useHash})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
