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
	short: Short;
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
		this.lib.getShorts(this.slug).subscribe(shorts => {
			this.short = Object.values(shorts)[0];
			this.loadingState = false;
			if(this.changeSeoTags == true) {
				let bg_titles = [];
				if(this.short.editions.length) {
					this.short.editions.forEach(edition => {
						bg_titles.push(edition.title);
					});
				}
				this.seo.generateTags({
					title: `${this.short.title} ` +(bg_titles.length ? ' ('+ [...new Set(bg_titles)].join(' / ')+ ')' : '')+` | Стивън Кинг`,
					description: `${this.short.type}` + (this.short.synopsis ? this.short.synopsis : ((this.short.first_collected ? ` | ${this.short.collection_title} (Сборник)` : '')+(this.short.first_pub_in ? ` | Първа публикация: ${this.short.first_pub_in}` : ''))),
					image: this.short.first_collected ? `https://stephen-king.info/assets/covers/shorts/large/${this.short.short_id}.jpg` : ``,
					slug: this.slug
				});
			}
		})
	}

	openPlayerModal(content) {
		this.modalService.open(content, { size: 'xl', centered: true, scrollable: true , windowClass: 'videoModal'});
	}
}
