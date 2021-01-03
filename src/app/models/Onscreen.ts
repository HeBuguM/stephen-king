export class Onscreen {
    onscreen_id: number;
	title: string;
	slug: string;
	type: string;
	status: string;
	imdb_id: string;
	tmdb_id: string;
	year: string;
	released: string;
	rated: string;
	runtime: number;
	seasons: number;
	episodes: number;
	genres: string;
	poster: string;
	directors: string;
	writers: string;
	production: string;
	network: string;
	imdb_rating: number;
	imdb_votes: number;
	rotten_tomatoes: number;
	metascore: number;
	language: string;
	country: string;
	budget: number
	trailer: string;
	wikipedia: string;
	official_site: string;
	books: Array<BookConnection>
	shorts: Array<any>
}

export class BookConnection {
	book_id: number;
	type: string;
	title: string;
	published: string;
	publisher: string;
	series_name: string;
	series_no: number;
	connection_type: string;
	connection_info: string
}

export class ShortConnection {
	book_id: number;
	title: string;
	subtitle: string;
	type: string;
	published: string;
	publisher: string;
	collection_id: number;
	collection_title: string;
	collection_published: string;
	connection_type: string;
	connection_info: string
}
