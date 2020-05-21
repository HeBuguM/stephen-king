import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { LibraryService } from '../../services/library.service'
import { Short } from '../../models/Short'

@Component({
  selector: 'app-shorts',
  templateUrl: './shorts.component.html',
  styleUrls: ['./shorts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShortsComponent implements OnInit {
  shorts:Short[];
  public shortsTotalCount:number;
  public shortsReadCount:number;
  public shortsPublishedBGCount;

  searchValue:string = '';

  loadingState = true;

  private filter_shorts: any = {
    no_read: false,
    with_editions: false,
    no_editions: false,
    in_collection: false,
    no_collection: false,
    read_collection: false
  };
  private sorting_shorts: string = 'first_pub_date';

  constructor(private lib:LibraryService, private browser: Title) { }

  ngOnInit() {
    this.browser.setTitle(`Стивън Кинг - Разкази`)

    if (sessionStorage.getItem('filter_shorts') !== null) {
      this.filter_shorts = JSON.parse(sessionStorage.getItem('filter_shorts'));
    }
    if (sessionStorage.getItem('sorting_shorts') !== null) {
      this.sorting_shorts = sessionStorage.getItem('sorting_shorts');
    }

    this.lib.getShorts().subscribe(shorts => {
      this.shorts = shorts;
      this.shortsTotalCount = shorts.length;
      this.shortsPublishedBGCount = shorts.filter(function (shorts) {
        return shorts.editions.length > 0;
      }).length
      this.shortsReadCount = this.shortsRead();
      this.loadingState = false
      if(this.sorting_shorts != 'first_pub_date') {
        this.changeSorting(this.sorting_shorts)
      }
    });
  }

  public updateSearch(searchTextValue: string) {
    this.searchValue = searchTextValue;
  }

  changeSorting(key) {
    this.sorting_shorts = key;
    this.shorts = this.lib.sortObject(this.shorts,key);
    sessionStorage.setItem('sorting_shorts', this.sorting_shorts)
  }

  getSorting() {
    return this.sorting_shorts;
  }

  changeFilter(key,value) {
    if(this.filter_shorts !== null) {
      this.filter_shorts[key] = value;
      sessionStorage.setItem('filter_shorts', JSON.stringify(this.filter_shorts));
    }
  }

  getFilter(key) {
    return this.filter_shorts !== null && this.filter_shorts[key] !== null ? this.filter_shorts[key] : false;
  }

  shortClasses (short) {
    let classes = {
      short: true,
      'table-success': this.isRead(short),
      'd-none':
          (this.filter_shorts !== null && this.filter_shorts.no_read === true && this.isRead(short))
          || (this.filter_shorts !== null && this.filter_shorts.read_collection && !this.isReadCollection(short))
          || (this.filter_shorts !== null && this.filter_shorts.with_editions && short.editions.length === 0)
          || (this.filter_shorts !== null && this.filter_shorts.no_editions && short.editions.length > 0)
          || (this.filter_shorts !== null && this.filter_shorts.in_collection && short.books.length === 0)
          || (this.filter_shorts !== null && this.filter_shorts.no_collection && short.books.length > 0)
          || (this.searchValue != '' && (JSON.stringify(short).toLowerCase().indexOf(this.searchValue.toLowerCase()) <= -1))
    }
    return classes;
  }

  isRead(short) {
    if(localStorage.getItem("read_shorts") !== null) {
      var readShorts = JSON.parse(localStorage.getItem("read_shorts"));
      if(readShorts[short.short_id] === true) {
        return true;
      } else {
        if(readShorts[short.short_id] === false) {
          return false;
        } else {
          // // Auto mark as read if collection is read
          // if(this.isReadCollection(short) === true) {
          //   return true;
          //   this.shortToggle(short,true)
          // } else {
          //   return false;
          // }
          return false;
        }
      }
    } else {
      return false;
    }
  }

  isReadCollection(short) {
    if(short.books.length > 0 && short.editions.length > 0 && localStorage.getItem("read_books") !== null) {
      var readBooks = JSON.parse(localStorage.getItem("read_books"));
      for (const book of short.books) {
        if(readBooks[book.book_id] === true) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  shortsRead() {
    var shortsRead = 0;
    if(localStorage.getItem("read_shorts") !== null) {
      var readShorts = JSON.parse(localStorage.getItem("read_shorts"));
      shortsRead = Object.values(readShorts).filter(function (read) {
          return read === true;
        }).length
    } else {
      shortsRead = 0;
    }
    return shortsRead;
  }

  shortToggle (short,new_state) {
    var readShorts = localStorage.getItem("read_shorts") !== null ? JSON.parse(localStorage.getItem("read_shorts")) : {};
    readShorts[short.short_id] = new_state;
    localStorage.setItem("read_shorts", JSON.stringify(readShorts));
    this.shortsReadCount = this.shortsRead();
  }

}
