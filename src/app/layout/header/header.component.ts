import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

	darkModeSelected = localStorage.getItem("darkSwitch") !== null && localStorage.getItem("darkSwitch") === "dark";

	constructor(public auth: AuthService) { }

	ngOnInit() {
		this.initDarkMode();
	}

	darkModeSwitch(mode) {
		this.darkModeSelected = mode;
		if(mode) {
			localStorage.setItem("darkSwitch", "dark");
		} else {
			localStorage.removeItem("darkSwitch");
		}
		this.initDarkMode();
	}

	initDarkMode() {
		if (this.darkModeSelected) {
			document.body.setAttribute("data-theme", "dark");
		} else {
			document.body.removeAttribute("data-theme");
		}
	}

}
