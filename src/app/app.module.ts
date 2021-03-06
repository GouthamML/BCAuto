import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http'
import { HTTP } from '@ionic-native/http';
import { HttpClientModule } from '@angular/common/http'





import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { InfoPage } from '../pages/info/info';
import { TransferTemplatePage } from '../pages/transfer-template/transfer-template';
import { HistoryPage } from '../pages/history/history';
import { PartToVehiclePage } from '../pages/part-to-vehicle/part-to-vehicle';
import { ListpartsPage } from '../pages/listparts/listparts';




import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WeatherProvider } from '../providers/weather/weather';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { Geolocation } from '@ionic-native/geolocation';



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SettingsPage,
    LoginPage,
    SignupPage,
    InfoPage,
    TransferTemplatePage,
    HistoryPage,
    PartToVehiclePage,
    ListpartsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule
    

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SettingsPage,
    LoginPage,
    SignupPage,
    InfoPage,
    TransferTemplatePage,
    HistoryPage,
    PartToVehiclePage,
    ListpartsPage
  ],
  providers: [
    StatusBar,
    Geolocation,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WeatherProvider,
    BarcodeScanner,
  Toast,
  HTTP,
  
 
  ]
})
export class AppModule {}
