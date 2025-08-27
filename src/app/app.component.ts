import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'e-commerce';
   constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ar']);   
    translate.setDefaultLang('en');   
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
