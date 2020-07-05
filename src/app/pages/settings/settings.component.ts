import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LibraryService } from 'src/app/services/library.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

	constructor(public lib: LibraryService,public auth: AuthService) { }

	JSONData;

	ngOnInit(): void {
		if (localStorage.getItem("data_id") === null) {
			localStorage.setItem('data_id', new Date().getTime().toString());
		}
	}

	get localStorageData() {
		let data = {
			data_id: localStorage.getItem("data_id"),
			data_modified: localStorage.getItem("data_modified"),
			data_sync: localStorage.getItem("data_sync"),
			read_books: JSON.parse(localStorage.getItem("read_books")),
			read_shorts: JSON.parse(localStorage.getItem("read_shorts")),
			selected_editions: JSON.parse(localStorage.getItem("selected_editions")
			)
		};
		return data;
	}

	downloadData() {
		var a = document.createElement('a');
		var file = new Blob([JSON.stringify(this.localStorageData)], {type: 'application/json'});
		a.href = URL.createObjectURL(file);
		a.download = 'СтивънКинг-' + new Date().toISOString().substring(0,10)+'-'+ Date.now()+'.json';
		a.click();
	}

	deleteLocalStorageData() {
		if(confirm("Сигурни ли сте? Това ще изтрие всички отбелязани книги, разкази и т.н.")) {
			localStorage.clear();
		}
	}

	importFromJSON() {
		try {
			let json_data = JSON.parse(this.JSONData);
			if(
				typeof json_data.data_id !== 'undefined'
				&& typeof json_data.data_modified !== 'undefined'
				&& typeof json_data.data_sync !== 'undefined'
				&& typeof json_data.read_books !== 'undefined'
				&& typeof json_data.read_shorts !== 'undefined'
				&& typeof json_data.selected_editions !== 'undefined'
			) {
				localStorage.setItem("data_id", json_data.data_id.toString());
				if(json_data.data_modified !== null) {
					localStorage.setItem("data_modified", json_data.data_modified.toString());
				}
				if(json_data.data_sync !== null) {
					localStorage.setItem("data_sync", json_data.data_sync.toString());
				}
				if(json_data.read_books !== null) {
					localStorage.setItem("read_books", JSON.stringify(json_data.read_books));
				}
				if(json_data.read_shorts !== null) {
					localStorage.setItem("read_shorts", JSON.stringify(json_data.read_shorts));
				}
				if(json_data.selected_editions) {
					localStorage.setItem("selected_editions", JSON.stringify(json_data.selected_editions));
				}
				alert("Данните са заредени успешно!")
			}

		} catch (e) {
			console.log(e);
			alert("Невалидно съдържание!")
		}
	}

}
