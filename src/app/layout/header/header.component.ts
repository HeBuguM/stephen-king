import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

	darkModeSelected = localStorage.getItem("darkSwitch") !== null && localStorage.getItem("darkSwitch") === "dark";

	constructor(public auth: AuthService,private el: ElementRef, private renderer: Renderer2) { }

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

	collapseMainMenuToggle() {
		const collapse_button = document.getElementById("mainMenuToggler");
		const collapsed_menu = document.getElementById("navbarSupportedContent");
		if(collapsed_menu.classList.contains("show")) {
			collapsed_menu.classList.remove("show");
			collapse_button.classList.add("collapsed");
			collapse_button.setAttribute("aria-expanded","false");
		}
    }

}
