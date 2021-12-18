import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { finalize } from 'rxjs/operators';
import { ShortenerService } from './shortener.service';
import { ToastController } from '@ionic/angular';

interface URLCard {
  title: string;
  long_url: string;
  short_url: string;
  created_at: number;
  counter: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  inputURL: any = '';
  URLCards: URLCard[] = [];

  constructor(private shortenerService: ShortenerService, public toastCtrl: ToastController) {}

  ngOnInit() {
    this.isLoading = false;
    /*
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });*/
  }

  shortURL(url: string) {
    if (url == '') {
      this.showToastMsg('No has introducido ningún enlace 🙄');
    }
    console.log(url);
    this.shortenerService.postURL(url).subscribe((result: any) => {
      console.log(result);

      this.URLCards.push({
        title: this.title(url),
        long_url: result.url,
        short_url: environment.serverUrl + '/' + result.code,
        created_at: result.created_at,
        counter: 0,
      });
      this.inputURL = '';
      this.showToastMsg('URL acortada correctamente 🤗');
    });
  }

  title(url: any) {
    var title = url.split('/', 3);
    return title[2];
  }

  orderDates() {
    this.URLCards.reverse();
  }

  updateCounter(card: URLCard) {
    var aux: any;
    for (aux in this.URLCards) {
      if (aux.long_url == card.long_url) {
        aux.counter++;
      }
    }
    return this.URLCards;
  }

  public copyForClipboard(event: MouseEvent, short_url: string): void {
    event.preventDefault();
    const payload: string = short_url;
    this.showToastMsg('Copiado al portapapeles 👍🏼');

    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window['clipboardData'];
      clipboard.setData('text', payload.toString());
      e.preventDefault();
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }
  showToastMsg(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 1800,
      })
      .then((toastRes) => {
        console.log(toastRes);
        toastRes.present();
      });
  }
}
