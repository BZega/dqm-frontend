import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Monster, Stats } from 'src/app/core/models/monster';
import { combineLatest, debounceTime, distinctUntilChanged, filter, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { MonsterService } from 'src/app/core/services/monster.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-monster-list',
  templateUrl: './monster-list.component.html',
  styleUrls: ['./monster-list.component.scss']
})
export class MonsterListComponent implements OnInit, OnDestroy {
  @ViewChild('monsterListCdk') cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  @ViewChildren(CdkVirtualScrollViewport) cdkVsv: QueryList<CdkVirtualScrollViewport>;
  
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


  constructor(
    private monsterService: MonsterService,
    private dialogService: DialogService,
    private uiService: UiService
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

    this.monsterService.getAllMonsters().subscribe(monsters => {
      this.allMonsters = monsters;
      this.monsterSelectOptions = monsters;
      this.selectedMonster = monsters[0];
      this.monsterService.selectedMonster.next(this.selectedMonster);
      this.selectedMonsterName = monsters[0].name;
      this.getMonsterTypeAndTacticalType(this.selectedMonster);
      this.filterMonsterOptions();
    });

    this.searchChanged.pipe(takeUntil(this.ngUnsubscribe),
    debounceTime(100),
    ).subscribe(_ => {
      this.filterMonsterOptions();
    });

    this.monsterService.selectedMonster$.pipe(distinctUntilChanged())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(monster => {
        this.selectedMonster = monster;
        this.selectedMonsterName = monster.name;
        console.log("Zega selected monster subscribe", this.selectedMonster);
        this.monsterService.selectedMonster.next(this.selectedMonster)
      })
  }

  ngAfterViewInit() {
    this.cdkVsv.changes.pipe(takeUntil(this.ngUnsubscribe), take(2)).subscribe(x => {
      if (this.cdkVsv.first) this.cdkVsv.first.scrollToIndex(this.uiService.scrollToIndex, 'auto');
    });
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete()
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

  searchMonsters(val: string) {
    this.searchChanged.next(val);
  }

  getMonsterTypeAndTacticalType(monster: Monster) {
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

  onMaxStatClick() {
    const modalOpen = this.monsterService.getMaxStatsModalOpen.getValue();

    if (!modalOpen) {
      this.monsterService.getMaxStatsModalOpen.next(true);
      const modalPromptRef = this.dialogService.getMonsterMaxStats(this.selectedMonster);
      modalPromptRef.afterClosed().subscribe((maxStatMonster: Monster) => {
        this.monsterService.getMaxStatsModalOpen.next(false);

        if (maxStatMonster) {
          this.getMonsterTypeAndTacticalType(maxStatMonster);
        }
      });
    }
  }

  getMonsterImage() {
    if (this.selectedMonsterName) {
      return `./assets/monster-images/${this.selectedMonsterName}.jpg`;
    } else {
      return null;
    }
  }
}
