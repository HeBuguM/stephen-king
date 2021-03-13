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
		description: 'Информация за произведенията на Краля на ужаса и публикуваните такива в България.',
		image: 'https://stephen-king.info/assets/img/shorts_books.jpg',
		slug: ''
	});
  }

}
