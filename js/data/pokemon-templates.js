// 宠物模板数据
const POKEMON_TEMPLATES = {
    // 火系宠物
    "Flarion": {
        name: "Flarion",
        rarity: "Common",
        element: "Fire",
        baseStats: {
            maxHp: 120,
            atk: 25,
            def: 10
        },
        evolveLevel: 20,
        nextForm: "FlarionX",
        catchRate: 0.5,
        description: "一只可爱的小火鸟，性格温和但战斗时很勇敢。",
        emoji: "🔥"
    },
    "FlarionX": {
        name: "FlarionX",
        rarity: "Rare",
        element: "Fire",
        baseStats: {
            maxHp: 180,
            atk: 40,
            def: 15
        },
        evolveLevel: 40,
        nextForm: "FlarionZ",
        catchRate: 0.3,
        description: "进化后的火焰鸟，拥有更强大的火焰力量。",
        emoji: "🔥"
    },
    "FlarionZ": {
        name: "FlarionZ",
        rarity: "Epic",
        element: "Fire",
        baseStats: {
            maxHp: 250,
            atk: 60,
            def: 25
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.1,
        description: "传说中的火焰神鸟，掌控着毁灭性的火焰之力。",
        emoji: "🔥"
    },
    "Inferno": {
        name: "Inferno",
        rarity: "Rare",
        element: "Fire",
        baseStats: {
            maxHp: 150,
            atk: 35,
            def: 12
        },
        evolveLevel: 25,
        nextForm: "InfernoLord",
        catchRate: 0.4,
        description: "地狱火焰的化身，燃烧着永不熄灭的火焰。",
        emoji: "🔥"
    },
    "InfernoLord": {
        name: "InfernoLord",
        rarity: "Epic",
        element: "Fire",
        baseStats: {
            maxHp: 220,
            atk: 55,
            def: 20
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.15,
        description: "火焰领主，掌控着地狱的烈焰。",
        emoji: "🔥"
    },

    // 水系宠物
    "AquaFin": {
        name: "AquaFin",
        rarity: "Common",
        element: "Water",
        baseStats: {
            maxHp: 130,
            atk: 22,
            def: 15
        },
        evolveLevel: 18,
        nextForm: "AquaFinX",
        catchRate: 0.5,
        description: "海洋中的小精灵，能够操控水流。",
        emoji: "🌊"
    },
    "AquaFinX": {
        name: "AquaFinX",
        rarity: "Rare",
        element: "Water",
        baseStats: {
            maxHp: 190,
            atk: 35,
            def: 25
        },
        evolveLevel: 35,
        nextForm: "AquaFinZ",
        catchRate: 0.3,
        description: "深海守护者，拥有强大的水系魔法。",
        emoji: "🌊"
    },
    "AquaFinZ": {
        name: "AquaFinZ",
        rarity: "Epic",
        element: "Water",
        baseStats: {
            maxHp: 260,
            atk: 50,
            def: 35
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.1,
        description: "海洋之王，掌控着整个海洋的力量。",
        emoji: "🌊"
    },
    "TidalWave": {
        name: "TidalWave",
        rarity: "Rare",
        element: "Water",
        baseStats: {
            maxHp: 160,
            atk: 30,
            def: 20
        },
        evolveLevel: 30,
        nextForm: "TidalLord",
        catchRate: 0.4,
        description: "巨浪的化身，能够掀起滔天巨浪。",
        emoji: "🌊"
    },
    "TidalLord": {
        name: "TidalLord",
        rarity: "Epic",
        element: "Water",
        baseStats: {
            maxHp: 240,
            atk: 45,
            def: 30
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.15,
        description: "潮汐领主，掌控着海洋的潮汐之力。",
        emoji: "🌊"
    },

    // 草系宠物
    "LeafBud": {
        name: "LeafBud",
        rarity: "Common",
        element: "Grass",
        baseStats: {
            maxHp: 110,
            atk: 20,
            def: 18
        },
        evolveLevel: 16,
        nextForm: "LeafBudX",
        catchRate: 0.5,
        description: "森林中的小精灵，充满生机与活力。",
        emoji: "🌿"
    },
    "LeafBudX": {
        name: "LeafBudX",
        rarity: "Rare",
        element: "Grass",
        baseStats: {
            maxHp: 170,
            atk: 32,
            def: 28
        },
        evolveLevel: 32,
        nextForm: "LeafBudZ",
        catchRate: 0.3,
        description: "森林守护者，掌控着自然的治愈之力。",
        emoji: "🌿"
    },
    "LeafBudZ": {
        name: "LeafBudZ",
        rarity: "Epic",
        element: "Grass",
        baseStats: {
            maxHp: 240,
            atk: 45,
            def: 40
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.1,
        description: "自然之王，掌控着整个森林的生命力。",
        emoji: "🌿"
    },
    "VineMaster": {
        name: "VineMaster",
        rarity: "Rare",
        element: "Grass",
        baseStats: {
            maxHp: 140,
            atk: 28,
            def: 22
        },
        evolveLevel: 28,
        nextForm: "VineLord",
        catchRate: 0.4,
        description: "藤蔓大师，能够操控各种植物。",
        emoji: "🌿"
    },
    "VineLord": {
        name: "VineLord",
        rarity: "Epic",
        element: "Grass",
        baseStats: {
            maxHp: 210,
            atk: 42,
            def: 32
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.15,
        description: "藤蔓领主，掌控着植物的生长之力。",
        emoji: "🌿"
    },

    // 电系宠物
    "Sparky": {
        name: "Sparky",
        rarity: "Common",
        element: "Electric",
        baseStats: {
            maxHp: 100,
            atk: 30,
            def: 8
        },
        evolveLevel: 22,
        nextForm: "SparkyX",
        catchRate: 0.5,
        description: "充满电力的可爱小精灵。",
        emoji: "⚡"
    },
    "SparkyX": {
        name: "SparkyX",
        rarity: "Rare",
        element: "Electric",
        baseStats: {
            maxHp: 160,
            atk: 45,
            def: 12
        },
        evolveLevel: 38,
        nextForm: "SparkyZ",
        catchRate: 0.3,
        description: "雷电使者，掌控着强大的电力。",
        emoji: "⚡"
    },
    "SparkyZ": {
        name: "SparkyZ",
        rarity: "Epic",
        element: "Electric",
        baseStats: {
            maxHp: 230,
            atk: 65,
            def: 18
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.1,
        description: "雷电之王，掌控着天空中的闪电。",
        emoji: "⚡"
    },
    "ThunderBolt": {
        name: "ThunderBolt",
        rarity: "Rare",
        element: "Electric",
        baseStats: {
            maxHp: 120,
            atk: 38,
            def: 10
        },
        evolveLevel: 26,
        nextForm: "ThunderLord",
        catchRate: 0.4,
        description: "闪电的化身，速度极快。",
        emoji: "⚡"
    },
    "ThunderLord": {
        name: "ThunderLord",
        rarity: "Epic",
        element: "Electric",
        baseStats: {
            maxHp: 190,
            atk: 55,
            def: 15
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.15,
        description: "雷电领主，掌控着天空的雷霆。",
        emoji: "⚡"
    },

    // 普通系宠物
    "Normie": {
        name: "Normie",
        rarity: "Common",
        element: "Normal",
        baseStats: {
            maxHp: 100,
            atk: 20,
            def: 15
        },
        evolveLevel: 15,
        nextForm: "NormieX",
        catchRate: 0.6,
        description: "最普通的小精灵，但潜力无限。",
        emoji: "🌟"
    },
    "NormieX": {
        name: "NormieX",
        rarity: "Rare",
        element: "Normal",
        baseStats: {
            maxHp: 150,
            atk: 30,
            def: 25
        },
        evolveLevel: 30,
        nextForm: "NormieZ",
        catchRate: 0.4,
        description: "超越平凡的进化形态。",
        emoji: "🌟"
    },
    "NormieZ": {
        name: "NormieZ",
        rarity: "Epic",
        element: "Normal",
        baseStats: {
            maxHp: 220,
            atk: 45,
            def: 35
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.2,
        description: "从平凡中诞生的传奇。",
        emoji: "🌟"
    },

    // 传说级宠物
    "DragonKing": {
        name: "DragonKing",
        rarity: "Legendary",
        element: "Fire",
        baseStats: {
            maxHp: 300,
            atk: 80,
            def: 50
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.05,
        description: "传说中的龙族之王，拥有毁天灭地的力量。",
        emoji: "🐉"
    },
    "OceanGod": {
        name: "OceanGod",
        rarity: "Legendary",
        element: "Water",
        baseStats: {
            maxHp: 320,
            atk: 70,
            def: 60
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.05,
        description: "海洋之神，掌控着整个海洋的力量。",
        emoji: "🌊"
    },
    "NatureSpirit": {
        name: "NatureSpirit",
        rarity: "Legendary",
        element: "Grass",
        baseStats: {
            maxHp: 280,
            atk: 65,
            def: 70
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.05,
        description: "自然之灵，代表着生命与和谐。",
        emoji: "🌿"
    },
    "StormLord": {
        name: "StormLord",
        rarity: "Legendary",
        element: "Electric",
        baseStats: {
            maxHp: 260,
            atk: 90,
            def: 40
        },
        evolveLevel: null,
        nextForm: null,
        catchRate: 0.05,
        description: "风暴之主，掌控着天空中的雷霆与风暴。",
        emoji: "⚡"
    }
};

// 稀有度影响系数
const RARITY_MODIFIERS = {
    "Common": {
        catchRate: 1.0,
        statGrowth: 1.0
    },
    "Rare": {
        catchRate: 0.7,
        statGrowth: 1.2
    },
    "Epic": {
        catchRate: 0.4,
        statGrowth: 1.5
    },
    "Legendary": {
        catchRate: 0.1,
        statGrowth: 2.0
    }
};

// 属性相克关系
const ELEMENT_EFFECTIVENESS = {
    "Fire": {
        "Grass": 1.5,
        "Water": 0.7,
        "Electric": 1.0,
        "Normal": 1.0
    },
    "Water": {
        "Fire": 1.5,
        "Grass": 0.7,
        "Electric": 0.7,
        "Normal": 1.0
    },
    "Grass": {
        "Water": 1.5,
        "Fire": 0.7,
        "Electric": 1.0,
        "Normal": 1.0
    },
    "Electric": {
        "Water": 1.5,
        "Fire": 1.0,
        "Grass": 1.0,
        "Normal": 1.0
    },
    "Normal": {
        "Fire": 1.0,
        "Water": 1.0,
        "Grass": 1.0,
        "Electric": 1.0
    }
}; 