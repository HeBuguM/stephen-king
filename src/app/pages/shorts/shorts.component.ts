import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../services/library.service'
import { Short } from '../../models/Short'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-shorts',
	templateUrl: './shorts.component.html',
	styleUrls: ['./shorts.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ShortsComponent implements OnInit {
	shorts: Array<Short>;
	filtered_shorts: Array<Short>;
	shortsTotalCount: number = 0;
	shortsReadCount: number = 0;
	shortsPublishedBGCount;
	previewShort;
	expandId: number = 0;
	subscription: Subscription;
	searchValue: string = '';
	loadingState = true;
	filterShortType: string = '';
	shorts_sort_by: string = localStorage.getItem('shorts_sort_by') !== null ? localStorage.getItem('shorts_sort_by') : 'first_pub_date';
	shorts_sort_order: string = localStorage.getItem('shorts_sort_order') !== null ? localStorage.getItem('shorts_sort_order') : 'asc';

	private filter_shorts: any = {
		read: 'all',
		bg_editions: 'all',
		collected: 'all',
		read_collection: false,
		type: false
	};

	constructor(private route: ActivatedRoute,public lib: LibraryService, private seo: SeoService,private modalService: NgbModal) { }

	ngOnInit() {
		this.seo.generateTags({
			title: 'Разкази | Стивън Кинг',
			description: 'Всички кратки произведения на Кинг, включвани или не в сборници, с изключение на новелите публикувани като самостоятелни книги',
			image: 'https://stephen-king.info/assets/img/home_shorts.jpg',
			slug: 'shorts'
		});
		this.route.paramMap.subscribe(params => {
			this.filterShortType = this.lib.urlTypeRevert(params.get('type'));
		});
		if(this.filterShortType) {
			this.filter_shorts.type = this.filterShortType;
		} else {
			if (sessionStorage.getItem('filter_shorts') !== null) {
				this.filter_shorts = JSON.parse(sessionStorage.getItem('filter_shorts'));
			}
		}
		let shorts$ = this.lib.getShorts();
		this.subscription = shorts$.subscribe(shorts => {
			this.shorts = Object.values(shorts);
			this.shortsTotalCount = this.shorts.length;
			this.filterShorts();
			this.changeSorting()
			this.loadingState = false;
		});
		this.shortsReadCount = this.lib.shortsReadCount();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.modalService.dismissAll();
	}

	filterShorts() {
		return this.filtered_shorts = this.shorts.filter(short => !(
			(this.filter_shorts.read != 'all' && (this.lib.isShortRead(short) == !this.filter_shorts.read))
			|| (this.filter_shorts.read_collection && !this.lib.isShortCollectionRead(short))
			|| (this.filter_shorts.bg_editions !== 'all' && !(this.filter_shorts.bg_editions ? short.editions.length > 0 : short.editions.length === 0))
			|| (this.filter_shorts.collected !== 'all' && !(this.filter_shorts.collected ? short.books.length > 0 : short.books.length === 0))
			|| (this.filter_shorts.type && short.type != this.filter_shorts.type)
			|| (this.searchValue.trim() != '' && (JSON.stringify(short).toLowerCase().indexOf(this.searchValue.toLowerCase().trim()) <= -1))
			)
		);
	}

	resetFilter() {
		this.filter_shorts = {
			read: 'all',
			bg_editions: 'all',
			collected: 'all',
			read_collection: false,
			type: false
		}
		this.filterShorts();
		this.filterShortType = '';
		window.history.replaceState('', '', '/stories');
	}

	hasfilter() {
		return this.filter_shorts.read != 'all'
		|| this.filter_shorts.read_collection != false
		|| this.filter_shorts.collected != 'all'
		|| this.filter_shorts.type
		|| this.filter_shorts.bg_editions != 'all' ? true : false;
	}

	public updateSearch(searchTextValue: string) {
		this.searchValue = searchTextValue;
		this.filterShorts();
		this.changeSorting();
	}

	changeSorting() {
		this.filtered_shorts = this.lib.sortObject(this.filtered_shorts, this.shorts_sort_by, this.shorts_sort_order);
		localStorage.setItem('shorts_sort_by', this.shorts_sort_by);
		localStorage.setItem('shorts_sort_order', this.shorts_sort_order);
	}

	getSorting() {
		return this.shorts_sort_by;
	}

	changeFilter(key, value) {
		this.filter_shorts[key] = value;
		sessionStorage.setItem('filter_shorts', JSON.stringify(this.filter_shorts));
		this.filterShorts();
		this.changeSorting();
	}

	getFilter(key) {
		return this.filter_shorts !== null && this.filter_shorts[key] !== null ? this.filter_shorts[key] : false;
	}

	shortClasses(short) {
		let classes = {
			short: true,
			'table-success': this.lib.isShortRead(short),
			'expanded': short.short_id == this.expandId,
			'expandable': short.short_id != this.expandId
		}
		return classes;
	}

	isExpanded(short) {
		return this.expandId == short.short_id;
	}

	updateReadCounter() {
		this.shortsReadCount = this.lib.shortsReadCount();
	}

	openShortModal(content) {
		this.modalService.open(content, { size: 'xl', centered: true, scrollable: true }).result.then(
		() => {},
		(onClose) => {this.updateReadCounter()});
	}

}
