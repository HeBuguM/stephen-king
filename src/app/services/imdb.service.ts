import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IMDbService {
	private omdb_url: string = 'https://www.omdbapi.com';
	private omdb_key: string = atob("NTk3MGZiNDk=");

	constructor(private http: HttpClient) { }

	async getTitleData (imdb_id) {
		let resp = [];
		await this.http.get<any[]>(this.omdb_url+'?i='+imdb_id+'&apikey='+this.omdb_key).toPromise().then(response => {
			resp = response;
		});
		return resp;
	}
}
