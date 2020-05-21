import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { Title } from '@angular/platform-browser';

import { Book } from '../../models/Book';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BookComponent implements OnInit {
  @Input() bookId: string;
  @Input() book$: Book;
  book: Book;

  constructor(private route: ActivatedRoute, public lib: LibraryService, private browser: Title) { }

  ngOnInit() {
    if(this.bookId == null) {
      this.route.paramMap.subscribe(params => {
        this.bookId = params.get('bookId');
      });
    }
    if(this.book$ == null) {
      this.lib.getBooks().subscribe(books => {
        this.book = books.filter(book => book.book_id == Number(this.bookId))[0];
        this.browser.setTitle(`Стивън Кинг - ${this.book.title}`)
      })
    } else {
      this.book = this.book$;
    }

  }
}
