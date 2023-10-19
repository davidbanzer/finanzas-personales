import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) { }

  async presentLoading(message: string) {
    if (!this.loading) {
      this.loading = await this.loadingCtrl.create({
        message
      });
      await this.loading.present();
    }
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
