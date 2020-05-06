import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Este método lo que hace es emitir creacion de nuevo escritorio al backend
   * @param numero 
   */
  entrar(numero: number) {
    if (!numero) {return;}
    this.router.navigate(['/escritorio', numero]);
  }
}
