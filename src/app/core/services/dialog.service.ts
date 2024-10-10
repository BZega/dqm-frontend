import { Component, Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MonsterMaxStatsComponent } from "src/app/components/monster-max-stats/monster-max-stats.component";
import { Monster } from "../models/monster";

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<Component>) { }

  getMonsterMaxStats(monster: Monster): MatDialogRef<MonsterMaxStatsComponent> {
    return this.dialog.open(MonsterMaxStatsComponent, {
        autoFocus: true,
        panelClass: 'monster-max-stats',
        maxWidth: 800,
        data: {monster: monster}
    });
  }
}