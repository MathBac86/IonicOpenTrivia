import {Component, OnInit} from '@angular/core';
import {Platform, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  /*formulaire*/
  pseudo = '';
  difficulte: string = 'easy';
  sauvegarder: boolean = false;

  static readonly STORAGE_KEY: string = 'user';
  subscription: Subscription;


  constructor(private toastCtrl: ToastController,
              private routeur: Router,
              private storage: NativeStorage,
              private platform: Platform) {}

  ngOnInit(): void {
     const store = this.storage.getItem(HomePage.STORAGE_KEY);
    //lecture des données sauvegarder au démarrage de l'application
     if(store){
       store.then(
         data => {
            if(data){
              this.pseudo = data.pseudo;
              this.difficulte = data.difficulty;
              this.sauvegarder = true;
            }
         },
         error => {
           console.log(error.message);
         }
       );
     }
  }

  ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

  private async showToast(msg: string){
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2500,
      position: 'top'
    });

    await  toast.present();
  }

  commencer(): void {
    if(this.pseudo.trim().length < 3 || this.difficulte === ''){
      this.showToast('Veuillez rentrer un pseudo et une difficulté');
    }
    else{
      //Stockage des informations
      if(this.sauvegarder){
        this.storage.setItem(HomePage.STORAGE_KEY, {
          pseudo: this.pseudo,
          difficulty: this.difficulte
        }).then(
          () => console.log('User enregistré'),
          error => console.log('Erreur d\'enregistrement du user')
        );
      }
      else{
        //efface tout ce qui est enregistré
        this.storage.clear();
      }


      //Appeler ma page game en lui fournissant le pseudo et la difficulté
      this.routeur.navigate(['/game', this.pseudo, this.difficulte]);
    }
  }


}
