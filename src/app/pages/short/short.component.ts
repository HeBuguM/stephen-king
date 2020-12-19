import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
	youtubeId:string = '';

	constructor(private route: ActivatedRoute, public lib: LibraryService, private seo: SeoService, private modalService: NgbModal) { }

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

	openPlayerModal(content) {
		this.modalService.open(content, { size: 'xl', centered: true, scrollable: true , windowClass: 'videoModal'}).result.then(
		() => {});
	}
}
