import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Book } from '../models/Book';
import { Short } from '../models/Short';


const HttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private booksUrl:string = '/assets/data/books.json';
  private shortsUrl:string = '/assets/data/shorts.json';

  constructor(private http:HttpClient) { }

  getBooks():Observable<Book[]>  {
    return this.http.get<Book[]>(this.booksUrl);
  }

  getShorts():Observable<Short[]>  {
    return this.http.get<Short[]>(this.shortsUrl);
  }

  combineShorts(edition_shorts, book_shorts) {
    let combined_shorts = [];
    for (let book_short of book_shorts) {
      const find_edition = edition_shorts.find(e => e.short_id == book_short.short_id);
      const combined_short = {
        short_id: book_short.short_id,
        type: book_short.type,
        original_title: book_short.title,
        original_subtitle: book_short.subtitle,
        original_position: book_short.position,
        edition_title: find_edition ? find_edition.title : "",
        edition_subtitle: find_edition ? find_edition.subtitle : "",
        edition_position: find_edition ? find_edition.position : 99
      }
      combined_shorts.push(combined_short);
    }
    return this.sortObject(combined_shorts, 'edition_position');
  }

  groupBy(OurArray, property) {
    return OurArray.reduce(function (accumulator, object) {
      const key = object[property];
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(object);
    return accumulator;
    }, []);
  }

  countUniques(OurArray,property) {
    const groups = OurArray.map(e => e[property]);
    return new Set(groups).size;
  }

  sortObject (sort_this, key, order = 'asc') {
    const new_object: any = Object.values(sort_this);
    new_object.sort((a,b) => {
      if((isNaN(parseFloat(a[key])) || !isFinite(a[key])) || (isNaN(parseFloat(b[key])) || !isFinite(b[key]))){
        //Isn't a number so lowercase the string to properly compare
        if(String(a[key]).toLowerCase() < String(b[key]).toLowerCase()) return (order == 'asc' ? -1 : 1);
        if(String(a[key]).toLowerCase() > String(b[key]).toLowerCase()) return (order == 'asc' ? 1 : -1);
      }
      else{
        //Parse strings as numbers to compare properly
        if(parseFloat(a[key]) < parseFloat(b[key])) return (order == 'asc' ? -1 : 1);
        if(parseFloat(a[key]) > parseFloat(b[key])) return (order == 'asc' ? 1 : -1);
      }
      return (a[key] > b[key]) ? 1 : -1;
    }
    );
    return new_object;
  }
}
