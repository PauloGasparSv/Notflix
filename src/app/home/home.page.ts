import { Component, OnInit, ViewChild } from '@angular/core';
import { MoviesService } from '../api/movies.service';
import { InfiniteScroll, IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  movieLists: any[];
  showLoader: boolean;

  constructor (private moviesService: MoviesService) {}
  
  ngOnInit() {
    this.showLoader = true;
    this.movieLists = [];
    // Loading the most popular movies async.
    this.moviesService.getPopular()
    .then(response => this.movieLists.push({
      list: response.results,
      title: 'Most Popular'
    }))
    .catch(() => {});
    // Loading the best movies async.
    this.moviesService.getBest()
    .then(response => this.movieLists.push({
      list: response.results,
      title: 'Most Acclaimed'
    }))
    .catch(() => {});
    // Loading the newst movies async.
    this.moviesService.getNewest()
    .then(response => this.movieLists.push({
      list: response.results,
      title: 'Newest in Brazil'
    }))
    .catch(() => {});
  }
  
  loadMoreMovies (event: CustomEvent) {
    const { genre, next } = this.moviesService.randomGenre();
    if (!next) {
      this.showLoader = false;
      (<HTMLInputElement>event.target).disabled = true;
      (<any>event.target).complete();
    }
    if (genre) {
      this.moviesService.getGenre(genre.id)
      .then(response => {
        (<any>event.target).complete();
        this.movieLists.push({list: response.results, title: genre.name});
      })
      .catch(() => (<any>event.target).complete());
    }
  }
}
