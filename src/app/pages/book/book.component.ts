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
	@Input() slug: string;
	@Input() book$: Book;
	book: Book;

	constructor(private route: ActivatedRoute, public lib: LibraryService, private seo: SeoService) { }

	ngOnInit() {
		if (this.slug == null) {
			this.route.paramMap.subscribe(params => {
				this.slug = params.get('slug');
			});
		}
		if (this.book$ == null) {
			this.lib.getBooks().subscribe(books => {
				this.book = Object.values(books).filter(book => this.lib.seoUrl(book.title) == this.slug)[0];
				this.seo.generateTags({
					title: `Стивън Кинг - ${this.book.title}`,
					description: this.book.synopsis,
					image: `https://stephen-king.info/assets/covers/books/large/${this.book.book_id}.jpg`,
					slug: this.slug
				});
			})
		} else {
			this.book = this.book$;
		}

	}
}
