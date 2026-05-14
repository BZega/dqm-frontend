import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { DWM2Monster, MonsterTypeNames } from 'src/app/core/models/dwm2-monster';
import { DWM2Service } from 'src/app/core/services/dwm2.service';

@Component({
  standalone: false,
  selector: 'app-dwm2-monster-lookup',
  templateUrl: './dwm2-monster-lookup.component.html',
  styleUrls: ['./dwm2-monster-lookup.component.scss']
})
export class DWM2MonsterLookupComponent implements OnInit, OnDestroy {
  searchCtrl = new FormControl('');
  allMonsterNames: string[] = [];
  filteredMonsterNames: string[] = [];
  selectedMonster: DWM2Monster | null = null;
  selectedMonsterTypeName = '';
  loading = false;

  private ngUnsubscribe = new Subject<void>();

  constructor(private dwm2Service: DWM2Service, private cdr: ChangeDetectorRef, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const saved = this.dwm2Service.monsterLookupState;
    const monsterParam = this.route.snapshot.queryParamMap.get('monster');

    if (!monsterParam && saved) {
      this.searchCtrl.setValue(saved.searchValue);
      this.selectedMonster = saved.selectedMonster;
      this.selectedMonsterTypeName = saved.selectedMonster ? (MonsterTypeNames[saved.selectedMonster.type] ?? 'Unknown') : '';
    }

    this.dwm2Service.getAllMonsterNames().subscribe(names => {
      this.allMonsterNames = names;
      this.filteredMonsterNames = names;
      this.cdr.detectChanges();

      if (monsterParam && names.includes(monsterParam)) {
        this.searchCtrl.setValue(monsterParam);
        this.onMonsterSelect(monsterParam);
      }
    });

    this.searchCtrl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe),
      debounceTime(150)
    ).subscribe(value => {
      this.filterMonsters(value || '');
    });
  }

  ngOnDestroy(): void {
    this.dwm2Service.monsterLookupState = {
      searchValue: this.searchCtrl.value || '',
      selectedMonster: this.selectedMonster,
    };
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  filterMonsters(search: string): void {
    if (!search) {
      this.filteredMonsterNames = this.allMonsterNames;
    } else {
      const lower = search.toLowerCase();
      this.filteredMonsterNames = this.allMonsterNames.filter(
        name => name.toLowerCase().includes(lower)
      );
    }
  }

  onMonsterSelect(name: string): void {
    this.loading = true;
    this.dwm2Service.getMonsterByName(name).subscribe({
      next: monster => {
        this.selectedMonster = monster;
        this.selectedMonsterTypeName = MonsterTypeNames[monster.type] ?? 'Unknown';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.selectedMonster = null;
        this.selectedMonsterTypeName = '';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
