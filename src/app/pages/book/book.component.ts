import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service';

import { Book } from '../../models/Book';
import { SeoService } from 'src/app/services/seo.service';

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

	constructor(private route: ActivatedRoute, public lib: LibraryService, private seo: SeoService) { }

	ngOnInit() {
		if (this.bookId == null) {
			this.route.paramMap.subscribe(params => {
				this.bookId = params.get('bookId');
			});
		}
		if (this.book$ == null) {
			this.lib.getBooks().subscribe(books => {
				this.book = Object.values(books).filter(book => book.book_id == Number(this.bookId))[0];
				this.seo.generateTags({
					title: `Стивън Кинг - ${this.book.title}`,
					description: this.book.synopsis,
					image: `https://hebugum.github.io/stephen-king/assets/covers/books/large/${this.book.book_id}.jpg`,
					slug: 'book'
				});
			})
		} else {
			this.book = this.book$;
		}

	}
}
