import { Injectable } from "@angular/core";
import { Monster } from "../models/monster";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MonsterService {

    public selectedMonster = new BehaviorSubject<Monster>(null);
    public monsterList = new BehaviorSubject<Monster[]>(null);
    public selectedMonster$ = this.selectedMonster.asObservable();
    public monsterList$ = this.monsterList.asObservable();
    
    constructor(
        private http: HttpClient,
    ) {}

    public getAllMonsters(): Observable<Monster[]> { 
        const monsterUrl = 'https://localhost:7123/Monster/get-all-monsters'
        return this.http.get<Monster[]>(monsterUrl);
    }
    
    public getMonsterMaxStat(name: string, parent1type: number, parent2type: number, parent1level: number, parent2level: number, gparent1type: number, gparent2type: number, gparent3type: number, gparent4type: number, size: number): Observable<Monster> {
        const monsterUrl = `https://localhost:7123/Monster/get-by-name/${name}?parent1=${parent1type}&parent2=${parent2type}&parent1Level=${parent1level}&parent2Level=${parent2level}&gparent1=${gparent1type}&gparent2=${gparent2type}&gparent3=${gparent3type}&gparent4=${gparent4type}&size=${size}&talent1=null&talent2=null&talent3=null&sparkling=null`
        return this.http.get<Monster>(monsterUrl);
    }
}