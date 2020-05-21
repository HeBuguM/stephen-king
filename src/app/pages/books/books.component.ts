import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LibraryService } from '../../services/library.service'
import { Title } from '@angular/platform-browser';
import { Book } from '../../models/Book'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BooksComponent implements OnInit {
  books:Book[] = [];
  booksTotalCount:number = 0;
  booksReadCount:number = 0;
  previewBook;
  expandBook: number = 0;
  loadingState = true;
  subscription: Subscription;
  searchValue:string = '';

  private filter_books: any = {
    no_read: false,
    with_editions: false,
    no_editions: false,
    pseudonym: false,
    co_written: false,
    series: false,
    dark_tower: false,
    talisman: false,
    bill_hodges: false,
    shining: false,
    novel: false,
    novella: false,
    screenplay: false,
    collection: false,
    nonfiction: false
  };
  private sorting_books: string = 'published';

  constructor(public lib:LibraryService, private browser: Title, private modalService: NgbModal) { }

  ngOnInit() {
    this.browser.setTitle(`Стивън Кинг - Книги`);

    if (sessionStorage.getItem('filter_books') !== null) {
      this.filter_books = JSON.parse(sessionStorage.getItem('filter_books'));
    }
    if (sessionStorage.getItem('sorting_books') !== null) {
      this.sorting_books = sessionStorage.getItem('sorting_books');
    }

    let books$ = this.lib.getBooks();
    this.subscription = books$.subscribe(books => {
      this.books = books;
      this.booksTotalCount = books.length;
      if(this.sorting_books != 'published') {
        this.changeSorting(this.sorting_books)
      }
      this.loadingState = false
    });
    this.booksReadCount = this.booksRead();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  open(content) {
    this.modalService.open(content, { size: 'xl' });
  }

  public updateSearch(searchTextValue: string) {
    this.searchValue = searchTextValue;
  }

  changeSorting(key) {
    this.sorting_books = key;
    this.books = this.lib.sortObject(this.books,key);
    sessionStorage.setItem('sorting_books', this.sorting_books)
  }

  getSorting() {
    return this.sorting_books;
  }

  changeFilter(key,value) {
    this.filter_books[key] = value;
    sessionStorage.setItem('filter_books', JSON.stringify(this.filter_books));
  }

  getFilteredBooks() {
    return this.books.filter(book => !((this.filter_books.no_read === true && this.isRead(book.book_id))
    || (this.filter_books.pseudonym && book.pseudonym == "")
    || (this.filter_books.co_written && book.co_writers == "")
    || (this.filter_books.series && book.series_name == "")
    || (this.filter_books.dark_tower && book.series_name != "The Dark Tower")
    || (this.filter_books.talisman && book.series_name != "The Talisman")
    || (this.filter_books.bill_hodges && book.series_name != "Bill Hodges")
    || (this.filter_books.shining && book.series_name != "The Shining")
    || (this.filter_books.novel && book.type != "Роман")
    || (this.filter_books.novella && book.type != "Новела")
    || (this.filter_books.screenplay && book.type != "Сценарий")
    || (this.filter_books.collection && book.type != "Сборник")
    || (this.filter_books.nonfiction && book.type != "Нехудожествена")
    || (this.filter_books.with_editions && book.editions.length === 0)
    || (this.filter_books.no_editions && book.editions.length > 0)
    || (this.searchValue != '' && (JSON.stringify(book).toLowerCase().indexOf(this.searchValue.toLowerCase()) <= -1))))
  }

  getFilter(key) {
    return this.filter_books !== null && this.filter_books[key] !== null ? this.filter_books[key] : false;
  }

  bookClasses (book) {
    let classes = {
      book: true,
      'table-success': this.isRead(book.book_id)
    }
    return classes;
  }

  bookShowStatus(book) {
    return (this.filter_books.no_read === true && this.isRead(book.book_id))
    || (this.filter_books.pseudonym && book.pseudonym == "")
    || (this.filter_books.co_written && book.co_writers == "")
    || (this.filter_books.series && book.series_name == "")
    || (this.filter_books.dark_tower && book.series_name != "The Dark Tower")
    || (this.filter_books.talisman && book.series_name != "The Talisman")
    || (this.filter_books.bill_hodges && book.series_name != "Bill Hodges")
    || (this.filter_books.shining && book.series_name != "The Shining")
    || (this.filter_books.novel && book.type != "Роман")
    || (this.filter_books.novella && book.type != "Новела")
    || (this.filter_books.screenplay && book.type != "Сценарий")
    || (this.filter_books.collection && book.type != "Сборник")
    || (this.filter_books.nonfiction && book.type != "Нехудожествена")
    || (this.filter_books.with_editions && book.editions.length === 0)
    || (this.filter_books.no_editions && book.editions.length > 0)
    || (this.searchValue != '' && (JSON.stringify(book).toLowerCase().indexOf(this.searchValue.toLowerCase()) <= -1));
  }

  editionClasses (edition) {
    let classes = {
      'edition': true,
      'edition-expanded': edition.book_id == this.expandBook
    }
    return classes;
  }

  countBookEditions (editions) {
    return editions.length;
  }

  bookToggle (book,new_state) {
    var readBooks = localStorage.getItem("read_books") !== null ? JSON.parse(localStorage.getItem("read_books")) : {};
    readBooks[book.book_id] = new_state;
    localStorage.setItem("read_books", JSON.stringify(readBooks));
    this.booksReadCount = this.booksRead();
  }

  selectBookEdition (edition) {
    var selectedEditions = localStorage.getItem("selected_editions") !== null ? JSON.parse(localStorage.getItem("selected_editions")) : {};
    selectedEditions[edition.book_id] = edition.group_id;
    localStorage.setItem("selected_editions", JSON.stringify(selectedEditions));
  }

  unselectBookEdition(edition) {
    var selectedEditions = localStorage.getItem("selected_editions") !== null ? JSON.parse(localStorage.getItem("selected_editions")) : {};
    delete selectedEditions[edition.book_id];
    localStorage.setItem("selected_editions", JSON.stringify(selectedEditions));
  }

  isRead(id) {
    if(localStorage.getItem("read_books") !== null) {
      var readBooks = JSON.parse(localStorage.getItem("read_books"));
      if(readBooks[id] === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  hasSelectedEdition(edition) {
    if(localStorage.getItem("selected_editions") !== null) {
      var selectedEditions = JSON.parse(localStorage.getItem("selected_editions"));
      if(selectedEditions[edition.book_id] !== undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isEditionSelected(edition) {
    if(localStorage.getItem("selected_editions") !== null) {
      var selectedEditions = JSON.parse(localStorage.getItem("selected_editions"));
      if(selectedEditions[edition.book_id] === edition.group_id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  booksRead() {
    let booksRead = 0;
    if(localStorage.getItem("read_books") !== null) {
      const readBooks = JSON.parse(localStorage.getItem("read_books"));
      booksRead = Object.values(readBooks).filter(read => read === true).length
    } else {
      booksRead = 0;
    }
    return booksRead;
  }

}
