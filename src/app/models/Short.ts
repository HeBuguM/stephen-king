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
