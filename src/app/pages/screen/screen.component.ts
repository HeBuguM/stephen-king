import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Onscreen } from '../../models/Onscreen';
import { SeoService } from 'src/app/services/seo.service';
import { TMDbService } from 'src/app/services/tmdb.service';
import { range, Subscription } from 'rxjs';

@Component({
	selector: 'app-screen',
	templateUrl: './screen.component.html',
	styleUrls: ['./screen.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ScreenComponent implements OnInit {
	@Input() slug: string;
	screen: Onscreen;
	youtubeId:string = '';
	loadingState = true;

	cast_crew;
	subscriptionCastCrew: Subscription;
	cast_limit: number = 8;
	crew_limit: number = 4;

	subscriptionSeason: Subscription;
	season;
	selected_season: number = 1;

	constructor(private route: ActivatedRoute, public lib: LibraryService, private seo: SeoService, private modalService: NgbModal, private TMDb: TMDbService) { }

	ngOnInit() {
		if (this.slug == null) {
			this.route.paramMap.subscribe(params => {
				this.slug = params.get('slug');
			});
		}
		this.lib.getOnscreens(this.slug).subscribe(onscreens => {
			this.screen = Object.values(onscreens)[0];
			this.loadingState = false;
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
				title: `${this.screen.title} `+(this.screen.year ? '('+this.screen.year +') ' : '')+`| ${this.screen.type} | Стивън Кинг`,
				description: [...new Set(connections)].join(' | '),
				image: this.screen.poster ? `${this.screen.onscreen_id}` : ``,
				slug: this.slug
			});
			this.getCastAndCrew();
			this.getSeason();
		})
	}

	ngOnDestroy(): void {
		if(this.subscriptionCastCrew) {this.subscriptionCastCrew.unsubscribe();	}
		if(this.subscriptionSeason) {this.subscriptionSeason.unsubscribe();	}
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

	getSeason() {
		if(this.screen.tmdb_id) {
			if(this.screen.tmdb_id.indexOf("tv") > -1)  {
				let season$ = this.TMDb.requestData(this.screen.tmdb_id+'/season/'+this.selected_season);
				this.subscriptionSeason = season$.subscribe(season => {
					this.season = season;
				});
			}
		}
	}

	seasonsRange() {
		return new Array(this.screen.seasons);
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
