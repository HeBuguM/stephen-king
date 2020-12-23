import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TMDbService {
	private tmdb_url: string = 'https://api.themoviedb.org/3'; // V3
	private tmdb_key: string = atob("YzUxNWQ1NWJjOTFmNjE2N2M1OGNmZjBmMzVjYTVmYWQ=");

	constructor(private http: HttpClient) { }

	requestData(endpoint, options = []) {
		return this.http.get<any[]>(this.tmdb_url + '/' + endpoint + '?api_key=' + this.tmdb_key + (options.length > 0 ? '&' + options.join('&') : ""));
	}

	async getTitleData(tmdb_id) {
		let resp = [];
		await this.http.get<any[]>(this.tmdb_url + '/' + tmdb_id + '/videos?api_key=' + this.tmdb_key).toPromise().then(response => {
			resp = response;
		});
		return resp;
	}
}
