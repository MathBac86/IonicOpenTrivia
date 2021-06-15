import { Component, OnInit } from '@angular/core';
import {Question} from '../modeles/question';
import {OpenTriviaService} from '../services/open-trivia.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  pseudo = '';
  difficulte: string = '';
  questionSuivante = false;

  questions: Question[] = [];
  questionCourante: Question;
  numeroQuestion: number = 0;
  score: number = 0;
  jeuFini: boolean = false;

  constructor(
            private openTriviaSrv: OpenTriviaService,
            private route: ActivatedRoute,
            private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.pseudo = params['pseudo'];
      this.difficulte = params['difficulte'];

      this.chargerQuestions();
    });
  }

  async chargerQuestions(){
    //si je rejoue, je réinitialise les variables
    this.numeroQuestion = 0;
    this.score = 0;
    this.questionSuivante = false;
    this.jeuFini = false;

    try{
      this.questions = await this.openTriviaSrv.getQuestions(this.difficulte, 10);
      this.choixQuestion();
      console.log(this.questions);
    }
    catch (e) {
      console.log(e);
    }
  }

  private choixQuestion(): void{
    this.questionCourante = this.questions[this.numeroQuestion];
  }


  reponse(reponse: any): void {
    if(!this.questionSuivante){
      //test de la question
      if(reponse.correct){
        this.score++;
      }
      //affiche la question suivante
      this.questionSuivante = true;

      //Est ce qu'il reste des questions
      if(this.numeroQuestion >= this.questions.length - 1){
        //le jeu est fini
        this.jeuFini = true;
      }
    }
  }

  questionNext(): void{
    this.numeroQuestion++;
    this.questionSuivante = false;
    this.choixQuestion();
  }


  voirScore(): void {
    this.router.navigate(['/score', this.score]);
  }

}
