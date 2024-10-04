import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonsterListComponent } from './components/monster-list/monster-list.component';
import { MonsterMaxStatsComponent } from './components/monster-max-stats/monster-max-stats.component';
import { PageNavigationComponent } from './shared/page-navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    MonsterListComponent,
    MonsterMaxStatsComponent,
    PageNavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
