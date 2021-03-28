import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service'
import { Onscreen } from '../../models/Onscreen'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-onscreen',
	templateUrl: './onscreen.component.html',
	styleUrls: ['./onscreen.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class OnscreenComponent implements OnInit {
	screens: Array<Onscreen> = [];
	filtered_screens: Array<Onscreen>;
	screensTotalCount: number = 0;
	screensWatchedCount: number = 0;
	screensFilterdCount: number;
	previewScreen;
	expandId: number = 0;
	loadingState = true;
	subscription: Subscription;
	searchValue: string = '';
	filterOnscreenType: string = '';

	private filter_screens: any = {
		watched: 'all',
		read: 'all',
		type: false,
	};

	public sorting_screens: string = 'year';
	public onscreen_layout: string = 'grid';

	constructor(private route: ActivatedRoute,public lib: LibraryService, private seo: SeoService, private modalService: NgbModal) { }

	ngOnInit() {
		this.seo.generateTags({
			title: 'Екранизации | Стивън Кинг',
			description: 'Основната литература включваща предимно романи и новели побликувани като самостоятелни книги, както и нехудожествената литература на Краля',
			image: 'https://stephen-king.info/assets/img/home_screens.jpg',
			slug: 'screens'
		});
		this.route.paramMap.subscribe(params => {
			this.filterOnscreenType = this.lib.urlTypeRevert(params.get('type'));
		});
		if(this.filterOnscreenType) {
			this.filter_screens.type = this.filterOnscreenType;
		} else {
			if (sessionStorage.getItem('filter_screens') !== null) {
				this.filter_screens = JSON.parse(sessionStorage.getItem('filter_screens'));
			}
			if (sessionStorage.getItem('sorting_screens') !== null) {
				this.sorting_screens = sessionStorage.getItem('sorting_screens');
			}
		}
		if (localStorage.getItem('onscreen_layout') !== null) {
			this.onscreen_layout = localStorage.getItem('onscreen_layout');
		}
		let screens$ = this.lib.getOnscreens();
		this.subscription = screens$.subscribe(screens => {
			this.screens = Object.values(screens);
			this.screensTotalCount = this.screens.length;
			this.filterScreens();
			this.changeSorting(this.sorting_screens)
			this.loadingState = false
		});
		this.updateWatchedCounter();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.modalService.dismissAll();
	}

	resetFilter() {
		this.filter_screens = {
			watched: 'all',
			read: 'all',
			type: false,
		}
		this.filterScreens();
		this.filterOnscreenType = '';
		window.history.replaceState('', '', '/onscreen');
	}

	filterScreens() {
		return this.filtered_screens = this.screens.filter(screen => !(
			(this.filter_screens.type &&  this.filter_screens.type.match(/movie|Филм/) && !this.lib.isMovie(screen))
			|| (this.filter_screens.type && this.filter_screens.type.match(/series|Сериал/) && !this.lib.isSeries(screen))
			|| (this.filter_screens.type &&  this.filter_screens.type.match(/episodes|Епизод/) && !this.lib.isEpisode(screen))
			|| (this.searchValue.trim() != '' && (JSON.stringify(screen).toLowerCase().indexOf(this.searchValue.toLowerCase().trim()) <= -1))
			)
		).filter(screen => (
			this.filter_screens.read == 'all'
			|| (this.filter_screens.read != 'all' && (
					(screen.shorts.length && screen.shorts.filter(short => (this.lib.isShortRead(short) == this.filter_screens.read)).length > 0)
					|| (screen.books.length && screen.books.filter(book => (this.lib.isBookRead(book) == this.filter_screens.read)).length > 0))
				)
		));
	}

	hasfilter() {
		return this.filter_screens.read != 'all'
		|| this.filter_screens.type != false ? true : false;
	}

	openBookModal(content) {
		this.modalService.open(content, { size: 'xl', centered: true, scrollable: true }).result.then(
		() => {},
		(onClose) => {this.updateWatchedCounter()});
	}

	public updateSearch(searchTextValue: string) {
		this.searchValue = searchTextValue;
		this.filterScreens();
		this.changeSorting(this.sorting_screens)
	}

	changeLayout(layout) {
		this.onscreen_layout = layout;
		localStorage.setItem('onscreen_layout', this.onscreen_layout)
	}

	letLayout() {
		return this.onscreen_layout;
	}

	changeSorting(key) {
		this.sorting_screens = key;
		this.filtered_screens = this.lib.sortObject(this.filtered_screens, key);
		sessionStorage.setItem('sorting_screens', this.sorting_screens)
	}

	getSorting() {
		return this.sorting_screens;
	}

	changeFilter(key, value) {
		this.filter_screens[key] = value;
		sessionStorage.setItem('filter_screens', JSON.stringify(this.filter_screens));
		this.filterScreens();
		this.changeSorting(this.sorting_screens)
	}

	getFilter(key) {
		return this.filter_screens !== null && this.filter_screens[key] !== null ? this.filter_screens[key] : false;
	}

	updateWatchedCounter() {
		// this.screensWatchedCount = this.lib.screensWatchedCount();
	}

}
