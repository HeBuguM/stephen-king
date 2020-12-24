export class Book {
	book_id: number; // book_id elsewhere
	type: string;
	title: string;
	published: string;
	publisher: string;
	pages: number;
	synopsis: string;
	note: string;
	alterations: string;
	series_name: string;
	series_no: number;
	pseudonym: string;
	co_writers: string;
	wikipedia: string;
	official_site: string;
	goodreads: number;
	editions: Array<BookEditions[]>;
	shorts: Array<BookShort>;
	onscreen: Array<BookScreens>;
}

export class BookEditions {
	edition_id: number;
	book_id: number;
	language: 'bg' | 'en'; // Only 'bg' so far
	group_id: number;
	title: string;
	published: string; // YYYY-MM-DD | YYYY-MM | YYYY
	publisher: string;
	pages: number;
	translation: string; // Translator Names (comma separated)
	note: string;
	goodreads: number;
	shorts: Array<EditionShort>
}

export class BookShort {
	short_id: number;
	type: string;
	title: string;
	subtitle: string;
	first_pub_in: string;
	first_pub_date: string;
	position: number;
}

export class EditionShort {
	short_id: number;
	title: string;
	subtitle: string;
	position: number;
}
export class BookScreens {
	onscreen_id: number;
	title: string;
	slug: string;
	year: string;
	poster: string;
	type: string;
	network: string;
	rated: string;
	runtime: number;
	seasons: number;
	episodes: number;
	imdb_id: string;
	imdb_rating: string;
	imdb_votes: string;
	trailer: string;
	connections: Array<any>;
}
