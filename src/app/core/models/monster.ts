export interface Monster {
    id?: number
    name?: string
    type?: number
    tacticalType?: number
    isSmallTacticalTrooper?: boolean
    maxStat?: Stats
}

export interface Stats {
    hp: string
    mp: string
    attack: string
    defense: string
    agility: string
    wisdom: string
    size: string
}