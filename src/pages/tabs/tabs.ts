import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import { PartToVehiclePage } from '../part-to-vehicle/part-to-vehicle';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = PartToVehiclePage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
