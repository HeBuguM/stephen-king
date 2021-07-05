import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class MySQLService {

	constructor(private auth: AuthService,private http: HttpClient) { }

	get(table, options?): Observable<any> {
		let body = {'table': table};
		return this.http.post(environment.dataBaseHref +'/admin/get.php', {...body,...options});
	}

	edit(table, data): Observable<any> {
		let body = {
			'table': table,
			'data': data,
			'uid': this.auth.user.uid
		};
		return this.http.post(environment.dataBaseHref +'admin/edit.php', body);
	}
}
