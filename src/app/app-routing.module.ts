import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonsterListComponent } from './components/monster-list/monster-list.component';
import { MonsterMaxStatsComponent } from './components/monster-max-stats/monster-max-stats.component';
import { DWM2MonsterLookupComponent } from './components/dwm2-monster-lookup/dwm2-monster-lookup.component';
import { BreedingPlanComponent } from './components/breeding-plan/breeding-plan.component';

const routes: Routes = [
  {path: 'monster-list', component: MonsterListComponent, title: "Monster Finder"},
  {path: 'monster-max-stats', component: MonsterMaxStatsComponent, title: "Monster Max Stat Calc"},
  {path: 'dwm2-lookup', component: DWM2MonsterLookupComponent, title: "DWM2 Monster Lookup"},
  {path: 'breeding-plan', component: BreedingPlanComponent, title: "Breeding Planner"},
  {path: "", redirectTo: "/monster-list", pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
