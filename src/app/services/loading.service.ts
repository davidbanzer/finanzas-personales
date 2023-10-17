import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingCtrl: LoadingController) { }

  async presentLoading(message: string) {
    await this.loadingCtrl.create({
      message
    }).then(loading => loading.present());
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }
}
