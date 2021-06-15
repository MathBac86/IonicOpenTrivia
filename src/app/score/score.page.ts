import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
})
export class ScorePage implements OnInit {

  score: number = 0;

  constructor(private route: ActivatedRoute,
              private nacCtrl: NavController) { }

  ngOnInit() {
    this.route.params.subscribe((params) =>{
      this.score = params['score'];
    });
  }

  retour() {
    this.nacCtrl.navigateRoot('/');
  }
}
