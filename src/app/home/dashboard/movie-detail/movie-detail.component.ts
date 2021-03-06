import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from 'src/app/api/movie';
import { MovieList } from 'src/app/api/movie-list';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastController, LoadingController } from '@ionic/angular';
import { MoviesService } from 'src/app/api/movies.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})

export class MovieDetailComponent implements OnInit {
  @Output() public hide = new EventEmitter();
  @Input() public movie?: Movie;
  @Input() public active: boolean;
  @Input() public favorites: MovieList;
  @Input() public myList: MovieList;
  @Input() public downloads: Movie[];
  now: number;

  constructor(
    private socialSharing: SocialSharing,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private moviesService: MoviesService,
    private storage: Storage
  ) { }

  ngOnInit() {
    // Create a reference to the current time in milliseconds.
    this.now = Date.now();
    setInterval(() => this.now = Date.now(), 1000);
  }

  async favoritesAction() {
    /*
      Called when the user clicks on the favore/unfavorite button at the details page.
      It checks if the movie was already favorited and favorites of unfavorites accordingly.
    */
    const loading = await this.loadingController.create({
      keyboardClose: true,
      translucent: true
    });
    const toastDef = {
      message: 'Try again later',
      color: 'danger',
      showCloseButton: false,
      position: 'top' as 'top',
      duration: 2000
    };
    await loading.present();
    try {
      const index = this.favorites.list.findIndex(m => m.id === this.movie.id);
      if (index > -1) {
        // Unfavorite
        await this.moviesService.unfavorite(this.movie);
        this.favorites.list.splice(index, 1);
        this.movie.favorited = false;
        toastDef.color = 'success';
        toastDef.message = 'Movie unfavorited!';
      } else {
        // Favorite
        await this.moviesService.favorite(this.movie);
        this.favorites.list.push(this.movie);
        this.movie.favorited = true;
        toastDef.color = 'success';
        toastDef.message = 'Movie favorited!';
      }
      const toast = await this.toastController.create(toastDef);
      toast.present();
      await loading.dismiss();
    } catch (e) {
      const toast = await this.toastController.create(toastDef);
      toast.present();
      await loading.dismiss();
    }
  }

  async myListAction() {
    /*
      Called when the user clicks on the "add to"/"remove from" MyList button at the details page.
      It checks if the movie was already on the list and updates it accordingly.
    */
    const loading = await this.loadingController.create({
      keyboardClose: true,
      translucent: true
    });
    const toastDef = {
      message: 'Try again later',
      color: 'danger',
      showCloseButton: false,
      position: 'top' as 'top',
      duration: 2000
    };
    await loading.present();
    try {
      const index = this.myList.list.findIndex(m => m.id === this.movie.id);
      if (index > -1) {
        // Remove from My List
        await this.moviesService.removeFromMyList(this.movie);
        this.myList.list.splice(index, 1);
        this.movie.myListed = false;
        toastDef.color = 'success';
        toastDef.message = 'Removed from My List!';
      } else {
        // Add to My List
        await this.moviesService.addToMyList(this.movie);
        this.myList.list.push(this.movie);
        this.movie.myListed = true;
        toastDef.color = 'success';
        toastDef.message = 'Added to My List!';
      }
      const toast = await this.toastController.create(toastDef);
      toast.present();
      await loading.dismiss();
    } catch (e) {
      const toast = await this.toastController.create(toastDef);
      toast.present();
      await loading.dismiss();
    }
  }

  async download() {
    /*
      Called when the user clicks on the download/delete button at the details page.
      It checks if the movie was already downloaded and downloads or deletes it.
    */
    const loading = await this.loadingController.create({
      keyboardClose: true,
      translucent: true
    });
    const toastDef = {
      message: 'Try again later.',
      color: 'error',
      showCloseButton: false,
      position: 'top' as 'top',
      duration: 2000
    };
    await loading.present();
    try {
      const index = this.downloads.findIndex(d => d.id === this.movie.id);
      if (index > -1) {
        // Delete
        this.downloads.splice(index, 1);
        this.movie.downloaded = false;
        toastDef.color = 'success';
        toastDef.message = 'Movie Deleted!';
      } else {
        // Download
        this.movie.timeDownloaded = Date.now();
        this.movie.downloaded = true;
        this.downloads.push(this.movie);
        toastDef.color = 'success';
        toastDef.message = 'Movie Downloaded!';
      }
      const toast = await this.toastController.create(toastDef);
      toast.present();
      await loading.dismiss();
      await this.storage.set('downloads', this.downloads);
    } catch (e) {
      const toast = await this.toastController.create(toastDef);
      toast.present();
      await loading.dismiss();
    }
  }

  share() {
    // This function is called when the user shares a movie, it opens the share sheet and shares the movie poster.
    this.socialSharing.share(
      'Share Movie Poster',
      '',
      `http://image.tmdb.org/t/p/w780/${(this.movie.backdrop_path || this.movie.poster_path)}`
    ).then(() => {})
    .catch(() => {});
  }
}
