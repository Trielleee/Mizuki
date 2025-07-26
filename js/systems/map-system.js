// 地图系统
class MapSystem {
    constructor(player) {
        this.player = player;
    }

    // 获取所有地图
    getAllMaps() {
        return Object.keys(MAP_DATA);
    }

    // 获取地图信息
    getMapInfo(mapName) {
        return MAP_DATA[mapName];
    }

    // 获取当前地图信息
    getCurrentMapInfo() {
        return this.player.getCurrentMapData();
    }

    // 获取当前地图名称
    getCurrentMapName() {
        return this.player.getCurrentMap();
    }

    // 切换地图
    changeMap(mapName) {
        if (!MAP_DATA[mapName]) {
            return { success: false, message: "地图不存在" };
        }

        if (!this.player.isMapUnlocked(mapName)) {
            return { success: false, message: "地图未解锁" };
        }

        const oldMap = this.player.getCurrentMap();
        this.player.setCurrentMap(mapName);
        
        return { 
            success: true, 
            message: `已切换到 ${mapName}`,
            oldMap: oldMap,
            newMap: mapName
        };
    }

    // 检查地图是否解锁
    isMapUnlocked(mapName) {
        return this.player.isMapUnlocked(mapName);
    }

    // 获取解锁的地图列表
    getUnlockedMaps() {
        return this.player.getUnlockedMaps();
    }

    // 获取地图解锁条件
    getMapUnlockConditions(mapName) {
        return MAP_UNLOCK_CONDITIONS[mapName];
    }

    // 检查地图解锁进度
    getMapUnlockProgress(mapName) {
        const conditions = MAP_UNLOCK_CONDITIONS[mapName];
        if (!conditions) return null;

        const progress = {
            mapName: mapName,
            playerLevel: {
                current: this.player.level,
                required: conditions.playerLevel,
                completed: this.player.level >= conditions.playerLevel
            },
            gold: {
                current: this.player.gold,
                required: conditions.requiredGold,
                completed: this.player.gold >= conditions.requiredGold
            },
            pokemon: {
                required: conditions.requiredPokemon,
                discovered: [],
                missing: []
            },
            overall: false
        };

        // 检查所需宠物
        conditions.requiredPokemon.forEach(pokemonName => {
            if (this.player.hasDiscoveredPokemon(pokemonName)) {
                progress.pokemon.discovered.push(pokemonName);
            } else {
                progress.pokemon.missing.push(pokemonName);
            }
        });

        progress.pokemon.completed = progress.pokemon.missing.length === 0;

        // 检查整体解锁条件
        progress.overall = progress.playerLevel.completed && 
                          progress.gold.completed && 
                          progress.pokemon.completed;

        return progress;
    }

    // 获取地图宠物列表
    getMapPokemon(mapName) {
        const mapData = MAP_DATA[mapName];
        if (!mapData) return [];

        return mapData.pokemonPool.map(pokemon => {
            const template = POKEMON_TEMPLATES[pokemon.name];
            return {
                name: pokemon.name,
                weight: pokemon.weight,
                rarity: template.rarity,
                element: template.element,
                emoji: template.emoji,
                description: template.description,
                isDiscovered: this.player.hasDiscoveredPokemon(pokemon.name),
                playerOwned: !!this.player.getAllPokemon().find(p => p.name === pokemon.name)
            };
        });
    }

    // 获取当前地图宠物列表
    getCurrentMapPokemon() {
        return this.getMapPokemon(this.player.getCurrentMap());
    }

    // 获取地图奖励信息
    getMapRewards(mapName) {
        const mapData = MAP_DATA[mapName];
        if (!mapData) return null;

        const difficultyMultiplier = MAP_REWARD_MULTIPLIERS[mapData.difficulty];
        
        return {
            gold: {
                min: mapData.rewards.gold.min,
                max: mapData.rewards.gold.max,
                minWithMultiplier: Math.floor(mapData.rewards.gold.min * difficultyMultiplier.gold),
                maxWithMultiplier: Math.floor(mapData.rewards.gold.max * difficultyMultiplier.gold)
            },
            exp: {
                min: mapData.rewards.exp.min,
                max: mapData.rewards.exp.max,
                minWithMultiplier: Math.floor(mapData.rewards.exp.min * difficultyMultiplier.exp),
                maxWithMultiplier: Math.floor(mapData.rewards.exp.max * difficultyMultiplier.exp)
            },
            pokeballChance: mapData.rewards.pokeballChance,
            difficulty: mapData.difficulty,
            difficultyName: DIFFICULTY_LEVELS[mapData.difficulty]
        };
    }

