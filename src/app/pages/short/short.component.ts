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
	@Input() shortId: string;
	@Input() short$: Short;
	short: Short;

	constructor(private route: ActivatedRoute, public lib: LibraryService, private seo: SeoService) { }

	ngOnInit() {

		if (this.shortId == null) {
			this.route.paramMap.subscribe(params => {
				this.shortId = params.get('shortId');
			});
		}
		if (this.short$ == null) {
			this.lib.getShorts().subscribe(shorts => {
				this.short = Object.values(shorts).filter(short => short.short_id == Number(this.shortId))[0];
				this.seo.generateTags({
					title: `Стивън Кинг - ${this.short.title}`,
					description: this.short.synopsis,
					image: this.short.first_collected ? `https://hebugum.github.io/stephen-king/assets/covers/shorts/large/${this.short.short_id}.jpg` : ``,
					slug: 'short'
				});
			})
		} else {
			this.short = this.short$;
		}

	}
}
