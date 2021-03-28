import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service'
import { Book } from '../../models/Book'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-books',
	templateUrl: './books.component.html',
	styleUrls: ['./books.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class BooksComponent implements OnInit {
	books: Array<Book> = [];
	filtered_books: Array<Book>;
	booksTotalCount: number = 0;
	booksReadCount: number = 0;
	booksFilterdCount: number;
	previewBook;
	expandId: number = 0;
	loadingState = true;
	subscription: Subscription;
	searchValue: string = '';
	filterBookType: string = '';

	private filter_books: any = {
		read: 'all',
		pseudonym: false,
		co_written: false,
		series_name: false,
		type: false,
		bg_editions: 'all'
	};

	public sorting_books: string = 'published';

	constructor(private route: ActivatedRoute,public lib: LibraryService, private seo: SeoService, private modalService: NgbModal) { }

	ngOnInit() {
		this.seo.generateTags({
			title: 'Книги | Стивън Кинг',
			description: 'Основната литература включваща предимно романи и новели побликувани като самостоятелни книги, както и нехудожествената литература на Краля',
			image: 'https://stephen-king.info/assets/img/home_books.jpg',
			slug: 'books'
		});
		this.route.paramMap.subscribe(params => {
			this.filterBookType = this.lib.urlTypeRevert(params.get('type'));
		});
		if(this.filterBookType) {
			this.filter_books.type = this.filterBookType;
		} else {
			if (sessionStorage.getItem('filter_books') !== null) {
				this.filter_books = JSON.parse(sessionStorage.getItem('filter_books'));
			}
			if (sessionStorage.getItem('sorting_books') !== null) {
				this.sorting_books = sessionStorage.getItem('sorting_books');
			}
		}
		let books$ = this.lib.getBooks();
		this.subscription = books$.subscribe(books => {
			this.books = Object.values(books);
			this.booksTotalCount = this.books.length;
			this.filterBooks();
			this.changeSorting(this.sorting_books)
			this.loadingState = false
		});
		this.updateReadCounter();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.modalService.dismissAll();
	}

	filterBooks() {
		return this.filtered_books = this.books.filter(book => !(
			(this.filter_books.read != 'all' && (this.lib.isBookRead(book) == !this.filter_books.read))
			|| (this.filter_books.pseudonym && book.pseudonym == "")
			|| (this.filter_books.co_written && book.co_writers == "")
			|| (this.filter_books.series_name && book.series_name != this.filter_books.series_name)
			|| (this.filter_books.type && book.type != this.filter_books.type)
			|| (this.filter_books.bg_editions !== 'all' && !(this.filter_books.bg_editions ? book.editions.length > 0 : book.editions.length === 0))
			|| (this.searchValue.trim() != '' && (JSON.stringify(book).toLowerCase().indexOf(this.searchValue.toLowerCase().trim()) <= -1))
			)
		);
	}

	resetFilter() {
		this.filter_books = {
			read: 'all',
			pseudonym: false,
			co_written: false,
			series_name: false,
			type: false,
			bg_editions: 'all'
		};
		this.filterBooks();
		this.filterBookType = '';
		window.history.replaceState('', '', '/books');
	}

	hasfilter() {
		return this.filter_books.read != 'all'
		|| this.filter_books.pseudonym != false
		|| this.filter_books.co_written != false
		|| this.filter_books.series_name != false
		|| this.filter_books.type
		|| this.filter_books.bg_editions != 'all' ? true : false;
	}

	openBookModal(content) {
		this.modalService.open(content, { size: 'xl', centered: true, scrollable: true }).result.then(
		() => {},
		(onClose) => {this.updateReadCounter()});
	}

	public updateSearch(searchTextValue: string) {
		this.searchValue = searchTextValue;
		this.filterBooks();
		this.changeSorting(this.sorting_books)
	}

	changeSorting(key) {
		this.sorting_books = key;
		this.filtered_books = this.lib.sortObject(this.filtered_books, key);
		sessionStorage.setItem('sorting_books', this.sorting_books)
	}

	getSorting() {
		return this.sorting_books;
	}

	changeFilter(key, value) {
		this.filter_books[key] = value;
		sessionStorage.setItem('filter_books', JSON.stringify(this.filter_books));
		this.filterBooks();
		this.changeSorting(this.sorting_books)
	}

	getFilter(key) {
		return this.filter_books !== null && this.filter_books[key] !== null ? this.filter_books[key] : false;
	}

	bookClasses(book) {
		let classes = {
			book: true,
			'table-success': this.lib.isBookRead(book),
			'expanded': book.book_id == this.expandId,
			'expandable': book.book_id != this.expandId
		}
		return classes;
	}

	isExpanded(book) {
		return this.expandId == book.book_id;
	}

	updateReadCounter() {
		this.booksReadCount = this.lib.booksReadCount();
	}

}
