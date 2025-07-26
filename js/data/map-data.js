// 地图数据
const MAP_DATA = {
    "新手村": {
        name: "新手村",
        description: "新手训练师的起点，环境安全，适合初学者。",
        levelRange: "1-3",
        minPlayerLevel: 1,
        icon: "🏠",
        difficulty: 1,
        pokemonPool: [
            { name: "Normie", weight: 40 },
            { name: "Flarion", weight: 25 },
            { name: "AquaFin", weight: 25 },
            { name: "LeafBud", weight: 10 }
        ],
        rewards: {
            gold: { min: 10, max: 50 },
            exp: { min: 5, max: 20 },
            pokeballChance: 0.1
        }
    },
    "火焰森林": {
        name: "火焰森林",
        description: "充满火焰能量的神秘森林，火系宠物聚集地。",
        levelRange: "5-20",
        minPlayerLevel: 5,
        icon: "🔥",
        difficulty: 2,
        pokemonPool: [
            { name: "Flarion", weight: 35 },
            { name: "Inferno", weight: 25 },
            { name: "Sparky", weight: 20 },
            { name: "Normie", weight: 15 },
            { name: "FlarionX", weight: 5 }
        ],
        rewards: {
            gold: { min: 20, max: 100 },
            exp: { min: 10, max: 40 },
            pokeballChance: 0.15
        }
    },
    "深海遗迹": {
        name: "深海遗迹",
        description: "沉没在海底的古老遗迹，水系宠物的天堂。",
        levelRange: "8-25",
        minPlayerLevel: 8,
        icon: "🌊",
        difficulty: 3,
        pokemonPool: [
            { name: "AquaFin", weight: 35 },
            { name: "TidalWave", weight: 25 },
            { name: "AquaFinX", weight: 20 },
            { name: "Sparky", weight: 15 },
            { name: "TidalLord", weight: 5 }
        ],
        rewards: {
            gold: { min: 30, max: 150 },
            exp: { min: 15, max: 60 },
            pokeballChance: 0.2
        }
    },
    "神秘花园": {
        name: "神秘花园",
        description: "充满生机的神秘花园，草系宠物的乐园。",
        levelRange: "10-30",
        minPlayerLevel: 10,
        icon: "🌿",
        difficulty: 3,
        pokemonPool: [
            { name: "LeafBud", weight: 35 },
            { name: "VineMaster", weight: 25 },
            { name: "LeafBudX", weight: 20 },
            { name: "Normie", weight: 15 },
            { name: "VineLord", weight: 5 }
        ],
        rewards: {
            gold: { min: 40, max: 200 },
            exp: { min: 20, max: 80 },
            pokeballChance: 0.2
        }
    },
    "雷电场": {
        name: "雷电场",
        description: "充满电力的神秘区域，电系宠物的聚集地。",
        levelRange: "12-35",
        minPlayerLevel: 12,
        icon: "⚡",
        difficulty: 4,
        pokemonPool: [
            { name: "Sparky", weight: 30 },
            { name: "ThunderBolt", weight: 25 },
            { name: "SparkyX", weight: 20 },
            { name: "Inferno", weight: 15 },
            { name: "ThunderLord", weight: 10 }
        ],
        rewards: {
            gold: { min: 50, max: 250 },
            exp: { min: 25, max: 100 },
            pokeballChance: 0.25
        }
    },
    "进化之塔": {
        name: "进化之塔",
        description: "神秘的进化之塔，只有进化后的宠物才能进入。",
        levelRange: "20-50",
        minPlayerLevel: 20,
        icon: "🗼",
        difficulty: 5,
        pokemonPool: [
            { name: "FlarionX", weight: 25 },
            { name: "AquaFinX", weight: 25 },
            { name: "LeafBudX", weight: 20 },
            { name: "SparkyX", weight: 20 },
            { name: "InfernoLord", weight: 5 },
            { name: "TidalLord", weight: 5 }
        ],
        rewards: {
            gold: { min: 80, max: 400 },
            exp: { min: 40, max: 160 },
            pokeballChance: 0.3
        }
    },
    "传说之地": {
        name: "传说之地",
        description: "传说中的神秘之地，只有最强大的训练师才能进入。",
        levelRange: "40-100",
        minPlayerLevel: 40,
        icon: "🌟",
        difficulty: 10,
        pokemonPool: [
            { name: "FlarionZ", weight: 20 },
            { name: "AquaFinZ", weight: 20 },
            { name: "LeafBudZ", weight: 20 },
            { name: "SparkyZ", weight: 20 },
            { name: "DragonKing", weight: 5 },
            { name: "OceanGod", weight: 5 },
            { name: "NatureSpirit", weight: 5 },
            { name: "StormLord", weight: 5 }
        ],
        rewards: {
            gold: { min: 200, max: 1000 },
            exp: { min: 100, max: 400 },
            pokeballChance: 0.4
        }
    }
};

// 地图解锁条件
const MAP_UNLOCK_CONDITIONS = {
    "新手村": {
        playerLevel: 1,
        requiredPokemon: [],
        requiredGold: 0
    },
    "火焰森林": {
        playerLevel: 5,
        requiredPokemon: [],
        requiredGold: 100
    },
    "深海遗迹": {
        playerLevel: 8,
        requiredPokemon: ["Flarion"],
        requiredGold: 300
    },
    "神秘花园": {
        playerLevel: 10,
        requiredPokemon: ["AquaFin"],
        requiredGold: 500
    },
    "雷电场": {
        playerLevel: 12,
        requiredPokemon: ["LeafBud"],
        requiredGold: 800
    },
    "进化之塔": {
        playerLevel: 20,
        requiredPokemon: ["FlarionX", "AquaFinX"],
        requiredGold: 2000
    },
    "传说之地": {
        playerLevel: 40,
        requiredPokemon: ["FlarionZ", "AquaFinZ", "LeafBudZ"],
        requiredGold: 10000
    }
};

// 地图难度等级
const DIFFICULTY_LEVELS = {
    1: "简单",
    2: "普通",
    3: "困难",
    4: "专家",
    5: "大师",
    10: "传说"
};

// 地图奖励倍率
const MAP_REWARD_MULTIPLIERS = {
    1: { gold: 1.0, exp: 1.0 },
    2: { gold: 1.2, exp: 1.1 },
    3: { gold: 1.5, exp: 1.3 },
    4: { gold: 2.0, exp: 1.6 },
    5: { gold: 2.5, exp: 2.0 },
    10: { gold: 5.0, exp: 3.0 }
}; 