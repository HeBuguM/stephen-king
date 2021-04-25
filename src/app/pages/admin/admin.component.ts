import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { LibraryService } from '../../services/library.service'
import { IMDbService } from '../../services/imdb.service'
import { TMDbService } from '../../services/tmdb.service'
import { Title } from '@angular/platform-browser'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
	youtubeId:string = '';

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
	showScreenConnectionForm = false;

	books$;
	editions$;
	shorts$;
	screens$;
	book_shorts$;
	edition_shorts$;
	screen_connections$;

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
		ISBNs: this.fb.array([]),
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
		onscreen_id: ['', Validators.required],
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
		directors: [''],
		writers: [''],
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

	screenConnectionForm = this.fb.group({
		onscreen_id: ['', Validators.required],
		book_id: [''],
		short_id: [''],
		type: [''],
		info: ['']
	});

	constructor(
		public lib: LibraryService,
		private afs: AngularFirestore,
		private browser: Title,
		public imdb: IMDbService,
		public tmdb: TMDbService,
		private fb: FormBuilder,
		private modalService: NgbModal
	) { }

	ngOnInit() {
		this.browser.setTitle(`Администрация - Стивън Кинг`)
	}

	createISBN(): FormGroup {
		return this.fb.group({
		  ISBN: '',
		  info: ''
		});
	}
	addISBN(Form, ISBN?): void {
		const control = Form.get('ISBNs') as FormArray;
		control.push(ISBN ? this.fb.group(ISBN) : this.createISBN());
	}
	removeISBN(i: number) {
		const control = this.editionForm.get('ISBNs') as FormArray;
		control.removeAt(i);
	}

	loadData(data = '') {
		if (!this.books$ && (data == 'books' || !data)) {
			this.afs.collection('books', ref => { return ref.orderBy('book_id') }).valueChanges().subscribe((data) => { this.books$ = data; });
			this.changeSection('books');
		}
		if (!this.editions$ && (data == 'editions' || !data)) {
			this.afs.collection('editions', ref => { return ref.orderBy('published') }).valueChanges().subscribe((data) => { this.editions$ = data; });
			this.changeSection('editions');
		}
		if (!this.shorts$ && (data == 'shorts' || !data)) {
			this.afs.collection('shorts', ref => { return ref.orderBy('first_pub_date') }).valueChanges().subscribe((data) => { this.shorts$ = data; });
			this.changeSection('shorts');
		}
		if (!this.screens$ && (data == 'screens' || !data)) {
			this.afs.collection('onscreen', ref => { return ref.orderBy('title') }).valueChanges().subscribe((data) => { this.screens$ = data; });
			this.changeSection('screens');
		}
		if (!this.book_shorts$ && (data == 'book-shorts' || !data)) {
			this.afs.collection('book-shorts', ref => { return ref.orderBy('position') }).valueChanges().subscribe((data) => { this.book_shorts$ = data; });
		}
		if (!this.edition_shorts$ && (data == 'edition-shorts' || !data)) {
			this.afs.collection('edition-shorts', ref => { return ref.orderBy('position') }).valueChanges().subscribe((data) => { this.edition_shorts$ = data; });
		}
		if (!this.screen_connections$ && (data == 'screen-connections' || !data)) {
			this.afs.collection('onscreen-connections', ref => { return ref.orderBy('info') }).valueChanges().subscribe((data) => { this.screen_connections$ = data; });
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
			(onClose) => {
				this.showBooksForm = false;
				this.showEditionsForm = false;
				this.showShortsForm = false;
				this.showScreensForm = false;
				this.showBooksShortsForm = false;
				this.showEditionsShortsForm = false;
				this.showScreenConnectionForm = false;
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
				goodreads: 0,
				upcoming: 0
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
				onscreen_id: this.screens$?.length+1,
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
				directors: '',
				writers: '',
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
		this.editionForm.reset();
		if(data === null) {
			data = {
				edition_id: this.editions$.length+1,
				book_id: 0,
				language: 'bg',
				group_id: 0,
				title: '',
				ISBNs: [],
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
		let controls = this.editionForm.get("ISBNs") as FormArray;
		controls.clear();
		if(data.ISBNs?.length > 0) {
			for(let ISBN of data.ISBNs) {
				this.addISBN(this.editionForm, ISBN);
			}
		}
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

	editScreenConnection(data) {
		if(data === null) {
			data = {
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

	onScreenConnectionFormSubmit() {
		if(this.screenConnectionForm.value.book_id > 0) {
			this.afs.doc(`onscreen-connections/${this.screenConnectionForm.value.onscreen_id}-book-${this.screenConnectionForm.value.book_id}`).set(this.screenConnectionForm.value, { merge: true });
			this.afs.doc(`books/${this.screenConnectionForm.value.book_id}`).set({last_modified: new Date()}, { merge: true });
		}
		if(this.screenConnectionForm.value.short_id > 0) {
			this.afs.doc(`onscreen-connections/${this.screenConnectionForm.value.onscreen_id}-short-${this.screenConnectionForm.value.short_id}`).set(this.screenConnectionForm.value, { merge: true });
			this.afs.doc(`shorts/${this.screenConnectionForm.value.short_id}`).set({last_modified: new Date()}, { merge: true });
		}
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

		// Building Screens Array
		for (let screen of this.screens$) {
			this.exportScreens[screen.onscreen_id] = {...screen,books:[], shorts:[]};
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
				translators: this.exportEditions[edition_short.edition_id].translators,
				narrators: this.exportEditions[edition_short.edition_id].narrators
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

		// Add Screen Connections
		for (let connection of this.screen_connections$) {
			const Screen = {
				onscreen_id: Number(connection.onscreen_id),
				title: this.exportScreens[connection.onscreen_id].title,
				slug: this.exportScreens[connection.onscreen_id].slug,
				year: this.exportScreens[connection.onscreen_id].year,
				status: this.exportScreens[connection.onscreen_id].status,
				poster: this.exportScreens[connection.onscreen_id].poster,
				type: this.exportScreens[connection.onscreen_id].type,
				network: this.exportScreens[connection.onscreen_id].network,
				rated: this.exportScreens[connection.onscreen_id].rated,
				runtime: this.exportScreens[connection.onscreen_id].runtime,
				seasons: this.exportScreens[connection.onscreen_id].seasons,
				episodes: this.exportScreens[connection.onscreen_id].episodes,
				imdb_id: this.exportScreens[connection.onscreen_id].imdb_id,
				imdb_rating: this.exportScreens[connection.onscreen_id].imdb_rating,
				imdb_votes: this.exportScreens[connection.onscreen_id].imdb_votes,
				trailer: this.exportScreens[connection.onscreen_id].trailer,
				connections: {}
			};
			const Connection = {
				type: connection.type,
				info: connection.info
			}
			const unique_id = connection.onscreen_id + '-' + (connection.book_id > 0 ? connection.book_id : 0) + '-' + (connection.short_id > 0 ? connection.short_id : 0);
			if(connection.book_id > 0) {
				// To Screen
				const BookConnection = {
					book_id: connection.book_id,
					title: this.exportBooks[connection.book_id].title,
					type: this.exportBooks[connection.book_id].type,
					published: this.exportBooks[connection.book_id].published,
					publisher: this.exportBooks[connection.book_id].publisher,
					series_name: this.exportBooks[connection.book_id].series_name,
					series_no: this.exportBooks[connection.book_id].series_no,
					connection_type: connection.type,
				    connection_info: connection.info
				}
				this.exportScreens[connection.onscreen_id]['books'].push(BookConnection);

				// To Book
				if (this.exportBooks[connection.book_id] !== undefined) {
					if (this.exportBooks[connection.book_id]['onscreen'] === undefined) {
						this.exportBooks[connection.book_id]['onscreen'] = [];
					}
					if(this.exportBooks[connection.book_id]['onscreen'][connection.onscreen_id] === undefined){
						this.exportBooks[connection.book_id]['onscreen'][connection.onscreen_id] = Screen;
					}
					this.exportBooks[connection.book_id]['onscreen'][connection.onscreen_id].connections[unique_id] = Connection;
				}
			}
			if(connection.short_id > 0) {
				// To Screen
				const ShortConnection = {
					short_id: connection.short_id,
					title: this.exportShorts[connection.short_id].title,
					subtitle: this.exportShorts[connection.short_id].subtitle,
					type: this.exportShorts[connection.short_id].type,
					published: this.exportShorts[connection.short_id].first_pub_date,
					publisher: this.exportShorts[connection.short_id].first_pub_in,
					collection_id: this.exportShorts[connection.short_id].first_collected,
					collection_title: this.exportShorts[connection.short_id].collection_title,
					collection_published: this.exportShorts[connection.short_id].collection_published,
					connection_type: connection.type,
				    connection_info: connection.info
				}
				this.exportScreens[connection.onscreen_id]['shorts'].push(ShortConnection);

				// To Short
				if (this.exportShorts[connection.short_id] !== undefined) {
					if (this.exportShorts[connection.short_id]['onscreen'] === undefined) {
						this.exportShorts[connection.short_id]['onscreen'] = [];
					}
					if(this.exportShorts[connection.short_id]['onscreen'][connection.onscreen_id] === undefined){
						this.exportShorts[connection.short_id]['onscreen'][connection.onscreen_id] = Screen;
					}
					this.exportShorts[connection.short_id]['onscreen'][connection.onscreen_id].connections[unique_id] = Connection;
				}
			}
		}

		// Add Short Story Collection connections
		for (let connection_coll of this.screen_connections$) {
			const Screen = {
				onscreen_id: Number(connection_coll.onscreen_id),
				title: this.exportScreens[connection_coll.onscreen_id].title,
				slug: this.exportScreens[connection_coll.onscreen_id].slug,
				year: this.exportScreens[connection_coll.onscreen_id].year,
				poster: this.exportScreens[connection_coll.onscreen_id].poster,
				type: this.exportScreens[connection_coll.onscreen_id].type,
				network: this.exportScreens[connection_coll.onscreen_id].network,
				rated: this.exportScreens[connection_coll.onscreen_id].rated,
				runtime: this.exportScreens[connection_coll.onscreen_id].runtime,
				seasons: this.exportScreens[connection_coll.onscreen_id].seasons,
				episodes: this.exportScreens[connection_coll.onscreen_id].episodes,
				imdb_id: this.exportScreens[connection_coll.onscreen_id].imdb_id,
				imdb_rating: this.exportScreens[connection_coll.onscreen_id].imdb_rating,
				imdb_votes: this.exportScreens[connection_coll.onscreen_id].imdb_votes,
				trailer: this.exportScreens[connection_coll.onscreen_id].trailer,
				connections: {}
			};
			const Connection = {
				type: connection_coll.type,
				info: connection_coll.info
			}
			const unique_id = connection_coll.onscreen_id + '-' + (connection_coll.book_id > 0 ? connection_coll.book_id : 0) + '-' + (connection_coll.short_id > 0 ? connection_coll.short_id : 0);
			if(connection_coll.short_id > 0) {
				if(this.exportShorts[connection_coll.short_id]['books'] !== undefined) {
					for (let collection of this.exportShorts[connection_coll.short_id]['books']) {
						if (this.exportBooks[collection.book_id]['onscreen'] === undefined) {
							this.exportBooks[collection.book_id]['onscreen'] = [];
						}
						if(this.exportBooks[collection.book_id]['onscreen'][connection_coll.onscreen_id] === undefined){
							this.exportBooks[collection.book_id]['onscreen'][connection_coll.onscreen_id] = Screen;
						}
						this.exportBooks[collection.book_id]['onscreen'][connection_coll.onscreen_id].connections[unique_id] = Connection;
					}
				}
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
			if (!book['onscreen']) {
				book['onscreen'] = []
			} else {
				book['onscreen'] = this.lib.sortObject(book['onscreen'], 'year');
				let converted = [];
				for(let scr of book['onscreen']) {
					scr.connections = Object.values(scr.connections)
					converted.push(scr);
				}
				book['onscreen'] = converted;
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
			if (!short['onscreen']) {
				short['onscreen'] = [];
			} else {
				short['onscreen'] = this.lib.sortObject(short['onscreen'], 'year');
				let converted = [];
				for(let scr of short['onscreen']) {
					scr.connections = Object.values(scr.connections)
					converted.push(scr);
				}
				short['onscreen'] = converted;
			}
			this.finalShorts.push(short);
		}
		this.exportJSONshorts = JSON.stringify(this.lib.sortObject(this.finalShorts, 'first_pub_date'));

		// Build Final Array (Screens)
		for (let screen of Object.values(this.exportScreens)) {
			if (!screen['books']) {
				screen['books'] = [];
			}
			if (!screen['shorts']) {
				screen['shorts'] = []
			}
			this.finalScreens.push(screen);
		}
		this.exportJSONscreens = JSON.stringify(this.lib.sortObject(this.finalScreens, 'year'));

		let last_books = '2020-07-01';
		let last_shorts = '2020-07-01';
		let last_screens = '2020-12-01';
		this.books$.forEach(book => {
			let lastmod = book.last_modified.toDate().toISOString().substring(0,10);
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
			let lastmod = short.last_modified.toDate().toISOString().substring(0,10);
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
			let lastmod = screen.last_modified.toDate().toISOString().substring(0,10);
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

	updateFirestoreData(type) {
		if(type === 'books') {
			this.afs.doc(`data/books`).set({...this.finalBooks});
			alert('Live Data updated ['+type+']')
		}
		if(type === 'shorts') {
			this.afs.doc(`data/shorts`).set({...this.finalShorts});
			alert('Live Data updated ['+type+']')
		}
		if(type === 'onscreen') {
			this.afs.doc(`data/onscreen`).set({...this.finalScreens});
			alert('Live Data updated ['+type+']')
		}
	}

	downloadJSON(type) {
		var a = document.createElement('a');
		if(type === 'books') {
			var file = new Blob([this.exportJSONbooks], {type: 'application/json'});
		}
		if(type === 'shorts') {
			var file = new Blob([this.exportJSONshorts], {type: 'application/json'});
		}
		if(type === 'onscreen') {
			var file = new Blob([this.exportJSONscreens], {type: 'application/json'});
		}
		a.href = URL.createObjectURL(file);
		a.download = type + '.json';
		a.click();
	}

	exportTable(type) {
		var a = document.createElement('a');
		if(type === 'books') {
			var file = new Blob([JSON.stringify(this.books$)], {type: 'application/json'});
		}
		if(type === 'shorts') {
			var file = new Blob([JSON.stringify(this.shorts$)], {type: 'application/json'});
		}
		if(type === 'editions') {
			var file = new Blob([JSON.stringify(this.editions$)], {type: 'application/json'});
		}
		if(type === 'onscreen') {
			var file = new Blob([JSON.stringify(this.screens$)], {type: 'application/json'});
		}
		if(type === 'book-shorts') {
			var file = new Blob([JSON.stringify(this.book_shorts$)], {type: 'application/json'});
		}
		if(type === 'edition-shorts') {
			var file = new Blob([JSON.stringify(this.edition_shorts$)], {type: 'application/json'});
		}
		if(type === 'onscreen-connections') {
			var file = new Blob([JSON.stringify(this.screen_connections$)], {type: 'application/json'});
		}
		if(type === 'database') {
			let database = {
				'books': this.books$,
				'shorts': this.shorts$,
				'editions': this.editions$,
				'onscreen': this.screens$,
				'book-shorts': this.book_shorts$,
				'edition-shorts': this.edition_shorts$,
				'onscreen-connections': this.screen_connections$
			}
			var file =  new Blob([JSON.stringify(database)], {type: 'application/json'});
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

	updateCustom() {
		// this.books$.forEach(book => {
		// 	const customRef: AngularFirestoreDocument<any> = this.afs.doc(`books/${book.book_id}`);
		// 	customRef.update({
		// 		upcoming: 0
		// 	});
		// 	console.info(book.title + ' updated');
		// });

		// this.editions$.forEach(edition => {
		// 	const customRef: AngularFirestoreDocument<any> = this.afs.doc(`editions/${edition.edition_id}`);
		// 	customRef.update({
		// 		translation: firebase.firestore.FieldValue.delete()
		// 	});
		// 	console.info(edition.title + ' updated');
		// });

		// this.shorts$.forEach(short => {
		// 	const customRef: AngularFirestoreDocument<any> = this.afs.doc(`shorts/${short.short_id}`);
		// 	customRef.update({
		// 		upcoming: 0
		// 	});
		// 	console.info(short.title + ' updated');
		// });

		// this.screens$.forEach(screen => {
		// 	const customRef: AngularFirestoreDocument<any> = this.afs.doc(`onscreen/${screen.onscreen_id}`);
		// 	customRef.update({
		// 		slug: this.lib.seoUrl(screen.title)
		// 	});
		// 	console.info(screen.title + ' updated');
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

	getScreenConnections(ref) {
		if (this.screen_connections$) {
			if (ref.onscreen_id) {
				return this.screen_connections$.filter(s => s.onscreen_id == ref.onscreen_id)
			}
		} else {
			return false;
		}
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
				directors: !Form.value.directors ? data.Director?.replace("N/A","") : Form.value.directors, // .replace(/ \(.*?\)/g,"")
				writers: !Form.value.writers ? data.Writer?.replace("N/A","") : Form.value.writers, // .replace(/ \(.*?\)/g,"")
				imdb_rating: imdb_rating ? imdb_rating : Form.value.imdb_rating,
				imdb_votes: data.imdbVotes && data.imdbVotes != 'N/A' ? Number(data.imdbVotes.replace(/,/g,"")) : 0,
				rotten_tomatoes: rotten_tomatoes ? rotten_tomatoes : Form.value.rotten_tomatoes,
				metascore: metascore ? metascore : Form.value.metascore,
				production: !Form.value.production && data.Production ? data.Production : Form.value.production,
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
