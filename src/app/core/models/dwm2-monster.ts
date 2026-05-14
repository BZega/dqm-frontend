export interface DWM2Monster {
    name: string;
    type: number;
    breeds: BreedingPair[];
    directUsedIn: BreedingPair[];
    skills: string[];
}

export const MonsterTypeNames: string[] = [
    'None', 'Slime', 'Dragon', 'Nature', 'Beast', 'Material',
    'Demon', 'Undead', 'Boss', 'Bird', 'Plant', 'Bug',
    'Devil', 'Zombie', 'Water'
];

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

export interface BreedingPlanState {
    selectedAvailable: string[];
    selectedTargets: string[];
    breedingMode: 'Direct' | 'TypeAware';
    resultType: 'finalBreeding' | 'breedingPath' | 'breedingSources' | 'teamPlan' | null;
    finalBreedingResults: string[];
    breedingPathResults: BreedingPair[];
    breedingSourcesResults: BreedingPair[];
    teamPlanResults: TeamPlannerResponse | null;
    errorMessage: string | null;
}

export interface MonsterLookupState {
    searchValue: string;
    selectedMonster: DWM2Monster | null;
}
