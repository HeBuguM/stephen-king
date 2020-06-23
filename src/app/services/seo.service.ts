import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta, private browser: Title) { }

  generateTags(config) {
	// default values
    config = {
		title: 'Стивън Кинг',
		description: 'Информация за произведенията на Краля и публикуваните такива в България.',
		image: 'https://HeBuguM.github.io/stephen-king/assets/img/home_shorts.jpg',
		slug: '',
		...config
	}

	this.browser.setTitle(config.title);
	this.meta.updateTag({ name: 'description', content: config.description });

	this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: '@СтивънКинг' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Стивън Кинг' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
	this.meta.updateTag({ property: 'og:url', content: `https://hebugum.github.io/stephen-king/#/${config.slug}` });

  }

}
