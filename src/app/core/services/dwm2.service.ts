import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreedingPair, BreedingPlanState, DWM2Monster, MonsterLookupState, TeamPlannerRequest, TeamPlannerResponse } from '../models/dwm2-monster';

@Injectable({
    providedIn: 'root'
})
export class DWM2Service {

    private readonly baseUrl = 'https://localhost:7123/DWM2';
    private readonly teamPlannerUrl = 'https://localhost:7123/TeamPlanner';
    private allMonsterNames$ = new BehaviorSubject<string[]>([]);
    private selectedMonster$ = new BehaviorSubject<DWM2Monster | null>(null);
    breedingPlanState: BreedingPlanState | null = null;
    monsterLookupState: MonsterLookupState | null = null;

    constructor(private http: HttpClient) {
        this.http.get<string[]>(`${this.baseUrl}/monsters`).subscribe(names => {
            this.allMonsterNames$.next(names);
        });
    }

    getAllMonsterNames(): Observable<string[]> {
        return this.allMonsterNames$.asObservable();
    }

    getMonsterByName(name: string): Observable<DWM2Monster> {
        return this.http.get<DWM2Monster>(`${this.baseUrl}/monster/${encodeURIComponent(name)}`);
    }

    selectMonster(name: string): void {
        this.selectedMonster$.next(null);
        this.getMonsterByName(name).subscribe(monster => {
            this.selectedMonster$.next(monster);
        });
    }

    getSelectedMonster(): Observable<DWM2Monster | null> {
        return this.selectedMonster$.asObservable();
    }

    setSelectedMonster(monster: DWM2Monster | null): void {
        this.selectedMonster$.next(monster);
    }

    getFinalBreeding(name: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/finalbreeding/${encodeURIComponent(name)}`);
    }

    getDirectBreeding(name: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/directbreeding/${encodeURIComponent(name)}`);
    }

    getBreedingSources(name: string): Observable<BreedingPair[]> {
        return this.http.get<BreedingPair[]>(`${this.baseUrl}/breedingsources/${encodeURIComponent(name)}`);
    }

    getDirectBreedingPath(startMonster: string, targetMonster: string): Observable<BreedingPair[]> {
        return this.http.get<BreedingPair[]>(
            `${this.baseUrl}/directbreedingpath/${encodeURIComponent(startMonster)}/${encodeURIComponent(targetMonster)}`
        );
    }

    getBreedingPath(startMonster: string, targetMonster: string): Observable<BreedingPair[]> {
        return this.http.get<BreedingPair[]>(
            `${this.baseUrl}/breedingpath/${encodeURIComponent(startMonster)}/${encodeURIComponent(targetMonster)}`
        );
    }

    planTeam(request: TeamPlannerRequest): Observable<TeamPlannerResponse> {
        return this.http.post<TeamPlannerResponse>(`${this.teamPlannerUrl}/guide`, request);
    }
}
