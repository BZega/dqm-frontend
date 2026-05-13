import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BreedingPair, DWM2Monster, TeamPlannerRequest, TeamPlannerResponse } from '../models/dwm2-monster';

@Injectable({
    providedIn: 'root'
})
export class DWM2Service {

    private readonly baseUrl = 'https://localhost:7123/DWM2';
    private readonly teamPlannerUrl = 'https://localhost:7123/TeamPlanner';

    constructor(private http: HttpClient) {}

    getAllMonsterNames(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/monsters`);
    }

    getMonsterByName(name: string): Observable<DWM2Monster> {
        return this.http.get<DWM2Monster>(`${this.baseUrl}/monster/${encodeURIComponent(name)}`);
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
