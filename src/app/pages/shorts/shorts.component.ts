import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { LibraryService } from '../../services/library.service'
import { Short } from '../../models/Short'
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-shorts',
	templateUrl: './shorts.component.html',
	styleUrls: ['./shorts.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ShortsComponent implements OnInit {
	shorts: Array<Short>;
	filtered_shorts: Array<Short>;
	expandId: number = 0;
	public shortsTotalCount: number;
	public shortsReadCount: number;
	public shortsPublishedBGCount;

	subscription: Subscription;
	searchValue: string = '';
	loadingState = true;

	private filter_shorts: any = {
		read: 'all',
		bg_editions: 'all',
		collected: 'all',
		read_collection: false,
		type: false
	};
	private sorting_shorts: string = 'first_pub_date';

	constructor(public lib: LibraryService, private browser: Title) { }

	ngOnInit() {
		this.browser.setTitle(`Стивън Кинг - Разкази`)
		if (sessionStorage.getItem('filter_shorts') !== null) {
			this.filter_shorts = JSON.parse(sessionStorage.getItem('filter_shorts'));
		}
		if (sessionStorage.getItem('sorting_shorts') !== null) {
			this.sorting_shorts = sessionStorage.getItem('sorting_shorts');
		}
		let shorts$ = this.lib.getShorts();
		this.subscription = shorts$.subscribe(shorts => {
			this.shorts = shorts;
			this.shortsTotalCount = shorts.length;
			this.filterShorts();
			if (this.sorting_shorts != 'first_pub_date') {
				this.changeSorting(this.sorting_shorts)
			}
			this.loadingState = false;
		});
		this.shortsReadCount = this.lib.shortsReadCount();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	filterShorts() {
		return this.filtered_shorts = this.shorts.filter(short => !(
			(this.filter_shorts.read != 'all' && (this.lib.isShortRead(short) == !this.filter_shorts.read))
			|| (this.filter_shorts.read_collection && !this.lib.isShortCollectionRead(short))
			|| (this.filter_shorts.bg_editions !== 'all' && !(this.filter_shorts.bg_editions ? short.editions.length > 0 : short.editions.length === 0))
			|| (this.filter_shorts.collected !== 'all' && !(this.filter_shorts.collected ? short.books.length > 0 : short.books.length === 0))
			|| (this.filter_shorts.type && short.type != this.filter_shorts.type)
			|| (this.searchValue != '' && (JSON.stringify(short).toLowerCase().indexOf(this.searchValue.toLowerCase()) <= -1))
			)
		);
	}

	public updateSearch(searchTextValue: string) {
		this.searchValue = searchTextValue;
		this.filterShorts();
	}

	changeSorting(key) {
		this.sorting_shorts = key;
		this.filtered_shorts = this.lib.sortObject(this.filtered_shorts, key);
		sessionStorage.setItem('sorting_shorts', this.sorting_shorts)
	}

	getSorting() {
		return this.sorting_shorts;
	}

	changeFilter(key, value) {
		this.filter_shorts[key] = value;
		sessionStorage.setItem('filter_shorts', JSON.stringify(this.filter_shorts));
		console.log(this.filter_shorts);
		this.filterShorts();
	}

	getFilter(key) {
		return this.filter_shorts !== null && this.filter_shorts[key] !== null ? this.filter_shorts[key] : false;
	}

	shortClasses(short) {
		let classes = {
			short: true,
			'table-success': this.lib.isShortRead(short),
			'expanded': short.short_id == this.expandId
		}
		return classes;
	}

	isExpanded(short) {
		return this.expandId == short.short_id;
	}

	updateReadCounter() {
		this.shortsReadCount = this.lib.shortsReadCount();
	}

}