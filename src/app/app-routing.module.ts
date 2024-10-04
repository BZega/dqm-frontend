import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonsterListComponent } from './components/monster-list/monster-list.component';
import { MonsterMaxStatsComponent } from './components/monster-max-stats/monster-max-stats.component';

const routes: Routes = [
  {path: 'monster-list', component: MonsterListComponent, title: "Monster Finder"},
  {path: 'monster-max-stats', component: MonsterMaxStatsComponent, title: "Monster Max Stat Calc"},
  {path: "", redirectTo: "/monster-list", pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
