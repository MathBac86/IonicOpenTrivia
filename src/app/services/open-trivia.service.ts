import { Injectable } from '@angular/core';
import {Question} from '../modeles/question';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpenTriviaService {

  questions: Question[] = [];
  API_URL: string = 'https://opentdb.com/api.php';

  constructor(private httpClient: HttpClient) { }

  async getQuestions(difficulte: string, nb: number): Promise<Question[]> {
    return new Promise( async (resolve, reject) => {
      let params = new HttpParams();
      params = params.append('amount', nb);
      params = params.append('difficulty', difficulte);

      try{
        const res: any = await this.httpClient.get(this.API_URL, {params}).toPromise();
        //retour avec response_code et results
        if(res && res.results && res.response_code === 0){
          //console.log(res.results);
          this.questions = this.createAnswers(res.results);
          resolve(this.questions);
        }
        else{
          reject('Impossible de récupérer les questions');
        }
      }
      catch (e) {
        reject('Erreur serveur ' + e.message);
      }

    });
  }

  private createAnswers(questions: Question[]): Question[]{

    //Traitement du tableau des réponses
    questions.forEach((q) => {
      q.answers = [];

      //Crée les mauvaises réponses à partir de incorrect_answers
      for(const reponse of q.incorrect_answers){
        q.answers.push({
          correct: false,
          answer: reponse
        });
      }
      //Crée la bonne réponse à partir de correct_answer
      q.answers.push({
        correct: true,
        answer: q.correct_answer
      });

      //shuffle des réponses
      q.answers = this.shuffleArray2(q.answers);

    });

    return questions;
  }

  /**
   * Mélange de Fisher-Yates
   *
   * @param array
   */
  shuffleArray(array: any[]): any[]{
    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      //const temp = array[i];
      //array[i] = array[j];
      //array[j] = temp;
      //Intervertir les valeurs ES6
      [array[i], array[j]] = [array[j], array[i]];
    }
    //[arr[i], arr[j]] = [arr[j], arr[i]];
    return array;
  }

  /**
   * Autre méthode de mélange
   *
   * @param array
   */
  shuffleArray2(array: any[]): any[]{
    //attention respecter le sens du calcul
    return array.sort(() =>  0.5 - Math.random());
  }
}
