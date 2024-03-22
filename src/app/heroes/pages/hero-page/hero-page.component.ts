import {Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrl: './hero-page.component.css',
})
export class HeroPageComponent implements OnInit{

  public hero?: Hero;
  
  constructor(
      private serviceHero:HeroesService,
      private router: Router,
      private activatedRoute:ActivatedRoute
    ){

  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.serviceHero.getHeroById( id )),
      )
      .subscribe( hero => {
        console.log('hello');
        if ( !hero ) return this.router.navigate([ '/heroes/list' ]);

        this.hero = hero;
        return;
      })
  }

  backToList(){
    this.router.navigate(['/heroes/list']);
  }


}
