import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service';

import { Short } from '../../models/Short';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-short',
	templateUrl: './short.component.html',
	styleUrls: ['./short.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ShortComponent implements OnInit {
	@Input() slug: string;

	@Input() short$: Short;
	short: Short;

	constructor(private route: ActivatedRoute, public lib: LibraryService, private seo: SeoService) { }

	ngOnInit() {

		if (this.slug == null) {
			this.route.paramMap.subscribe(params => {
				// this.type = params.get('type');
				this.slug = params.get('slug');
			});
		}
		if (this.short$ == null) {
			this.lib.getShorts().subscribe(shorts => {
				this.short = Object.values(shorts).filter(short => this.lib.seoUrl(short.title) == this.slug)[0];
				this.seo.generateTags({
					title: `Стивън Кинг - ${this.short.title}`,
					description: this.short.synopsis,
					image: this.short.first_collected ? `https://stephen-king.info/assets/covers/shorts/large/${this.short.short_id}.jpg` : ``,
					slug: this.slug
				});
			})
		} else {
			this.short = this.short$;
		}

	}
}
