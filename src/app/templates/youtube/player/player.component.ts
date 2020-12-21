import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class PlayerComponent implements OnInit {
	@Input() youtubeId: string;
	public videos: Array<any>;
	selected_video;
	main_url = 'https://www.youtube.com/embed/';
	constructor(private sanitizer: DomSanitizer) {}

	ngOnInit() {
		this.videos = this.youtubeId?.length > 0 ? this.youtubeId.split("|") : []
		this.selected_video = this.videos.length > 0 ? this.videos[0] : false;
	}

	initVideoUrl() {
		let url = this.sanitizer.bypassSecurityTrustResourceUrl(this.main_url+this.selected_video+'?autoplay=1');
		return url;
	}

	changeVideo(video) {
		this.selected_video = video;
	}

	countVideos() {
		return this.videos?.length;
	}
}
