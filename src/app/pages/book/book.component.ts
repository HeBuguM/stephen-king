import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
	book: Book;
	youtubeId:string = '';
	changeSeoTags: boolean = false;
	loadingState = true;

	constructor(private route: ActivatedRoute, public lib: LibraryService, private seo: SeoService, private modalService: NgbModal) { }

	ngOnInit() {
		if (this.slug == null) {
			this.route.paramMap.subscribe(params => {
				this.slug = params.get('slug');
			});
			this.changeSeoTags = true;
		}
		this.lib.getBooks(this.slug).subscribe(books => {
			this.book = Object.values(books)[0];
			this.loadingState = false;
			if(this.changeSeoTags == true) {
				let bg_titles = [];
				if(this.book.editions.length) {
					this.book.editions.forEach(edition => {
						bg_titles.push(edition.title.split(/–|\(|\, част/)[0].trim());
					});
				}
				this.seo.generateTags({
					title: `${this.book.title} `+(bg_titles.length ? ' ('+ [...new Set(bg_titles)].join(' / ')+ ')' : '')+` | Стивън Кинг`,
					description: `${this.book.type}` + (this.book.synopsis ? ` | `+ this.book.synopsis : ""),
					image: `https://stephen-king.info/assets/covers/books/large/${this.book.book_id}.jpg`,
					slug: this.slug
				});
			}
		});
	}

	openPlayerModal(content) {
		this.modalService.open(content, { size: 'xl', centered: true, scrollable: true , windowClass: 'videoModal'});
	}
}
