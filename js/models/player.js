// 玩家类
class Player {
    constructor() {
        this.level = 1;
        this.exp = 0;
        this.gold = 0;
        this.pokeballs = 5;
        this.pokemon = [];
        this.selectedPokemon = null;
        this.currentMap = "新手村";
        this.discoveredPokemon = new Set();
        this.battleStats = {
            totalBattles: 0,
            wins: 0,
            losses: 0,
            pokemonCaught: 0
        };
        this.items = {
            "精灵球": 10,
            "超级球": 2,
            "大师球": 0,
            "生命药水": 0,
            "超级药水": 0,
            "进化石": 0
        };
        // 精灵球装备系统
        this.equippedPokeball = "精灵球"; // 默认装备普通精灵球
    }

    // 获得经验值
    gainExp(expAmount) {
        this.exp += expAmount;
        
        while (this.canLevelUp()) {
            this.levelUp();
        }
    }

    // 检查是否可以升级
    canLevelUp() {
        const requiredExp = this.getRequiredExp();
        return this.exp >= requiredExp;
    }

    // 升级
    levelUp() {
        this.level++;
        this.exp -= this.getRequiredExp();
        
        // 升级奖励
        this.gold += this.level * 10;
        this.pokeballs += 2;
        
        return true;
    }

    // 获取升级所需经验
    getRequiredExp() {
        return this.level * 50;
    }

    // 获得金币
    gainGold(amount) {
        this.gold += amount;
    }

    // 消费金币
    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    // 获得精灵球
    gainPokeballs(amount) {
        this.pokeballs += amount;
    }

    // 使用精灵球
    usePokeball() {
        if (this.pokeballs > 0) {
            this.pokeballs--;
            return true;
        }
        return false;
    }

    // 添加宠物
    addPokemon(pokemon) {
        pokemon.isPlayerOwned = true;
        this.pokemon.push(pokemon);
        this.discoveredPokemon.add(pokemon.name);
        
        // 如果是第一个宠物，自动选择
        if (this.pokemon.length === 1) {
            this.selectedPokemon = pokemon;
        }
    }

    // 移除宠物
    removePokemon(pokemonId) {
        const index = this.pokemon.findIndex(p => p.id === pokemonId);
        if (index !== -1) {
            const removed = this.pokemon.splice(index, 1)[0];
            
            // 如果移除的是当前选择的宠物，重新选择
            if (this.selectedPokemon && this.selectedPokemon.id === pokemonId) {
                this.selectedPokemon = this.pokemon.length > 0 ? this.pokemon[0] : null;
            }
            
            return removed;
        }
        return null;
    }

    // 选择宠物
    selectPokemon(pokemonId) {
        const pokemon = this.pokemon.find(p => p.id === pokemonId);
        if (pokemon) {
            this.selectedPokemon = pokemon;
            return true;
        }
        return false;
    }

    // 获取宠物
    getPokemon(pokemonId) {
        return this.pokemon.find(p => p.id === pokemonId);
    }

    // 获取所有宠物
    getAllPokemon() {
        return this.pokemon;
    }

    // 获取当前选择的宠物
    getSelectedPokemon() {
        return this.selectedPokemon;
    }

    // 检查是否有可战斗的宠物
    hasBattleReadyPokemon() {
        return this.selectedPokemon && this.selectedPokemon.isAlive();
    }

    // 恢复所有宠物
    healAllPokemon() {
        this.pokemon.forEach(pokemon => {
            pokemon.fullHeal();
        });
    }

    // 设置当前地图
    setCurrentMap(mapName) {
        if (MAP_DATA[mapName]) {
            this.currentMap = mapName;
            return true;
        }
        return false;
    }

    // 获取当前地图
    getCurrentMap() {
        return this.currentMap;
    }

    // 获取当前地图数据
    getCurrentMapData() {
        return MAP_DATA[this.currentMap];
    }

    // 检查地图是否解锁
    isMapUnlocked(mapName) {
        const conditions = MAP_UNLOCK_CONDITIONS[mapName];
        if (!conditions) return false;

        // 检查玩家等级
        if (this.level < conditions.playerLevel) return false;

        // 检查金币
        if (this.gold < conditions.requiredGold) return false;

        // 检查所需宠物
        for (const pokemonName of conditions.requiredPokemon) {
            if (!this.discoveredPokemon.has(pokemonName)) return false;
        }

        return true;
    }

    // 获取所有解锁的地图
    getUnlockedMaps() {
        return Object.keys(MAP_DATA).filter(mapName => this.isMapUnlocked(mapName));
    }

    // 发现宠物
    discoverPokemon(pokemonName) {
        this.discoveredPokemon.add(pokemonName);
    }

    // 检查是否发现过宠物
    hasDiscoveredPokemon(pokemonName) {
        return this.discoveredPokemon.has(pokemonName);
    }

    // 获取发现的宠物数量
    getDiscoveredPokemonCount() {
        return this.discoveredPokemon.size;
    }

    // 获取总宠物数量
    getTotalPokemonCount() {
        return Object.keys(POKEMON_TEMPLATES).length;
    }

    // 更新战斗统计
    updateBattleStats(result) {
        this.battleStats.totalBattles++;
        if (result === 'win') {
            this.battleStats.wins++;
        } else if (result === 'loss') {
            this.battleStats.losses++;
        }
    }

    // 增加捕捉统计
    incrementCaughtPokemon() {
        this.battleStats.pokemonCaught++;
    }

    // 获取胜率
    getWinRate() {
        if (this.battleStats.totalBattles === 0) return 0;
        return (this.battleStats.wins / this.battleStats.totalBattles) * 100;
    }

    // 添加道具
    addItem(itemName, amount = 1) {
        if (this.items[itemName] !== undefined) {
            this.items[itemName] += amount;
            return true;
        }
        return false;
    }

