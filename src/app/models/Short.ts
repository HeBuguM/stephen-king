export class Short {
    short_id:number;
    type:string;
    title:string;
    subtitle: string;
    first_pub_date: string; // YYYY-MM-DD | YYYY-MM | YYYY
	first_pub_in: string;
	synopsis: string;
	note:string;
	wikipedia:string;
    official_site: string;
    goodreads:number;
    first_collected: number;
    collection_title: string;
    collection_published: string;
    books: Array<ShortBooks>;
	editions:Array<ShortEditions>;
	onscreen: Array<ShortScreens>;
}

export class ShortBooks {
    book_id: number;
    title: string;
	published: string;
	publisher: string;
}

export class ShortEditions {
    edition_id: number;
	title: string;
	subtitle: string;
    edition_title: string;
	published: string; // YYYY-MM-DD | YYYY-MM | YYYY,
	publisher: string;
}

export class ShortScreens {
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

