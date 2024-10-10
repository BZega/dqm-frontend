import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, Observable, Subject, takeUntil } from 'rxjs';
import { Monster, Stats } from 'src/app/core/models/monster';
import { MonsterService } from 'src/app/core/services/monster.service';

@Component({
  selector: 'app-monster-max-stats',
  templateUrl: './monster-max-stats.component.html',
  styleUrls: ['./monster-max-stats.component.scss']
})
export class MonsterMaxStatsComponent implements OnInit {
  @ViewChild('monsterListCdk') cdkVirtualScrollViewport: CdkVirtualScrollViewport;

  monsterSelect = new FormControl("");
  selectedMonster$ = this.monsterService.selectedMonster$;
  maxStats: Stats;
  type: string;
  tacticalType: string;
  selectedMonster: Monster = null;
  selectedMonsterName: string;
  searchInputCtrl = new FormControl("");
  allMonsters: Monster[] = [];
  monsterSelectOptions: Monster[] = [];
  filteredAvailableMonsters: Monster[] = [];
  private searchChanged: Subject<string> = new Subject<string>();
  private ngUnsubscribe = new Subject();
  monsterList$: Observable<Monster[]>;
  monsterTypesList = ["None", "Slime", "Dragon", "Nature", "Beast", "Material", "Demon", "Undead", "Boss"];

  maxStatForm = new UntypedFormGroup({
    parent1type: new UntypedFormControl(''),
    parent2type: new UntypedFormControl(''),
    parent1level: new UntypedFormControl(''),
    parent2level: new UntypedFormControl(''),
    gparent1type: new UntypedFormControl(''),
    gparent2type: new UntypedFormControl(''),
    gparent3type: new UntypedFormControl(''),
    gparent4type: new UntypedFormControl(''),
    size: new UntypedFormControl(''),
  });


  constructor(
    private monsterService: MonsterService,
    public dialogRef: MatDialogRef<MonsterMaxStatsComponent>,
  ) { }

  ngOnInit(): void {
    combineLatest([this.selectedMonster$]).pipe(filter((monsters: Monster[]) => !!monsters))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (monsters) => {
          if (monsters && monsters[0]) {
            console.log()
            this.selectedMonster = monsters[0];
            console.log("Zega selected - ", this.selectedMonster);
            this.selectedMonsterName = monsters[0].name;
            console.log("Zega selected name - ", this.selectedMonsterName);
            this.filterMonsterOptions();
          }
        }
      );

    // this.searchChanged.pipe(takeUntil(this.ngUnsubscribe),
    // debounceTime(100),
    // ).subscribe(_ => {
    //   this.filterMonsterOptions();
    // });

    this.monsterService.selectedMonster$.pipe(distinctUntilChanged())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(monster => {
        if (monster) {
          this.selectedMonster = monster;
          this.selectedMonsterName = monster.name;
          console.log("Zega selected monster subscribe", this.selectedMonsterName);
          this.monsterService.selectedMonster.next(this.selectedMonster)
        }
      });

      this.maxStatForm.get('parent1type').setValue('None');
      this.maxStatForm.get('parent2type').setValue('None');
      this.maxStatForm.get('parent1level').setValue('10');
      this.maxStatForm.get('parent2level').setValue('10');
      this.maxStatForm.get('gparent1type').setValue('None');
      this.maxStatForm.get('gparent2type').setValue('None');
      this.maxStatForm.get('gparent3type').setValue('None');
      this.maxStatForm.get('gparent4type').setValue('None');
      this.maxStatForm.get('size').setValue('50');
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  onMonsterSelect(event) {
    const selectedMonster = event.value;

    this.selectedMonster = selectedMonster;
    this.monsterService.selectedMonster.next(this.selectedMonster);
    console.log("On Monster Select - ",this.selectedMonster);
    this.getMonsterTypeAndTacticalType(this.selectedMonster);
  }

  monsterListOpened() {
    setTimeout(() => this.cdkVirtualScrollViewport?.checkViewportSize());
  }

  filterMonsterOptions() {
    let keyword = this.searchInputCtrl.value;
    if (keyword?.length) {
      keyword = keyword.toUpperCase();
      const filtered = this.allMonsters.filter((monster) =>
        monster.name?.toUpperCase().includes(keyword)
      );
      this.filteredAvailableMonsters = filtered;
    } else {
      this.filteredAvailableMonsters = [...this.monsterSelectOptions];
      if (this.selectedMonster) {
        let filteredMonsterSelectOption = this.filteredAvailableMonsters.find(o => o.name === this.selectedMonster?.name);
        if (!filteredMonsterSelectOption) {
          this.filteredAvailableMonsters.unshift(this.selectedMonster)
        }
      }
    }
  }

  cdkTrackBy(i: number, facKey: String) {
    return facKey;
  }

  onClearSearchMonstersClick(searchBox) {
    searchBox.value = '';
    this.searchChanged.next(null);
    this.searchInputCtrl.setValue('');
  }

  searchMonsters (val: string) {
    this.searchChanged.next(val);
  }

  getMonsterTypeAndTacticalType (monster: Monster) {
    if(monster) {
      switch(monster.type) {
        case 1: 
          this.type = "Slime";
          break;
        case 2: 
          this.type = "Dragon";
          break;
        case 3:
          this.type = "Nature";
          break;
        case 4:
          this.type = "Beast";
          break;
        case 5:
          this.type = "Material";
          break;
        case 6:
          this.type = "Demon";
          break;
        case 7:
          this.type = "Undead";
          break;
        case 8:
          this.type = "Boss";
          break;        
      }
      switch (monster.tacticalType) {
        case 1: 
          this.tacticalType = "Trooper";
          break;
        case 2: 
          this.tacticalType = "Commander";
          break;
        case 3: 
          this.tacticalType = "Genius";
          break;
        case 4: 
          this.tacticalType = "Titan";
          break;
      }
      this.maxStats = monster.maxStat;       
    }
  }

  monsterNameToNumber(name: string) {
    switch(name) {
      case "None": 
        return 0;
      case "Slime": 
        return 1;
      case "Dragon":
        return 2;
      case "Nature":
        return 3;
      case "Beast":
        return 4;
      case "Material":
        return 5;
      case "Demon":
        return 6;
      case "Undead":
        return 7; 
      case "Boss":
        return 8;        
    }
  }

  onSubmit() {
    let parent1type = this.monsterNameToNumber(this.maxStatForm.get('parent1type').value);
    let parent2type = this.monsterNameToNumber(this.maxStatForm.get('parent1type').value);
    let parent1level = parseInt(this.maxStatForm.get('parent1level').value);
    let parent2level = parseInt(this.maxStatForm.get('parent1level').value);
    let gparent1type = this.monsterNameToNumber(this.maxStatForm.get('gparent1type').value);
    let gparent2type = this.monsterNameToNumber(this.maxStatForm.get('gparent2type').value);
    let gparent3type = this.monsterNameToNumber(this.maxStatForm.get('gparent3type').value);
    let gparent4type = this.monsterNameToNumber(this.maxStatForm.get('gparent4type').value);
    let size = parseInt(this.maxStatForm.get('size').value);

    this.monsterService.getMonsterMaxStat(this.selectedMonsterName, parent1type, parent2type, parent1level, parent2level, gparent1type, gparent2type, gparent3type, gparent4type, size).subscribe(
      monster => {
      if(monster) {
        this.dialogRef.close(monster);
      }
    });
  }
}
