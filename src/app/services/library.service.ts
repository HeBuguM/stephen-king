import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Book } from '../models/Book';
import { Short } from '../models/Short';
import { Onscreen } from '../models/Onscreen';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class LibraryService {
	private booksUrl: string = environment.appBaseHref + 'assets/data/books.json';
	private shortsUrl: string = environment.appBaseHref + 'assets/data/shorts.json';
	private onscreenUrl: string = environment.appBaseHref + 'assets/data/onscreen.json';

	public book_series = [
		{ 'en': 'Bill Hodges', 'bg': 'Бил Ходжис' },
		{ 'en': 'The Shining', 'bg': 'Сиянието' },
		{ 'en': 'The Talisman', 'bg': 'Талисманът' },
		{ 'en': 'The Dark Tower', 'bg': 'Тъмната Кула' }
	];
	public book_types = ['Роман', 'Новела', 'Сборник', 'Сценарий', 'Нехудожествена'];
	public short_types = ['Разказ', 'Новела','Поема','Есе','Пиеса','ТВ Пиеса','Сценарий','Притча'];
	public onscreen_types = ['Филм', 'ТВ Филм', 'Сериал', 'Мини-сериал', 'Епизод'];

	constructor(private http: HttpClient, private afs: AngularFirestore) { }

	publishedDate(date, format: string = "first_short") {
		let months = {
			'01': 'Януари',
			'02': 'Февруари',
			'03': 'Март',
			'04': 'Април',
			'05': 'Май',
			'06': 'Юни',
			'07': 'Юни',
			'08': 'Август',
			'09': 'Септември',
			'10': 'Октомври',
			'11': 'Ноември',
			'12': 'Декември'
		}
		let return_date = '';
		let dates = date.split("|");
		if(format.indexOf('short') != -1) {
			return_date = (dates[0].split(".")[0]).split('-')[0].trim();
		}
		if(format.indexOf('long') != -1) {
			let date = (dates[0].split(".")[0]).trim().split('-');
			if(date.length === 3) {
				return_date = Number(date[2]) +' '+ months[date[1]] +' '+ date[0];
			} else if(date.length === 2) {
				return_date = months[date[1]] +' '+ date[0];
			} else {
				return_date = date[0];
			}
		}
		if(dates.length == 1 || format.indexOf('first') != -1) {
			return return_date;
		} else {
			if(format.indexOf('short') != -1) {
				return_date = return_date + ' — ' + (dates[dates.length-1].split(".")[0]).split('-')[0].trim();
			}
			if(format.indexOf('long') != -1) {
				let date = (dates[dates.length-1].split(".")[0]).trim().split('-');
				if(date.length === 3) {
					return_date = return_date + ' — ' + Number(date[2]) +' '+ months[date[1]] +' '+ date[0];
				} else if(date.length === 2) {
					return_date = return_date + ' — ' + months[date[1]] +' '+ date[0];
				} else {
					return_date = return_date + ' — ' +  date[0];
				}
			}
		}
		return return_date;
	}

	getBooks(): Observable<Book[]> {
		if(environment.libraryData == 'files') {
			return this.http.get<Book[]>(this.booksUrl);
		}
		if(environment.libraryData == 'firestore') {
			return this.afs.doc<Book[]>(`data/books`).valueChanges();
		}
	}

	getShorts(): Observable<Short[]> {
		if(environment.libraryData == 'files') {
			return this.http.get<Short[]>(this.shortsUrl);
		}
		if(environment.libraryData == 'firestore') {
			return this.afs.doc<Short[]>(`data/shorts`).valueChanges();
		}
	}

	getOnscreens(): Observable<Onscreen[]> {
		if(environment.libraryData == 'files') {
			return this.http.get<Onscreen[]>(this.onscreenUrl);
		}
		if(environment.libraryData == 'firestore') {
			return this.afs.doc<Array<Onscreen>>(`data/onscreen`).valueChanges();
		}
	}

	combineShorts(edition_shorts, book_shorts) {
		let combined_shorts = [];
		for (let book_short of book_shorts) {
			const find_edition = edition_shorts.find(e => e.short_id == book_short.short_id);
			const combined_short = {
				short_id: book_short.short_id,
				type: book_short.type,
				original_title: book_short.title,
				original_subtitle: book_short.subtitle,
				original_position: book_short.position,
				edition_title: find_edition ? find_edition.title : "",
				edition_subtitle: find_edition ? find_edition.subtitle : "",
				edition_position: find_edition ? find_edition.position : 99
			}
			combined_shorts.push(combined_short);
		}
		return this.sortObject(combined_shorts, 'edition_position');
	}

	bookReadToggle(book, new_state) {
		let readBooks = localStorage.getItem("read_books") !== null ? JSON.parse(localStorage.getItem("read_books")) : {};
		if(new_state == true) {
			readBooks[book.book_id] = new_state;
		} else {
			delete readBooks[book.book_id];
		}
		if (localStorage.getItem("data_id") === null) {
			localStorage.setItem('data_id', new Date().getTime().toString());
		}
		localStorage.setItem("read_books", JSON.stringify(readBooks));
		localStorage.setItem("data_modified", new Date().getTime().toString());
	}

	isBookRead(book) {
		if (localStorage.getItem("read_books") !== null) {
			let readBooks = JSON.parse(localStorage.getItem("read_books"));
			if (readBooks[book.book_id] === true) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	booksReadCount() {
		let booksRead = 0;
		if (localStorage.getItem("read_books") !== null) {
			const readBooks = JSON.parse(localStorage.getItem("read_books"));
			booksRead = Object.values(readBooks).length
		} else {
			booksRead = 0;
		}
		return booksRead;
	}

	// Editions

	public selectBookEditionToggle(edition, new_state) {
		let selectedEditions = localStorage.getItem("selected_editions") !== null ? JSON.parse(localStorage.getItem("selected_editions")) : {};
		if(new_state == true) {
			selectedEditions[edition.book_id] = (edition.group_id != 0 ? edition.group_id : edition.edition_id);
		} else {
			delete selectedEditions[edition.book_id];
		}
		if (localStorage.getItem("data_id") === null) {
			localStorage.setItem('data_id', new Date().getTime().toString());
		}
		localStorage.setItem("selected_editions", JSON.stringify(selectedEditions));
		localStorage.setItem("data_modified", new Date().getTime().toString());
	}

	hasSelectedEdition(edition) {
		if (localStorage.getItem("selected_editions") !== null) {
			let selectedEditions = JSON.parse(localStorage.getItem("selected_editions"));
			if (selectedEditions[edition.book_id] !== undefined) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	isEditionSelected(edition) {
		if (localStorage.getItem("selected_editions") !== null) {
			let selectedEditions = JSON.parse(localStorage.getItem("selected_editions"));
			if (selectedEditions[edition.book_id] === edition.edition_id || (edition.group_id > 0 && selectedEditions[edition.book_id] === edition.group_id)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	selectedEditionsCount() {
		let selectedEditions = 0;
		if (localStorage.getItem("selected_editions") !== null) {
			const editionsSelected = JSON.parse(localStorage.getItem("selected_editions"));
			selectedEditions = Object.values(editionsSelected).length
		} else {
			selectedEditions = 0;
		}
		return selectedEditions;
	}

	// Shorts

	isShortRead(short) {
		if (localStorage.getItem("read_shorts") !== null) {
			let readShorts = JSON.parse(localStorage.getItem("read_shorts"));
			if (readShorts[short.short_id] === true) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	isShortCollectionRead(short) {
		if (short.books.length > 0 && short.editions.length > 0 && localStorage.getItem("read_books") !== null) {
			let readBooks = JSON.parse(localStorage.getItem("read_books"));
			for (const book of short.books) {
				if (readBooks[book.book_id] === true) {
					return true;
				}
			}
			return false;
		} else {
			return false;
		}
	}

	shortsReadCount() {
		let shortsRead = 0;
		if (localStorage.getItem("read_shorts") !== null) {
			const readShorts = JSON.parse(localStorage.getItem("read_shorts"));
			shortsRead = Object.values(readShorts).length
		} else {
			shortsRead = 0;
		}
		return shortsRead;
	}

	shortReadToggle(short, new_state) {
		let readShorts = localStorage.getItem("read_shorts") !== null ? JSON.parse(localStorage.getItem("read_shorts")) : {};
		if(new_state == true) {
			readShorts[short.short_id] = new_state;
		} else {
			delete readShorts[short.short_id];
		}
		if (localStorage.getItem("data_id") === null) {
			localStorage.setItem('data_id', new Date().getTime().toString());
		}
		localStorage.setItem("read_shorts", JSON.stringify(readShorts));
		localStorage.setItem("data_modified", new Date().getTime().toString());
	}

	// Util

	groupBy(OurArray, property) {
		return OurArray.reduce(function (accumulator, object) {
			const key = object[property];
			if (!accumulator[key]) {
				accumulator[key] = [];
			}
			accumulator[key].push(object);
			return accumulator;
		}, []);
	}

	countUniques(OurArray, property) {
		const groups = OurArray.map(e => e[property]);
		return new Set(groups).size;
	}

	sortObject(sort_this, key, order = 'asc') {
		const new_object: any = Object.values(sort_this);
		new_object.sort((a, b) => {
			if ((isNaN(parseFloat(a[key])) || !isFinite(a[key])) || (isNaN(parseFloat(b[key])) || !isFinite(b[key]))) {
				//Isn't a number so lowercase the string to properly compare
				if (String(a[key]).toLowerCase() < String(b[key]).toLowerCase()) return (order == 'asc' ? -1 : 1);
				if (String(a[key]).toLowerCase() > String(b[key]).toLowerCase()) return (order == 'asc' ? 1 : -1);
			}
			else {
				//Parse strings as numbers to compare properly
				if (parseFloat(a[key]) < parseFloat(b[key])) return (order == 'asc' ? -1 : 1);
				if (parseFloat(a[key]) > parseFloat(b[key])) return (order == 'asc' ? 1 : -1);
			}
			return (a[key] > b[key]) ? 1 : -1;
		}
		);
		return new_object;
	}
}
