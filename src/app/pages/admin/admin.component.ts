import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { LibraryService } from '../../services/library.service'
import { FirestoreService } from '../../services/firestore.service'
import { Title } from '@angular/platform-browser'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

interface Alert {
	type: string;
	message: string;
}

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
	showData = false;

	// Forms
	showBooksForm = false;
	showEditionsForm = false;
	showShortsForm = false;
	showBooksShortsForm = false;
	showEditionsShortsForm = false;

	books$;
	editions$;
	shorts$;
	book_shorts$;
	edition_shorts$;

	exportBooks = {};
	exportEditions = [];
	exportEditionShorts = [];
	exportShorts = [];
	finalBooks = [];
	exportJSONbooks: string;
	finalShorts = [];
	exportJSONshorts: string;

	bookForm = this.fb.group({
		book_id: [0, Validators.required],
		type: ['', Validators.required],
		title: ['', Validators.required],
		published: [''],
		publisher: [''],
		pages: [0],
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
		note: ['']
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

	constructor(public lib: LibraryService, private live: FirestoreService, private afs: AngularFirestore, private browser: Title, private fb: FormBuilder, private modalService: NgbModal) { }

	ngOnInit() {
		this.browser.setTitle(`Администрация - Stephen King`)
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
		this.showData = section == 'data' ? true : false;
	}

	openModal(content) {
		this.modalService.open(content, { size: 'lg', centered: true }).result.then(
			(result) => {},
			(close) => {
				this.showBooksForm = false;
				this.showEditionsForm = false;
				this.showShortsForm = false;
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
				book_id: 0,
				type: '',
				title: '',
				published: '',
				publisher: '',
				pages: 0,
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
				short_id: 0,
				type: '',
				title: '',
				subtitle: '',
				first_pub_date: '',
				first_pub_in: '',
				first_collected: 0,
				note: ''
			}
		}
		this.shortForm.patchValue(data);
		this.showShortsForm = true;
	}

	editEdition(data) {
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
		this.afs.doc(`books/${this.bookForm.value.book_id}`).set(this.bookForm.value, { merge: true });
		this.modalService.dismissAll();
	}

	onBookShortFormSubmit() {
		this.afs.doc(`book-shorts/${this.bookShortForm.value.book_id}-${this.bookShortForm.value.short_id}`).set(this.bookShortForm.value, { merge: true });
		this.modalService.dismissAll();
	}

	onEditionFormSubmit() {
		this.afs.doc(`editions/${this.editionForm.value.edition_id}`).set(this.editionForm.value, { merge: true });
		this.modalService.dismissAll();
	}

	onEditionShortFormSubmit() {
		this.afs.doc(`edition-shorts/${this.editionShortForm.value.edition_id}-${this.editionShortForm.value.short_id}`).set(this.editionShortForm.value, { merge: true });
		this.modalService.dismissAll();
	}

	onShortFormSubmit() {
		this.afs.doc(`shorts/${this.shortForm.value.short_id}`).set(this.shortForm.value, { merge: true });
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
				published: this.exportBooks[book_short.book_id].published
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
				published: this.exportEditions[edition_short.edition_id].published
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
		const select = this.shorts$.filter(s => s.type == 'screenplay');
		select.forEach(short => {
			const customRef: AngularFirestoreDocument<any> = this.afs.doc(`shorts/${short.short_id}`);
			customRef.update({
				type: short.type.replace("screenplay", "Сценарий")
			});
			console.log(short.title + ' updated');
		});
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
					note: short.note,
				}
				shortRef.set(data);
			}
		});
	}

}
