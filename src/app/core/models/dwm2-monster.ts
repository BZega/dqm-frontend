export interface DWM2Monster {
    name: string;
    type: string;
    breeds: BreedingPair[];
    directUsedIn: BreedingPair[];
    skills: string[];
}

export interface BreedingPair {
    baseMonster: string;
    mateMonster: string;
    offspringMonster: string;
}

export interface TeamPlannerRequest {
    availableMonsters: string[];
    targetMonsters: string[];
    mode: 0 | 1;
}

export interface TeamPlannerResponse {
    mode: string;
    targets: PlannedTarget[];
    warnings: string[];
}

export interface PlannedTarget {
    targetMonster: string;
    canBreed: boolean;
    steps: BreedingPair[];
    monstersUsed: string[];
    missing: any[];
    resourceSummary: ResourceSummary[];
    hasResourceConflicts: boolean;
}

export interface ResourceSummary {
    monsterName: string;
    startingAvailable: number;
    produced: number;
    consumed: number;
    remaining: number;
    shortage: number;
}
