import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Onscreen } from '../../models/Onscreen';
import { SeoService } from 'src/app/services/seo.service';
import { TMDbService } from 'src/app/services/tmdb.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-screen',
	templateUrl: './screen.component.html',
	styleUrls: ['./screen.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ScreenComponent implements OnInit {
	@Input() slug: string;
	@Input() screen$: Onscreen;
	cast_crew;
	subscriptionCastCrew: Subscription;
	screen: Onscreen;
	youtubeId:string = '';
	cast_limit: number = 8;
	crew_limit: number = 4;

	constructor(private route: ActivatedRoute, public lib: LibraryService, private seo: SeoService, private modalService: NgbModal, private TMDb: TMDbService) { }

	ngOnInit() {

		if (this.slug == null) {
			this.route.paramMap.subscribe(params => {
				this.slug = params.get('slug');
			});
		}
		if (this.screen$ == null) {
			this.lib.getOnscreens().subscribe(onscreens => {
				this.screen = Object.values(onscreens).filter(screen => screen.slug == this.slug)[0];
				if(!this.screen) {
					this.screen = Object.values(onscreens).filter(screen => this.lib.seoUrl(screen.title) == this.slug)[0];
				}
				let connections = [];
				if(this.screen.books.length) {
					this.screen.books.forEach(connection => {
						if(connection.connection_info != '') {
							connections.push(connection.connection_info);
						}
					});
				}
				if(this.screen.shorts.length) {
					this.screen.shorts.forEach(connection => {
						if(connection.connection_info != '') {
							connections.push(connection.connection_info);
						}
					});
				}
				this.seo.generateTags({
					title: `${this.screen.title} `+(this.screen.year && this.screen.year < '9000' ? '('+this.screen.year +') ' : '')+`| ${this.screen.type} | Стивън Кинг`,
					description: [...new Set(connections)].join(' | '),
					image: this.screen.poster ? `${this.screen.onscreen_id}` : ``,
					slug: this.slug
				});
				this.getCastAndCrew();
			})
		} else {
			this.screen = this.screen$;
			this.getCastAndCrew();
		}

	}

	ngOnDestroy(): void {
		if(this.subscriptionCastCrew) {
			this.subscriptionCastCrew.unsubscribe();
		}
	}

	getCastAndCrew() {
		// Cast & Crue
		if(this.screen.tmdb_id) {
			if(this.screen.tmdb_id.indexOf("tv") > -1)  {
				let cast_crew$ = this.TMDb.requestData(this.screen.tmdb_id+'/aggregate_credits',['language=bg-BG']);
				this.subscriptionCastCrew = cast_crew$.subscribe(cast_crew => {
					this.cast_crew = cast_crew;
				});
			}
			if(this.screen.tmdb_id.indexOf("movie") > -1)  {
				let cast_crew$ = this.TMDb.requestData(this.screen.tmdb_id+'/credits',['language=bg-BG']);
				this.subscriptionCastCrew = cast_crew$.subscribe(cast_crew => {
					this.cast_crew = cast_crew;
				});
			}
		}
	}

	showAllCast() {
		this.cast_limit = 99999;
	}

	showAllCrew() {
		this.crew_limit = 99999;
	}

	returnStyle() {
	 	return "background-image: url('https://i.ytimg.com/vi/"+this.screen.trailer.split('|')[0]+"/hqdefault.jpg')";
	}

	openPlayerModal(content) {
		this.modalService.open(content, { size: 'xl', centered: true, scrollable: true , windowClass: 'videoModal'});
	}
}