    // 获取地图统计信息
    getMapStats() {
        const allMaps = this.getAllMaps();
        const stats = {
            total: allMaps.length,
            unlocked: 0,
            locked: 0,
            byDifficulty: {},
            currentMap: this.player.getCurrentMap()
        };

        allMaps.forEach(mapName => {
            const mapData = MAP_DATA[mapName];
            const difficulty = mapData.difficulty;
            
            if (!stats.byDifficulty[difficulty]) {
                stats.byDifficulty[difficulty] = {
                    name: DIFFICULTY_LEVELS[difficulty],
                    total: 0,
                    unlocked: 0,
                    locked: 0
                };
            }
            
            stats.byDifficulty[difficulty].total++;
            
            if (this.player.isMapUnlocked(mapName)) {
                stats.unlocked++;
                stats.byDifficulty[difficulty].unlocked++;
            } else {
                stats.locked++;
                stats.byDifficulty[difficulty].locked++;
            }
        });

        return stats;
    }

    // 获取推荐地图
    getRecommendedMaps() {
        const unlockedMaps = this.getUnlockedMaps();
        const playerLevel = this.player.level;
        
        return unlockedMaps.filter(mapName => {
            const mapData = MAP_DATA[mapName];
            const levelRange = mapData.levelRange.split('-').map(Number);
            const minLevel = levelRange[0];
            const maxLevel = levelRange[1];
            
            // 推荐等级范围内的地图
            return playerLevel >= minLevel && playerLevel <= maxLevel;
        });
    }

    // 获取地图难度信息
    getMapDifficultyInfo(mapName) {
        const mapData = MAP_DATA[mapName];
        if (!mapData) return null;

        return {
            difficulty: mapData.difficulty,
            difficultyName: DIFFICULTY_LEVELS[mapData.difficulty],
            levelRange: mapData.levelRange,
            minPlayerLevel: mapData.minPlayerLevel,
            isRecommended: this.isMapRecommended(mapName)
        };
    }

    // 检查地图是否推荐
    isMapRecommended(mapName) {
        const mapData = MAP_DATA[mapName];
        if (!mapData) return false;

        const playerLevel = this.player.level;
        const levelRange = mapData.levelRange.split('-').map(Number);
        const minLevel = levelRange[0];
        const maxLevel = levelRange[1];
        
        return playerLevel >= minLevel && playerLevel <= maxLevel;
    }

    // 获取地图探索进度
    getMapExplorationProgress(mapName) {
        const mapPokemon = this.getMapPokemon(mapName);
        if (mapPokemon.length === 0) return null;

        const discovered = mapPokemon.filter(p => p.isDiscovered).length;
        const total = mapPokemon.length;
        
        return {
            mapName: mapName,
            discovered: discovered,
            total: total,
            percentage: (discovered / total) * 100,
            pokemon: mapPokemon
        };
    }

    // 获取所有地图的探索进度
    getAllMapsExplorationProgress() {
        const allMaps = this.getAllMaps();
        const progress = {};
        
        allMaps.forEach(mapName => {
            progress[mapName] = this.getMapExplorationProgress(mapName);
        });
        
        return progress;
    }

    // 获取地图成就
    getMapAchievements() {
        const achievements = [];
        const mapStats = this.getMapStats();
        
        // 解锁地图成就
        if (mapStats.unlocked >= 3) {
            achievements.push({
                name: "初级探险家",
                description: "解锁3个地图",
                completed: true,
                progress: mapStats.unlocked,
                target: 3
            });
        } else {
            achievements.push({
                name: "初级探险家",
                description: "解锁3个地图",
                completed: false,
                progress: mapStats.unlocked,
                target: 3
            });
        }
        
        if (mapStats.unlocked >= 5) {
            achievements.push({
                name: "中级探险家",
                description: "解锁5个地图",
                completed: true,
                progress: mapStats.unlocked,
                target: 5
            });
        } else {
            achievements.push({
                name: "中级探险家",
                description: "解锁5个地图",
                completed: false,
                progress: mapStats.unlocked,
                target: 5
            });
        }
        
        if (mapStats.unlocked >= 7) {
            achievements.push({
                name: "高级探险家",
                description: "解锁所有地图",
                completed: true,
                progress: mapStats.unlocked,
                target: 7
            });
        } else {
            achievements.push({
                name: "高级探险家",
                description: "解锁所有地图",
                completed: false,
                progress: mapStats.unlocked,
                target: 7
            });
        }
        
        return achievements;
    }
} 