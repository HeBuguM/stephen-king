import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { LibraryService } from '../../services/library.service'
import { IMDbService } from '../../services/imdb.service'
import { Title } from '@angular/platform-browser'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

	// Pages
	showBooks = true;
	showEditions = false;
	showShorts = false;
	showScreens = false;
	showData = false;

	// Forms
	showBooksForm = false;
	showEditionsForm = false;
	showShortsForm = false;
	showScreensForm = false;
	showBooksShortsForm = false;
	showEditionsShortsForm = false;

	books$;
	editions$;
	shorts$;
	screens$;
	book_shorts$;
	edition_shorts$;

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
		translation: [''],
		note: [''],
		goodreads: [0],
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
	});

	screenForm = this.fb.group({
		onscreen_id: ['', Validators.required],
		title: ['', Validators.required],
		type: [''],
		status: [''],
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
		directors: [''],
		writers: [''],
		rotten_tomatoes: [0],
		metascore: [0],
		production: [''],
		language: [''],
		country: [''],
		budget: [0]
	});

	bookShortForm = this.fb.group({
		book_id: ['', Validators.required],
		short_id: ['', Validators.required],
		position: [0]
	});

	editionShortForm = this.fb.group({
		edition_id: ['', Validators.required],
		short_id: ['', Validators.required],
		title: ['', Validators.required],
		subtitle: [''],
		position: [0]
	});

	constructor(public lib: LibraryService, private afs: AngularFirestore, private browser: Title, public imdb: IMDbService,private fb: FormBuilder, private modalService: NgbModal) { }

	ngOnInit() {
		this.browser.setTitle(`Администрация - Стивън Кинг`)
	}

	loadData(data = '') {
		if (!this.books$ && (data == 'books' || !data)) {
			this.afs.collection('books', ref => { return ref.orderBy('book_id') }).valueChanges().subscribe((data) => { this.books$ = data; });
		}
		if (!this.editions$ && (data == 'editions' || !data)) {
			this.afs.collection('editions', ref => { return ref.orderBy('published') }).valueChanges().subscribe((data) => { this.editions$ = data; });
		}
		if (!this.shorts$ && (data == 'shorts' || !data)) {
			this.afs.collection('shorts', ref => { return ref.orderBy('first_pub_date') }).valueChanges().subscribe((data) => { this.shorts$ = data; });
		}
		if (!this.screens$ && (data == 'screens' || !data)) {
			this.afs.collection('onscreen', ref => { return ref.orderBy('year') }).valueChanges().subscribe((data) => { this.screens$ = data; });
		}
		if (!this.book_shorts$ && (data == 'book-shorts' || !data)) {
			this.afs.collection('book-shorts', ref => { return ref.orderBy('position') }).valueChanges().subscribe((data) => { this.book_shorts$ = data; });
		}
		if (!this.edition_shorts$ && (data == 'edition-shorts' || !data)) {
			this.afs.collection('edition-shorts', ref => { return ref.orderBy('position') }).valueChanges().subscribe((data) => { this.edition_shorts$ = data; });
		}
	}

	changeSection(section) {
		this.showBooks = section == 'books' ? true : false;
		this.showEditions = section == 'editions' ? true : false;
		this.showShorts = section == 'shorts' ? true : false;
		this.showScreens = section == 'screens' ? true : false;
		this.showData = section == 'data' ? true : false;
	}

	openModal(content) {
		this.modalService.open(content, { size: 'lg', centered: true }).result.then(
			(result) => {},
			(close) => {
				this.showBooksForm = false;
				this.showEditionsForm = false;
				this.showShortsForm = false;
				this.showScreensForm = false;
				this.showBooksShortsForm = false;
				this.showEditionsShortsForm = false;
			}
		);
	}

	editBook(data) {
		if(data !== null) {
			this.bookForm.patchValue(data);
		} else {
			this.bookForm.patchValue({
				book_id: this.books$.length+1,
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
				goodreads: 0
			})
		}
		this.showBooksForm = true;
	}

	editShort(data) {
		if(data === null) {
			data = {
				short_id: this.shorts$.length+1,
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
				goodreads: 0
			}
		}
		this.shortForm.patchValue(data);
		this.showShortsForm = true;
	}

	editScreen(data) {
		if(data === null) {
			data = {
				onscreen_id: this.screens$?.length+1,
				title: '',
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
				directors: '',
				writers: '',
				imdb_rating: 0,
				imdb_votes: 0,
				rotten_tomatoes: 0,
				metascore: 0,
				production: '',
				language: '',
				country: '',
				budget: 0
			}
		}
		this.screenForm.patchValue(data);
		this.showScreensForm = true;
	}

	editEdition(data) {
		if(data === null) {
			data = {
				edition_id: this.editions$.length+1,
				book_id: 0,
				language: 'bg',
				group_id: 0,
				title: '',
				published: '',
				publisher: '',
				pages: 0,
				translation: '',
				note: '',
				goodreads: 0
			}
		}
		this.editionForm.patchValue(data);
		this.showEditionsForm = true;
	}

	editBookShort(data) {
		if(data === null) {
			data = {
				book_id: 0,
				short_id: 0,
				position: 0
			}
		}
		this.bookShortForm.patchValue(data);
		this.showBooksShortsForm = true;
	}

	editEditionShort(data) {
		if(data === null) {
			data = {
				edition_id: 0,
				short_id: 0,
				title: '',
				subtitle: '',
				position: 0
			}
		}
		this.editionShortForm.patchValue(data);
		this.showEditionsShortsForm = true;
	}

	onBookFormSubmit() {
		this.afs.doc(`books/${this.bookForm.value.book_id}`).set({...this.bookForm.value,last_modified: new Date()}, { merge: true });
		this.modalService.dismissAll();
	}

	onEditionFormSubmit() {
		this.afs.doc(`editions/${this.editionForm.value.edition_id}`).set({...this.editionForm.value,last_modified: new Date()}, { merge: true });
		this.modalService.dismissAll();
	}

	onShortFormSubmit() {
		this.afs.doc(`shorts/${this.shortForm.value.short_id}`).set({...this.shortForm.value,last_modified: new Date()}, { merge: true });
		this.modalService.dismissAll();
	}

	onScreenFormSubmit() {
		this.afs.doc(`onscreen/${this.screenForm.value.onscreen_id}`).set({...this.screenForm.value,last_modified: new Date()}, { merge: true });
		this.modalService.dismissAll();
	}

	onBookShortFormSubmit() {
		this.afs.doc(`book-shorts/${this.bookShortForm.value.book_id}-${this.bookShortForm.value.short_id}`).set(this.bookShortForm.value, { merge: true });
		this.afs.doc(`books/${this.bookShortForm.value.book_id}`).set({last_modified: new Date()}, { merge: true });
		this.afs.doc(`shorts/${this.bookShortForm.value.short_id}`).set({last_modified: new Date()}, { merge: true });
		this.modalService.dismissAll();
	}

	onEditionShortFormSubmit() {
		this.afs.doc(`edition-shorts/${this.editionShortForm.value.edition_id}-${this.editionShortForm.value.short_id}`).set(this.editionShortForm.value, { merge: true });
		this.afs.doc(`editions/${this.editionShortForm.value.edition_id}`).set({last_modified: new Date()}, { merge: true });
		this.afs.doc(`shorts/${this.editionShortForm.value.short_id}`).set({last_modified: new Date()}, { merge: true });
		this.modalService.dismissAll();
	}

	exportFirestoreBooks() {
		// Building Books Array
		for (let book of this.books$) {
			this.exportBooks[book.book_id] = book;
		}

		// Building Shorts Array
		for (let short of this.shorts$) {
			const Short = {
				...short,
				...{
					collection_title: (short.first_collected > 0 ? this.exportBooks[short.first_collected].title : ""),
					collection_published: (short.first_collected > 0 ? this.exportBooks[short.first_collected].published : "")
				}
			}
			this.exportShorts[short.short_id] = Short;
		}

		// Building Editions Array
		for (let edition of this.editions$) {
			this.exportEditions[edition.edition_id] = edition;
		}

		// Adding Book-Shorts connections
		for (let book_short of this.book_shorts$) {
			// Shorts to books
			if (this.exportBooks[book_short.book_id]['shorts'] === undefined) {
				this.exportBooks[book_short.book_id]['shorts'] = [];
			}
			const BookShort = {
				short_id: Number(book_short.short_id),
				type: this.exportShorts[book_short.short_id].type,
				title: this.exportShorts[book_short.short_id].title,
				subtitle: this.exportShorts[book_short.short_id].subtitle,
				first_pub_in: this.exportShorts[book_short.short_id].first_pub_in,
				first_pub_date: this.exportShorts[book_short.short_id].first_pub_date,
				first_collected: this.exportShorts[book_short.short_id].first_collected,
				position: book_short.position
			};
			this.exportBooks[book_short.book_id]['shorts'].push(BookShort);
			// Books to shorts
			if (this.exportShorts[book_short.short_id]['books'] === undefined) {
				this.exportShorts[book_short.short_id]['books'] = [];
			}
			const ShortBook = {
				book_id: Number(book_short.book_id),
				title: this.exportBooks[book_short.book_id].title,
				published: this.exportBooks[book_short.book_id].published,
				publisher: this.exportBooks[book_short.book_id].publisher
			}
			this.exportShorts[book_short.short_id]['books'].push(ShortBook);
		}

		// Build Edition-Shorts Connections
		for (let edition_short of this.edition_shorts$) {
			if (this.exportEditionShorts[edition_short.edition_id] === undefined) {
				this.exportEditionShorts[edition_short.edition_id] = [];
			}
			const EditionShort = {
				short_id: Number(edition_short.short_id),
				title: edition_short.title,
				subtitle: edition_short.subtitle,
				position: edition_short.position
			};
			this.exportEditionShorts[edition_short.edition_id].push(EditionShort);
			// Shorts to editions
			if (this.exportShorts[edition_short.short_id]['editions'] === undefined) {
				this.exportShorts[edition_short.short_id]['editions'] = [];
			}
			if (this.exportEditions[edition_short.edition_id] === undefined) {
				console.log(edition_short);
			}
			const ShortEdition = {
				edition_id: Number(edition_short.edition_id),
				title: edition_short.title,
				subtitle: edition_short.subtitle,
				edition_title: this.exportEditions[edition_short.edition_id].title,
				published: this.exportEditions[edition_short.edition_id].published,
				publisher: this.exportEditions[edition_short.edition_id].publisher,
				translation: this.exportEditions[edition_short.edition_id].translation
			}
			this.exportShorts[edition_short.short_id]['editions'].push(ShortEdition);
		}

		// Add Editions
		for (let edition of this.editions$) {
			if (this.exportBooks[edition.book_id] !== undefined) {
				if (this.exportBooks[edition.book_id]['editions'] === undefined) {
					this.exportBooks[edition.book_id]['editions'] = [];
				}
				if (this.exportEditionShorts[edition.edition_id] !== undefined) {
					edition['shorts'] = this.exportEditionShorts[edition.edition_id];
				} else {
					edition['shorts'] = [];
				}
				this.exportBooks[edition.book_id]['editions'].push(edition);
			}
		}

		// Build Final Array (Books)
		for (let book of Object.values(this.exportBooks)) {
			if (!book['editions']) {
				book['editions'] = [];
			}
			if (!book['shorts']) {
				book['shorts'] = []
			}
			this.finalBooks.push(book);
		}
		this.exportJSONbooks = JSON.stringify(this.lib.sortObject(this.finalBooks, 'published'));

		// Build Final Array (Shorts)
		for (let short of Object.values(this.exportShorts)) {
			if (!short['books']) {
				short['books'] = [];
			}
			if (!short['editions']) {
				short['editions'] = []
			} else {
				short['editions'] = this.lib.sortObject(short['editions'], 'published')
			}
			this.finalShorts.push(short);
		}
		this.exportJSONshorts = JSON.stringify(this.lib.sortObject(this.finalShorts, 'first_pub_date'));

		this.exportXMLsitemap = '<?xml version="1.0" encoding="UTF-8"?>\n\
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\
	<url>\n\
		<loc>https://hebugum.github.io/stephen-king/</loc>\n\
	</url>\n\
	<url>\n\
		<loc>https://hebugum.github.io/stephen-king/#/</loc>\n\
	</url>\n\
	<url>\n\
		<loc>https://hebugum.github.io/stephen-king/#/books</loc>\n\
	</url>\n\
	<url>\n\
		<loc>https://hebugum.github.io/stephen-king/#/shorts</loc>\n\
	</url>';

		this.books$.forEach(book => {
			let lastmod = book.last_modified.toDate().toISOString().substring(0,10);
			this.exportXMLsitemap = this.exportXMLsitemap + ('\n\
	<url>\n\
		<loc>https://hebugum.github.io/stephen-king/#/book/'+book.book_id+'</loc>\n\
		<lastmod>'+lastmod+'</lastmod>\n\
	</url>');
		});
		this.shorts$.forEach(short => {
			let lastmod = short.last_modified.toDate().toISOString().substring(0,10);
			this.exportXMLsitemap = this.exportXMLsitemap + ('\n\
	<url>\n\
		<loc>https://hebugum.github.io/stephen-king/#/short/'+short.short_id+'</loc>\n\
		<lastmod>'+lastmod+'</lastmod>\n\
	</url>');
		});

		this.exportXMLsitemap = this.exportXMLsitemap + '\n\
</urlset>';
	}

	updateFirestoreData(type) {
		if(type === 'books') {
			this.afs.doc(`data/books`).set({...this.finalBooks});
			alert('Live Data updated ['+type+']')
		}
		if(type === 'shorts') {
			this.afs.doc(`data/shorts`).set({...this.finalShorts});
			alert('Live Data updated ['+type+']')
		}
	}

	downloadJSON(type) {
		var a = document.createElement('a');
		if(type === 'books') {
			this.afs.doc(`data/books`).set({...this.finalBooks});
			var file = new Blob([this.exportJSONbooks], {type: 'application/json'});
		}
		if(type === 'shorts') {
			this.afs.doc(`data/shorts`).set({...this.finalShorts});
			var file = new Blob([this.exportJSONshorts], {type: 'application/json'});
		}
		a.href = URL.createObjectURL(file);
		a.download = type + '.json';
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

	importCustom() {
		const data = [

		]

		for (let row of data) {
			const customRef: AngularFirestoreDocument<any> = this.afs.doc(`edition-shorts/${row.edition_id}-${row.short_id}`);
			const data = {
				edition_id: Number(row.edition_id),
				short_id: Number(row.short_id),
				title: row.title,
				subtitle: row.subtitle,
				position: Number(row.position)
			}
			customRef.set(data)
		}
	}

	updateCustom() {
		this.shorts$.forEach(short => {
			const customRef: AngularFirestoreDocument<any> = this.afs.doc(`shorts/${short.short_id}`);
			customRef.update({
				wikipedia: '',
				official_site: '',
				goodreads: 0
			});
			console.log(short.title + ' updated');
		});

		// this.books$.forEach(book => {
		// 	const customRef: AngularFirestoreDocument<any> = this.afs.doc(`books/${book.book_id}`);
		// 	customRef.update({
		// 		last_modified: new Date()
		// 	});
		// 	console.log(book.title + ' updated');
		// });

		// this.editions$.forEach(edition => {
		// 	const customRef: AngularFirestoreDocument<any> = this.afs.doc(`editions/${edition.edition_id}`);
		// 	customRef.update({
		// 		last_modified: new Date()
		// 	});
		// 	console.log(edition.title + ' updated');
		// });
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

	importBooks() {
		this.lib.getBooks().toPromise().then(books => {
			for (let book of books) {
				const bookRef: AngularFirestoreDocument<any> = this.afs.doc(`books/${book.book_id}`);
				const data = {
					book_id: Number(book.book_id),
					type: book.type,
					title: book.title,
					published: book.published,
					publisher: book.publisher,
					pages: Number(book.pages),
					synopsis: book.synopsis,
					note: book.note,
					alterations: book.alterations,
					series_name: book.series_name,
					series_no: Number(book.series_no),
					pseudonym: book.pseudonym,
					co_writers: book.co_writers,
					wikipedia: book.wikipedia,
					official_site: book.official_site,
					goodreads: book.goodreads
				}
				bookRef.set(data, { merge: true })
			}
		});
	}

	importEditions() {
		this.lib.getBooks().toPromise().then(books => {
			for (let book of books) {
				for (let group of book.editions) {
					for (let edition of group) {
						const editionRef: AngularFirestoreDocument<any> = this.afs.doc(`editions/${edition.edition_id}`);
						const data = {
							edition_id: Number(edition.edition_id),
							book_id: Number(edition.book_id),
							language: 'bg',
							group_id: Number(edition.group_id),
							title: edition.title,
							published: edition.published,
							publisher: edition.publisher,
							pages: Number(edition.pages),
							translation: edition.translation,
							note: edition.note,
							goodreads: edition.goodreads
						}
						editionRef.set(data, { merge: true });
					}
				}
			}
		});
	}

	importShorts() {
		this.lib.getShorts().toPromise().then(shorts => {
			for (let short of shorts) {
				const shortRef: AngularFirestoreDocument<any> = this.afs.doc(`shorts/${short.short_id}`);
				const data = {
					short_id: Number(short.short_id),
					type: short.type,
					title: short.title,
					subtitle: short.subtitle,
					first_pub_date: short.first_pub_date,
					first_pub_in: short.first_pub_in,
					first_collected: Number(short.first_collected),
					synopsis: short.synopsis,
					note: short.note,
				}
				shortRef.set(data);
			}
		});
	}

	async parseIMDb(Form) {
		if(Form.value.imdb_id.match(/(tt\d{4,})/)?.length > 1) {
			let data:any = await this.imdb.getTitleData(Form.value.imdb_id);
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
			data.Ratings.forEach(rate => {
				if(rate.Source == 'Rotten Tomatoes') {
					rotten_tomatoes = Number(rate.Value.replace("%",""))
				}
				if(rate.Source == 'Metacritic') {
					metascore = Number(rate.Value.replace("/100",""))
				}
				if(rate.Source == 'Internet Movie Database') {
					imdb_rating = Number(rate.Value.replace("/10",""))
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
				directors: !Form.value.directors ? data.Director.replace("N/A","") : Form.value.directors, // .replace(/ \(.*?\)/g,"")
				writers: !Form.value.writers ? data.Writer.replace("N/A","") : Form.value.writers, // .replace(/ \(.*?\)/g,"")
				imdb_rating: imdb_rating ? imdb_rating : Form.value.imdb_rating,
				imdb_votes: data.imdbVotes && data.imdbVotes != 'N/A' ? Number(data.imdbVotes.replace(",","")) : 0,
				rotten_tomatoes: rotten_tomatoes ? rotten_tomatoes : Form.value.rotten_tomatoes,
				metascore: metascore ? metascore : Form.value.metascore,
				production: !Form.value.production && data.Production ? data.Production : Form.value.production,
				language: data.Language ? data.Language : Form.value.language,
				country: data.Country ? data.Country : Form.value.country,
			}
			console.log(parsed_data);
			Form.patchValue(parsed_data);
		} else {
			alert('Невалидно IMDb ID');
		}
	}

	trimDomainNames(Form) {
		var data = {
			wikipedia: Form.value.wikipedia.replace('https://en.wikipedia.org/wiki/',''),
			official_site: Form.value.official_site.replace('https://stephenking.com/','')
		}
		Form.patchValue(data);
	}

	trimIMDbId(Form) {
		var data = {
			imdb_id: Form.value.imdb_id.match(/(tt\d{4,})/)?.length > 1 ? Form.value.imdb_id.match(/(tt\d{4,})/)[1] : Form.value.imdb_id
		}
		Form.patchValue(data);
	}

}
