import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  constructor(private seo: SeoService) { }

  ngOnInit(): void {
	this.seo.generateTags({
		title: 'Стивън Кинг',
		description: 'Информация за произведенията на Краля и публикуваните такива в България.',
		image: 'https://hebugum.github.io/stephen-king/assets/img/shorts_books.jpg',
		slug: ''
	});
  }

}