    // 使用道具
    useItem(itemName, amount = 1) {
        if (this.items[itemName] && this.items[itemName] >= amount) {
            this.items[itemName] -= amount;
            return true;
        }
        return false;
    }

    // 获取道具数量
    getItemCount(itemName) {
        return this.items[itemName] || 0;
    }

    // 获取所有道具
    getAllItems() {
        return this.items;
    }

    // 装备精灵球
    equipPokeball(pokeballName) {
        if (this.items[pokeballName] && this.items[pokeballName] > 0) {
            this.equippedPokeball = pokeballName;
            return true;
        }
        return false;
    }

    // 获取当前装备的精灵球
    getEquippedPokeball() {
        return this.equippedPokeball;
    }

    // 获取装备精灵球的数量
    getEquippedPokeballCount() {
        return this.items[this.equippedPokeball] || 0;
    }

    // 使用装备的精灵球
    useEquippedPokeball() {
        if (this.items[this.equippedPokeball] && this.items[this.equippedPokeball] > 0) {
            this.items[this.equippedPokeball]--;
            return true;
        }
        return false;
    }

    // 获取精灵球捕捉概率
    getPokeballCatchRate(pokeballName) {
        const catchRates = {
            "精灵球": 0.05,    // 5%
            "超级球": 0.15,    // 15%
            "大师球": 1.0      // 100%
        };
        return catchRates[pokeballName] || 0.05;
    }

    // 获取玩家统计信息
    getStats() {
        return {
            level: this.level,
            exp: this.exp,
            requiredExp: this.getRequiredExp(),
            expPercentage: (this.exp / this.getRequiredExp()) * 100,
            gold: this.gold,
            pokeballs: this.pokeballs,
            pokemonCount: this.pokemon.length,
            discoveredCount: this.discoveredPokemon.size,
            totalPokemon: this.getTotalPokemonCount(),
            currentMap: this.currentMap,
            battleStats: this.battleStats,
            winRate: this.getWinRate()
        };
    }

    // 获取玩家等级信息
    getLevelInfo() {
        return {
            level: this.level,
            exp: this.exp,
            requiredExp: this.getRequiredExp(),
            expPercentage: (this.exp / this.getRequiredExp()) * 100,
            canLevelUp: this.canLevelUp()
        };
    }

    // 获取背包信息
    getInventoryInfo() {
        return {
            pokemon: this.pokemon.map(p => ({
                id: p.id,
                name: p.name,
                level: p.level,
                rarity: p.rarity,
                element: p.element,
                isSelected: this.selectedPokemon && this.selectedPokemon.id === p.id,
                status: p.getStatusInfo()
            })),
            items: this.items,
            selectedPokemon: this.selectedPokemon ? {
                id: this.selectedPokemon.id,
                name: this.selectedPokemon.name,
                level: this.selectedPokemon.level,
                status: this.selectedPokemon.getStatusInfo()
            } : null
        };
    }

    // 获取图鉴信息
    getPokedexInfo() {
        const allPokemon = Object.keys(POKEMON_TEMPLATES);
        const discovered = Array.from(this.discoveredPokemon);
        
        return {
            total: allPokemon.length,
            discovered: discovered.length,
            percentage: (discovered.length / allPokemon.length) * 100,
            discoveredList: discovered,
            undiscoveredList: allPokemon.filter(name => !this.discoveredPokemon.has(name))
        };
    }

    // 克隆玩家
    clone() {
        const cloned = new Player();
        cloned.level = this.level;
        cloned.exp = this.exp;
        cloned.gold = this.gold;
        cloned.pokeballs = this.pokeballs;
        cloned.pokemon = this.pokemon.map(p => p.clone());
        cloned.selectedPokemon = this.selectedPokemon ? 
            cloned.pokemon.find(p => p.id === this.selectedPokemon.id) : null;
        cloned.currentMap = this.currentMap;
        cloned.discoveredPokemon = new Set(this.discoveredPokemon);
        cloned.battleStats = { ...this.battleStats };
        cloned.items = { ...this.items };
        return cloned;
    }

    // 转换为JSON
    toJSON() {
        return {
            level: this.level,
            exp: this.exp,
            gold: this.gold,
            pokeballs: this.pokeballs,
            pokemon: this.pokemon.map(p => p.toJSON()),
            selectedPokemonId: this.selectedPokemon ? this.selectedPokemon.id : null,
            currentMap: this.currentMap,
            discoveredPokemon: Array.from(this.discoveredPokemon),
            battleStats: this.battleStats,
            items: this.items,
            equippedPokeball: this.equippedPokeball
        };
    }

    // 从JSON恢复
    static fromJSON(data) {
        const player = new Player();
        player.level = data.level || 1;
        player.exp = data.exp || 0;
        player.gold = data.gold || 0;
        player.pokeballs = data.pokeballs || 5;
        player.pokemon = (data.pokemon || []).map(p => Pokemon.fromJSON(p));
        player.currentMap = data.currentMap || "新手村";
        player.discoveredPokemon = new Set(data.discoveredPokemon || []);
        player.battleStats = data.battleStats || {
            totalBattles: 0,
            wins: 0,
            losses: 0,
            pokemonCaught: 0
        };
        player.items = data.items || {
            "精灵球": 5,
            "超级球": 0,
            "大师球": 0,
            "生命药水": 0,
            "超级药水": 0,
            "进化石": 0
        };
        player.equippedPokeball = data.equippedPokeball || "精灵球";

        // 恢复选择的宠物
        if (data.selectedPokemonId) {
            player.selectedPokemon = player.pokemon.find(p => p.id === data.selectedPokemonId);
        }

        return player;
    }
} 