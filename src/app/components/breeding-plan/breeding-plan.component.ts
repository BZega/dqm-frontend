import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { BreedingPair, BreedingPlanState, TeamPlannerResponse } from 'src/app/core/models/dwm2-monster';
import { DWM2Service } from 'src/app/core/services/dwm2.service';

@Component({
  standalone: false,
  selector: 'app-breeding-plan',
  templateUrl: './breeding-plan.component.html',
  styleUrls: ['./breeding-plan.component.scss']
})
export class BreedingPlanComponent implements OnInit, OnDestroy {
  allMonsterNames: string[] = [];

  // Available monsters
  availableSearchCtrl = new FormControl('');
  filteredAvailableNames: string[] = [];
  selectedAvailable: string[] = [];

  // Target monsters
  targetSearchCtrl = new FormControl('');
  filteredTargetNames: string[] = [];
  selectedTargets: string[] = [];

  // Mode
  breedingMode: 'Direct' | 'TypeAware' = 'TypeAware';

  // Results
  loading = false;
  resultType: 'finalBreeding' | 'breedingPath' | 'breedingSources' | 'teamPlan' | null = null;
  finalBreedingResults: string[] = [];
  breedingPathResults: BreedingPair[] = [];
  breedingSourcesResults: BreedingPair[] = [];
  teamPlanResults: TeamPlannerResponse | null = null;
  errorMessage: string | null = null;

  private ngUnsubscribe = new Subject<void>();

  constructor(private dwm2Service: DWM2Service, private cdr: ChangeDetectorRef, private router: Router) {}

  goToLookup(monsterName: string): void {
    this.router.navigate(['/dwm2-lookup'], { queryParams: { monster: monsterName } });
  }

  ngOnInit(): void {
    const saved = this.dwm2Service.breedingPlanState;
    if (saved) {
      this.selectedAvailable = saved.selectedAvailable;
      this.selectedTargets = saved.selectedTargets;
      this.breedingMode = saved.breedingMode;
      this.resultType = saved.resultType;
      this.finalBreedingResults = saved.finalBreedingResults;
      this.breedingPathResults = saved.breedingPathResults;
      this.breedingSourcesResults = saved.breedingSourcesResults;
      this.teamPlanResults = saved.teamPlanResults;
      this.errorMessage = saved.errorMessage;
    }

    this.dwm2Service.getAllMonsterNames().subscribe(names => {
      this.allMonsterNames = names;
      this.filteredAvailableNames = names;
      this.filteredTargetNames = names;
    });

    this.availableSearchCtrl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe),
      debounceTime(50)
    ).subscribe(value => {
      this.filteredAvailableNames = this.filterNames(value || '');
      this.cdr.detectChanges();
    });

    this.targetSearchCtrl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe),
      debounceTime(50)
    ).subscribe(value => {
      this.filteredTargetNames = this.filterNames(value || '');
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.saveState();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private saveState(): void {
    this.dwm2Service.breedingPlanState = {
      selectedAvailable: this.selectedAvailable,
      selectedTargets: this.selectedTargets,
      breedingMode: this.breedingMode,
      resultType: this.resultType,
      finalBreedingResults: this.finalBreedingResults,
      breedingPathResults: this.breedingPathResults,
      breedingSourcesResults: this.breedingSourcesResults,
      teamPlanResults: this.teamPlanResults,
      errorMessage: this.errorMessage,
    };
  }

  filterNames(search: string): string[] {
    if (!search) return this.allMonsterNames;
    const lower = search.toLowerCase();
    return this.allMonsterNames.filter(n => n.toLowerCase().includes(lower));
  }

  trackByName(index: number, name: string): string {
    return name;
  }

  addAvailable(name: string): void {
    this.selectedAvailable = [...this.selectedAvailable, name];
    this.availableSearchCtrl.setValue('');
  }

  removeAvailable(index: number): void {
    this.selectedAvailable = this.selectedAvailable.filter((_, i) => i !== index);
  }

  addTarget(name: string): void {
    if (this.selectedTargets.length >= 3) return;
    if (!this.selectedTargets.includes(name)) {
      this.selectedTargets = [...this.selectedTargets, name];
    }
    this.targetSearchCtrl.setValue('');
  }

  removeTarget(index: number): void {
    this.selectedTargets = this.selectedTargets.filter((_, i) => i !== index);
  }

  calculateBreedingPlan(): void {
    this.loading = true;
    this.errorMessage = null;
    this.resultType = null;

    const availableCount = this.selectedAvailable.length;
    const targetCount = this.selectedTargets.length;

    // Single available, no target → FinalBreeding
    if (availableCount === 1 && targetCount === 0) {
      const name = this.selectedAvailable[0];
      const call = this.breedingMode === 'Direct'
        ? this.dwm2Service.getDirectBreeding(name)
        : this.dwm2Service.getFinalBreeding(name);

      call.subscribe({
        next: results => {
          this.finalBreedingResults = results;
          this.resultType = 'finalBreeding';
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          this.errorMessage = err.error || 'Error fetching final breeding.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    // One available + one target → BreedingPath
    if (availableCount === 1 && targetCount === 1) {
      const start = this.selectedAvailable[0];
      const target = this.selectedTargets[0];
      const call = this.breedingMode === 'Direct'
        ? this.dwm2Service.getDirectBreedingPath(start, target)
        : this.dwm2Service.getBreedingPath(start, target);

      call.subscribe({
        next: results => {
          this.breedingPathResults = results;
          this.resultType = 'breedingPath';
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          this.errorMessage = err.error || 'No breeding path found.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    // No available + one target → BreedingSources
    if (availableCount === 0 && targetCount === 1) {
      const name = this.selectedTargets[0];
      this.dwm2Service.getBreedingSources(name).subscribe({
        next: results => {
          this.breedingSourcesResults = results;
          this.resultType = 'breedingSources';
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          this.errorMessage = err.error || 'Error fetching breeding sources.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    // Multiple available and/or multiple targets → TeamPlanner
    if (availableCount > 0 && targetCount > 0) {
      this.dwm2Service.planTeam({
        availableMonsters: this.selectedAvailable,
        targetMonsters: this.selectedTargets,
        mode: this.breedingMode === 'Direct' ? 1 : 0
      }).subscribe({
        next: results => {
          this.teamPlanResults = results;
          this.resultType = 'teamPlan';
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          this.errorMessage = err.error || 'Error generating team plan.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    this.errorMessage = 'Please select at least one available or target monster.';
    this.loading = false;
  }
}
