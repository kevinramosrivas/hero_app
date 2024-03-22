import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

  public heroForm =  new FormGroup({
    id: new FormControl<string>(''),
    superhero:new FormControl<string>('',{nonNullable:true}),
    publisher:new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:new FormControl<string>(''),
    first_appearance:new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>(''),
  });


  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroServices:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ){

  }
  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.heroServices.getHeroById(id))
    ).subscribe(
      hero=>{
        console.log(hero)
        if(!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;
      }
    )
  }

  get currentHero():Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit():void{
    if(this.heroForm.invalid) return;
    if(this.currentHero.id){
      this.heroServices.updateHero(this.currentHero)
      .subscribe( hero => {
        this.showSnackbar('se actualizo exitosamente el heroe');
      }
        
      )
      return;
    }
    this.heroServices.addHero(this.currentHero)
    .subscribe(hero => {
      this.showSnackbar('se creo exitosamente '+hero);
    });

  }

  onDeleteHero() {
    if ( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        //filter nos permite validar si el usuario presiono aceptar o cancelar
        filter( (result: boolean) => result ),
        switchMap( () => this.heroServices.deleteHeroById( this.currentHero.id )),
        //filter nos permite validar si el heroe fue eliminado
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        this.router.navigate(['/heroes']);
      });

  }
  



  showSnackbar(message: string){
    this.snackbar.open(message,'done',{
      duration:2500,
    })
  }
}
