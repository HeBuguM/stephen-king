import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { LibraryService } from '../../services/library.service'
import { IMDbService } from '../../services/imdb.service'
import { TMDbService } from '../../services/tmdb.service'
import { MySQLService } from '../../services/mysql.service'
import { Title } from '@angular/platform-browser'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
	youtubeId:string = '';
	progress_info: string = '';

	// Pages
	showBooks = true;
	showEditions = false;
	showShorts = false;
	showScreens = false;
	showSitemap = false;

	// Forms
	showBooksForm = false;
	showEditionsForm = false;
	showShortsForm = false;
	showScreensForm = false;
	showBooksShortsForm = false;
	showEditionsShortsForm = false;
	showEditionsISBNsForm = false;
	showScreenConnectionForm = false;

	books$;
	editions$;
	shorts$;
	screens$;
	book_shorts$;
	edition_shorts$;
	edition_isbns$;
	onscreen_connections$;

	exportBooks = {};
	exportEditions = [];
	exportEditionShorts = [];
	exportShorts = [];
	exportScreens = [];
	finalBooks = [];
	finalShorts = [];
	finalScreens = [];

	exportJSONbooks: string;
	exportJSONshorts: string;
	exportJSONscreens: string;
	exportXMLsitemap: string;
	exportXMLsitemap_main: string;
	exportXMLsitemap_additional: string = '';

	bookForm = this.fb.group({
		book_id: [0, Validators.required],
		type: ['', Validators.required],
		title: ['', Validators.required],
		published: [''],
		publisher: [''],
		pages: [0],
		synopsis: [''],
		note: [''],
		alterations: [''],
		series_name: [''],
		series_no: [0],
		pseudonym: [''],
		co_writers: [''],
		wikipedia: [''],
		official_site: [''],
		goodreads: [0],
		upcoming: [0]
	});

	editionForm = this.fb.group({
		edition_id: [0, Validators.required],
		book_id: [0, Validators.required],
		language: ['bg'],
		group_id: [0],
		title: ['', Validators.required],
		published: [''],
		publisher: [''],
		pages: [0],
		translators: [''],
		narrators: [''],
		note: [''],
		goodreads: [0],
		upcoming: [0]
	});

	shortForm = this.fb.group({
		short_id: ['', Validators.required],
		type: [''],
		title: ['', Validators.required],
		subtitle: [''],
		first_pub_date: [''],
		first_pub_in: [''],
		first_collected: ['', Validators.required],
		synopsis: [''],
		note: [''],
		wikipedia: [''],
		official_site: [''],
		goodreads: [0],
		upcoming: [0]
	});

	screenForm = this.fb.group({
		onscreen_id: [0, Validators.required],
		title: ['', Validators.required],
		slug: ['', Validators.required],
		type: [''],
		status: [''],
		tmdb_id: [''],
		imdb_id: [''],
		imdb_rating: [0],
		imdb_votes: [0],
		year: [''],
		released: [''],
		rated: [''],
		runtime: [0],
		seasons: [0],
		episodes: [0],
		genres: [''],
		poster: [''],
		rotten_tomatoes: [0],
		metascore: [0],
		production: [''],
		network: [''],
		language: [''],
		country: [''],
		budget: [0],
		trailer: [0],
		wikipedia: [''],
		official_site: [''],
		upcoming: [0]
	});

	bookShortForm = this.fb.group({
		id: [0, Validators.required],
		book_id: ['', Validators.required],
		short_id: ['', Validators.required],
		position: [0]
	});

	editionShortForm = this.fb.group({
		id: [0, Validators.required],
		edition_id: ['', Validators.required],
		short_id: ['', Validators.required],
		title: ['', Validators.required],
		subtitle: [''],
		position: [0]
	});

	editionISBNForm = this.fb.group({
		id: [0, Validators.required],
		edition_id: ['', Validators.required],
		isbn: ['', Validators.required],
		info: ['']
	});

	screenConnectionForm = this.fb.group({
		id: [0, Validators.required],
		onscreen_id: ['', Validators.required],
		book_id: [''],
		short_id: [''],
		type: [''],
		info: ['']
	});

	constructor(
		public lib: LibraryService,
		private mysql: MySQLService,
		private browser: Title,
		public imdb: IMDbService,
		public tmdb: TMDbService,
		private fb: FormBuilder,
		private modalService: NgbModal
	) { }

	ngOnInit() {
		this.browser.setTitle(`Администрация - Стивън Кинг`);
		// this.loadData();
	}

	loadData(data = '') {
		if (data == 'books' || !data) {
			this.mysql.get('books',{'order': 'book_id'}).subscribe((data) => { this.books$ = data; });
		}
		if (data == 'editions' || !data) {
			this.mysql.get('editions',{'order': 'published'}).subscribe((data) => { this.editions$ = data; });
		}
		if (data == 'shorts' || !data) {
			this.mysql.get('shorts',{'order': 'first_pub_date'}).subscribe((data) => { this.shorts$ = data; });
		}
		if (data == 'screens' || !data) {
			this.mysql.get('onscreen',{'order': 'released'}).subscribe((data) => { this.screens$ = data; });
		}
		if (data == 'book_shorts' || !data) {
			this.mysql.get('book_shorts',{'order': 'position'}).subscribe((data) => { this.book_shorts$ = data; });
		}
		if (data == 'edition_shorts' || !data) {
			this.mysql.get('edition_shorts',{'order': 'position'}).subscribe((data) => { this.edition_shorts$ = data; });
		}
		if (data == 'onscreen_connections' || !data) {
			this.mysql.get('onscreen_connections',{'order': 'info'}).subscribe((data) => { this.onscreen_connections$ = data; });
		}
		if (data == 'edition_isbns' || !data) {
			this.mysql.get('edition_isbns').subscribe((data) => { this.edition_isbns$ = data; });
		}
	}

	changeSection(section) {
		this.showBooks = section == 'books' ? true : false;
		this.showEditions = section == 'editions' ? true : false;
		this.showShorts = section == 'shorts' ? true : false;
		this.showScreens = section == 'screens' ? true : false;
		this.showSitemap = section == 'sitemap' ? true : false;
	}

	openModal(content) {
		this.modalService.open(content, { size: 'lg', centered: true }).result.then(
			(result) => {},
			(onClose) => {
				this.showBooksForm = false;
				this.showEditionsForm = false;
				this.showShortsForm = false;
				this.showScreensForm = false;
				this.showBooksShortsForm = false;
				this.showEditionsShortsForm = false;
				this.showScreenConnectionForm = false;
				this.showEditionsISBNsForm = false;
			}
		);
	}

	editBook(data) {
		if(data !== null) {
			this.bookForm.patchValue(data);
		} else {
			this.bookForm.patchValue({
				book_id: 0,
				type: '',
				title: '',
				published: '',
				publisher: '',
				pages: 0,
				synopsis: '',
				note: '',
				alterations: '',
				series_name: '',
				series_no: 0,
				pseudonym: '',
				co_writers: '',
				wikipedia: '',
				official_site: '',
				goodreads: 0,
				upcoming: 0
			})
		}
		this.showBooksForm = true;
	}

	editShort(data) {
		if(data === null) {
			data = {
				short_id: 0,
				type: '',
				title: '',
				subtitle: '',
				first_pub_date: '',
				first_pub_in: '',
				first_collected: 0,
				synopsis: '',
				note: '',
				wikipedia: '',
				official_site: '',
				goodreads: 0,
				upcoming: 0
			}
		}
		this.shortForm.patchValue(data);
		this.showShortsForm = true;
	}

	editScreen(data) {
		if(data === null) {
			data = {
				onscreen_id: 0,
				title: '',
				slug:'',
				type: '',
				status: '',
				imdb_id: '',
				year: '',
				released: '',
				rated: '',
				runtime: 0,
				seasons: 0,
				episodes: 0,
				genres: '',
				poster: '',
				imdb_rating: 0,
				imdb_votes: 0,
				rotten_tomatoes: 0,
				metascore: 0,
				production: '',
				network: '',
				language: '',
				country: '',
				budget: 0,
				trailer: '',
				wikipedia: '',
				official_site: '',
				upcoming: 0
			}
		}
		this.screenForm.patchValue(data);
		this.showScreensForm = true;
	}

	editEdition(data) {
		// this.editionForm.reset();
		if(data === null) {
			data = {
				edition_id: 0,
				book_id: 0,
				language: 'bg',
				group_id: 0,
				title: '',
				published: '',
				publisher: '',
				pages: 0,
				translators: '',
				narrators: '',
				note: '',
				goodreads: 0,
				upcoming: 0
			}
		}
		this.editionForm.patchValue(data);
		this.showEditionsForm = true;
	}

	editBookShort(data) {
		if(data === null) {
			data = {
				id: 0,
				book_id: '',
				short_id: '',
				position: ''
			}
		}
		this.bookShortForm.patchValue(data);
		this.showBooksShortsForm = true;
	}

	editEditionShort(data) {
		if(data === null) {
			data = {
				id: 0,
				edition_id: '',
				short_id: '',
				title: '',
				subtitle: '',
				position: 0
			}
		}
		this.editionShortForm.patchValue(data);
		this.showEditionsShortsForm = true;
	}

	editEditionISBN(data) {
		if(data === null) {
			data = {
				id: 0,
				edition_id: '',
				isbn: '',
				info: ''
			}
		}
		this.editionISBNForm.patchValue(data);
		this.showEditionsISBNsForm = true;
	}

	editScreenConnection(data) {
		if(data === null) {
			data = {
				id: 0,
				onscreen_id: '',
				book_id: '',
				short_id: '',
				type: '',
				info: ''
			}
		}
		this.screenConnectionForm.patchValue(data);
		this.showScreenConnectionForm = true;
	}

	onBookFormSubmit() {
		this.mysql.edit("books",this.bookForm.value).subscribe((data) => { if(data.success == true) { this.loadData('books') } else { alert(data.error) } });
		this.modalService.dismissAll();
	}

	onEditionFormSubmit() {
		this.mysql.edit("editions",this.editionForm.value).subscribe((data) => { if(data.success == true) { this.loadData('editions') } else { alert(data.error) } });
		this.modalService.dismissAll();
	}

	onShortFormSubmit() {
		this.mysql.edit("shorts",this.shortForm.value).subscribe((data) => { if(data.success == true) { this.loadData('shorts') } else { alert(data.error) } });
		this.modalService.dismissAll();
	}

	onScreenFormSubmit() {
		this.mysql.edit("onscreen",this.screenForm.value).subscribe((data) => { if(data.success == true) { this.loadData('screens') } else { alert(data.error) } });
		this.modalService.dismissAll();
	}

	onBookShortFormSubmit() {
		this.mysql.edit("book_shorts",this.bookShortForm.value).subscribe((data) => { if(data.success == true) { this.loadData('book_shorts') } else { alert(data.error) } });
		this.modalService.dismissAll();
	}

	onEditionShortFormSubmit() {
		this.mysql.edit("edition_shorts",this.editionShortForm.value).subscribe((data) => { if(data.success == true) { this.loadData('edition_shorts') } else { alert(data.error) } });
		this.modalService.dismissAll();
	}

	onEditionISBNFormSubmit() {
		this.mysql.edit("edition_isbns",this.editionISBNForm.value).subscribe((data) => { if(data.success == true) { this.loadData('edition_isbns') } else { alert(data.error) } });
		this.modalService.dismissAll();
	}

	onScreenConnectionFormSubmit() {
		this.mysql.edit("onscreen_connections",this.screenConnectionForm.value).subscribe((data) => { if(data.success == true) { this.loadData('onscreen_connections') } else { alert(data.error) } });
		this.modalService.dismissAll();
	}

	exportSitemap() {
		let last_books = '2020-07-01';
		let last_shorts = '2020-07-01';
		let last_screens = '2020-12-01';
		this.books$.forEach(book => {
			let lastmod = book.last_modified.substring(0,10);
			if(last_books < lastmod){
				last_books = lastmod;
			}
			this.exportXMLsitemap_additional = this.exportXMLsitemap_additional + ('\n\
	<url>\n\
		<loc>https://stephen-king.info/books/'+this.lib.urlType(book.type)+'/'+this.lib.seoUrl(book.title)+'</loc>\n\
		<lastmod>'+lastmod+'</lastmod>\n\
	</url>');
		});
		this.shorts$.forEach(short => {
			let lastmod = short.last_modified.substring(0,10);
			if(last_shorts < lastmod){
				last_shorts = lastmod;
			}
			this.exportXMLsitemap_additional = this.exportXMLsitemap_additional + ('\n\
	<url>\n\
		<loc>https://stephen-king.info/stories/'+this.lib.urlType(short.type)+'/'+this.lib.seoUrl(short.title)+'</loc>\n\
		<lastmod>'+lastmod+'</lastmod>\n\
	</url>');
		});
		this.screens$.forEach(screen => {
			let lastmod = screen.last_modified.substring(0,10);
			if(last_screens < lastmod){
				last_screens = lastmod;
			}
			this.exportXMLsitemap_additional = this.exportXMLsitemap_additional + ('\n\
	<url>\n\
		<loc>https://stephen-king.info/'+this.lib.urlType(screen.type)+'/'+(screen.slug ? screen.slug : this.lib.seoUrl(screen.title))+'</loc>\n\
		<lastmod>'+lastmod+'</lastmod>\n\
	</url>');
		});

		this.exportXMLsitemap_main = '<?xml version="1.0" encoding="UTF-8"?>\n\
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\
	<url>\n\
		<loc>https://stephen-king.info</loc>\n\
		<lastmod>2021-03-11</lastmod>\n\
	</url>\n\
	<url>\n\
		<loc>https://stephen-king.info/about</loc>\n\
		<lastmod>2020-10-09</lastmod>\n\
	</url>\n\
	<url>\n\
		<loc>https://stephen-king.info/books</loc>\n\
		<lastmod>'+last_books+'</lastmod>\n\
	</url>\n\
	<url>\n\
		<loc>https://stephen-king.info/stories</loc>\n\
		<lastmod>'+last_shorts+'</lastmod>\n\
	</url>\n\
	<url>\n\
		<loc>https://stephen-king.info/onscreen</loc>\n\
		<lastmod>'+last_screens+'</lastmod>\n\
	</url>';

		this.exportXMLsitemap = this.exportXMLsitemap_main + this.exportXMLsitemap_additional + '\n\
</urlset>';
	}

	exportDatabase() {
		var a = document.createElement('a');
		let database = {
			'books': this.books$,
			'shorts': this.shorts$,
			'editions': this.editions$,
			'onscreen': this.screens$,
			'book-shorts': this.book_shorts$,
			'edition-shorts': this.edition_shorts$,
			'edition-isbns': this.edition_isbns$,
			'onscreen-connections': this.onscreen_connections$
		}
		var file =  new Blob([JSON.stringify(database)], {type: 'application/json'});
		a.href = URL.createObjectURL(file);
		a.download = 'database.json';
		a.click();
	}

	downloadXML(type) {
		var a = document.createElement('a');
		if(type === 'sitemap') {
			var file = new Blob([this.exportXMLsitemap], {type: 'application/xml'});
		}
		a.href = URL.createObjectURL(file);
		a.download = type + '.xml';
		a.click();
	}

	updateCustom() {

	}

	getShort(short_id) {
		if (this.shorts$) {
			return this.shorts$.filter(s => s.short_id == short_id)[0];
		} else {
			return [];
		}
	}

	getBook(book_id) {
		if (this.books$) {
			return this.books$.filter(b => b.book_id == book_id)[0];
		} else {
			return [];
		}
	}

	getEdition(edition_id) {
		if (this.editions$) {
			return this.editions$.filter(b => b.edition_id == edition_id)[0];
		} else {
			return [];
		}
	}

	getEditionISBNs(edition_id) {
		if (this.edition_isbns$) {
			return this.edition_isbns$.filter(b => b.edition_id == edition_id);
		} else {
			return [];
		}
	}

	getEditionShorts(ref) {
		if (this.edition_shorts$) {
			if (ref.edition_id) {
				return this.edition_shorts$.filter(s => s.edition_id == ref.edition_id)
			} else {
				return this.edition_shorts$.filter(s => s.short_id == ref.short_id)
			}
		} else {
			return false;
		}
	}

	getBookShorts(ref) {
		if (this.book_shorts$) {
			if (ref.book_id) {
				return this.book_shorts$.filter(s => s.book_id == ref.book_id)
			} else {
				return this.book_shorts$.filter(s => s.short_id == ref.short_id)
			}
		} else {
			return false;
		}
	}

	getBookEditions(ref) {
		if (this.editions$) {
			if (ref.book_id) {
				return this.editions$.filter(e => e.book_id == ref.book_id)
			}
		} else {
			return false;
		}
	}

	getScreenConnections(ref) {
		if (this.onscreen_connections$) {
			if (ref.onscreen_id) {
				return this.onscreen_connections$.filter(s => s.onscreen_id == ref.onscreen_id)
			}
		} else {
			return false;
		}
	}

	async updateIMDb() {
		let current = 0;
		let total = this.screens$.length;
		for(let screen of this.screens$) {
			current++;
			if(screen.imdb_id) {
				let data:any = await this.imdb.getTitleData(screen.imdb_id);
				let imdb_votes = data.imdbVotes && data.imdbVotes != 'N/A' ? Number(data.imdbVotes.replace(/,/g,"")) : 0;
				let rotten_tomatoes = 0;
				let metascore = 0;
				let imdb_rating = 0;
				let new_votes = imdb_votes - screen.imdb_votes;
				data.Ratings?.forEach(rate => {
					if(rate.Source == 'Rotten Tomatoes') {
						rotten_tomatoes = Number(rate.Value.replace("%","").replace("N/A",""))
					}
					if(rate.Source == 'Metacritic') {
						metascore = Number(rate.Value.replace("/100","").replace("N/A",""))
					}
					if(rate.Source == 'Internet Movie Database') {
						imdb_rating = Number(rate.Value.replace("/10","").replace("N/A",""))
					}
				});
				let body = {
					onscreen_id: screen.onscreen_id,
					imdb_rating: imdb_rating,
					imdb_votes: imdb_votes,
					rotten_tomatoes: rotten_tomatoes,
					metascore: metascore
				};
				this.mysql.edit("onscreen", body).subscribe((data) => {
					this.progress_info = current + '/' + total;
					console.info(screen.title + ' | ('+new_votes+')');
				});
				await new Promise(r => setTimeout(r, 300));
			}
		}
		this.progress_info = '';
	}

	async parseIMDb(Form) {
		if(Form.value.imdb_id.match(/(tt\d{4,})/)?.length > 1) {
			let data:any = await this.imdb.getTitleData(Form.value.imdb_id);
			console.log(data);
			let imdb_type = '';
			switch (data.Type) {
				case 'series':
					imdb_type = 'Сериал';
					break;
				case 'movie':
					imdb_type = 'Филм';
					break;
			}
			let rotten_tomatoes = 0;
			let metascore = 0;
			let imdb_rating = 0;
			data.Ratings?.forEach(rate => {
				if(rate.Source == 'Rotten Tomatoes') {
					rotten_tomatoes = Number(rate.Value.replace("%","").replace("N/A",""))
				}
				if(rate.Source == 'Metacritic') {
					metascore = Number(rate.Value.replace("/100","").replace("N/A",""))
				}
				if(rate.Source == 'Internet Movie Database') {
					imdb_rating = Number(rate.Value.replace("/10","").replace("N/A",""))
				}
			});
			let parsed_data = {
				title: data.Title ? data.Title : Form.value.title,
				year: data.Year ? data.Year : Form.value.year,
				type: imdb_type && !Form.value.type ? imdb_type : Form.value.type,
				released: data.Released && data.Released != 'N/A' ? new Date(data.Released).toISOString().substring(0,10): Form.value.released,
				rated: data.Rated ? data.Rated : Form.value.rated,
				runtime: data.Runtime && data.Runtime != 'N/A' ? Number(data.Runtime.replace(" min","")) : Form.value.runtime,
				seasons: data.totalSeasons ? Number(data.totalSeasons) : Form.value.seasons,
				genres: data.Genre ? data.Genre : Form.value.genres,
				poster: data.Poster && data.Poster != 'N/A' ? data.Poster : Form.value.poster,
				imdb_rating: imdb_rating ? imdb_rating : Form.value.imdb_rating,
				imdb_votes: data.imdbVotes && data.imdbVotes != 'N/A' ? Number(data.imdbVotes.replace(/,/g,"")) : 0,
				rotten_tomatoes: rotten_tomatoes ? rotten_tomatoes : Form.value.rotten_tomatoes,
				metascore: metascore ? metascore : Form.value.metascore,
				production: !Form.value.production && data.Production && data.Production != 'N/A' ? data.Production : Form.value.production,
				language: data.Language ? data.Language : Form.value.language,
				country: data.Country ? data.Country : Form.value.country,
			}
			Form.patchValue(parsed_data);
		} else {
			alert('Невалидно IMDb ID');
		}
	}
	async parseTMDb(Form) {
		if(Form.value.tmdb_id.match(/((tv|movie)\/\d{1,})/)?.length > 1) {
			let data:any = await this.tmdb.getTitleData(Form.value.tmdb_id);
			console.log(data);
			let trailers = [];
			data.results?.forEach(video => {
				if(video.type == 'Trailer' && video.site == 'YouTube') {
					trailers.push(video.key)
				}

			});
			let parsed_data = {
				trailer: !Form.value.trailer && trailers.length > 0 ? trailers.join("|") : Form.value.trailer
			}
			Form.patchValue(parsed_data);
		} else {
			alert('Невалидно The Movie Database ID');
		}
	}

	seoTransform (Form) {
		let parsed_data = {
			slug: !Form.value.slug && Form.value.title ? this.lib.seoUrl(Form.value.title) : Form.value.slug
		}
		Form.patchValue(parsed_data);
	}

	trimDomainWiki(Form) {
		var data = {
			wikipedia: Form.value.wikipedia.replace('https://en.wikipedia.org/wiki/','')
		}
		Form.patchValue(data);
	}

	trimDomainSK(Form) {
		var data = {
			official_site: Form.value.official_site.replace('https://stephenking.com/works/','')
		}
		Form.patchValue(data);
	}

	trimDomainIMDb(Form) {
		var data = {
			imdb_id: Form.value.imdb_id.match(/(tt\d{4,})/)?.length > 1 ? Form.value.imdb_id.match(/(tt\d{4,})/)[1] : Form.value.imdb_id
		}
		Form.patchValue(data);
	}
	trimDomainTMDb(Form) {
		var data = {
			tmdb_id: Form.value.tmdb_id.match(/((tv|movie)\/\d{1,})/)?.length > 1 ? Form.value.tmdb_id.match(/((tv|movie)\/\d{1,})/)[1] : Form.value.tmdb_id
		}
		Form.patchValue(data);
	}
	trimDomainYouTube(Form) {
		var data = {
			trailer: Form.value.trailer.match(/v\=([A-Za-z0-9_\-]{11})/)?.length > 1 ? Form.value.trailer.match(/v\=([A-Za-z0-9_\-]{11})/)[1] : Form.value.trailer
		}
		Form.patchValue(data);
	}

	openPlayerModal(content) {
		this.modalService.open(content, { size: 'xl', centered: true, scrollable: true, windowClass: 'videoModal'});
	}

}
