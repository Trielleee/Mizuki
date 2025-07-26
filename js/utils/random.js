// 随机工具类
class RandomUtils {
    constructor() {
        this.seed = Date.now();
    }

    // 设置随机种子
    setSeed(seed) {
        this.seed = seed;
    }

    // 获取随机种子
    getSeed() {
        return this.seed;
    }

    // 生成随机数
    random() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    // 生成指定范围的随机整数
    randomInt(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }

    // 生成指定范围的随机浮点数
    randomFloat(min, max) {
        return this.random() * (max - min) + min;
    }

    // 从数组中随机选择一个元素
    randomChoice(array) {
        if (!array || array.length === 0) return null;
        return array[Math.floor(this.random() * array.length)];
    }

    // 从数组中随机选择多个元素（不重复）
    randomChoices(array, count) {
        if (!array || array.length === 0 || count <= 0) return [];
        
        const shuffled = [...array];
        const result = [];
        
        for (let i = 0; i < Math.min(count, array.length); i++) {
            const index = Math.floor(this.random() * shuffled.length);
            result.push(shuffled.splice(index, 1)[0]);
        }
        
        return result;
    }

    // 根据权重随机选择
    weightedChoice(items) {
        if (!items || items.length === 0) return null;
        
        const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
        let random = this.random() * totalWeight;
        
        for (const item of items) {
            random -= (item.weight || 1);
            if (random <= 0) {
                return item;
            }
        }
        
        return items[items.length - 1];
    }

    // 根据概率返回布尔值
    randomBool(probability = 0.5) {
        return this.random() < probability;
    }

    // 生成随机颜色
    randomColor() {
        const hue = this.randomInt(0, 360);
        const saturation = this.randomInt(50, 100);
        const lightness = this.randomInt(40, 80);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // 生成随机ID
    randomId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(this.random() * chars.length));
        }
        return result;
    }

    // 生成随机宠物名称
    randomPokemonName() {
        const prefixes = ['Flame', 'Aqua', 'Leaf', 'Spark', 'Shadow', 'Light', 'Dark', 'Crystal', 'Mystic', 'Ancient'];
        const suffixes = ['ion', 'ix', 'or', 'us', 'is', 'on', 'ar', 'er', 'an', 'en'];
        
        const prefix = this.randomChoice(prefixes);
        const suffix = this.randomChoice(suffixes);
        
        return prefix + suffix;
    }

    // 生成随机地图名称
    randomMapName() {
        const adjectives = ['神秘', '古老', '危险', '美丽', '黑暗', '光明', '寒冷', '炎热', '潮湿', '干燥'];
        const nouns = ['森林', '洞穴', '山脉', '海洋', '沙漠', '草原', '沼泽', '火山', '冰川', '遗迹'];
        
        const adjective = this.randomChoice(adjectives);
        const noun = this.randomChoice(nouns);
        
        return adjective + noun;
    }

    // 生成随机奖励
    generateRandomReward(baseReward, variance = 0.2) {
        const minMultiplier = 1 - variance;
        const maxMultiplier = 1 + variance;
        const multiplier = this.randomFloat(minMultiplier, maxMultiplier);
        
        return Math.floor(baseReward * multiplier);
    }

    // 生成随机掉落
    generateRandomDrop(dropTable) {
        const random = this.random();
        let cumulativeProbability = 0;
        
        for (const drop of dropTable) {
            cumulativeProbability += drop.probability;
            if (random <= cumulativeProbability) {
                return {
                    item: drop.item,
                    quantity: this.randomInt(drop.minQuantity || 1, drop.maxQuantity || 1)
                };
            }
        }
        
        return null;
    }

    // 生成随机事件
    generateRandomEvent(eventTable) {
        const totalWeight = eventTable.reduce((sum, event) => sum + (event.weight || 1), 0);
        let random = this.random() * totalWeight;
        
        for (const event of eventTable) {
            random -= (event.weight || 1);
            if (random <= 0) {
                return event;
            }
        }
        
        return eventTable[eventTable.length - 1];
    }

    // 生成随机属性值
    generateRandomStats(baseStats, variance = 0.1) {
        const stats = {};
        
        for (const [stat, baseValue] of Object.entries(baseStats)) {
            const minMultiplier = 1 - variance;
            const maxMultiplier = 1 + variance;
            const multiplier = this.randomFloat(minMultiplier, maxMultiplier);
            stats[stat] = Math.floor(baseValue * multiplier);
        }
        
        return stats;
    }

    // 生成随机等级
    generateRandomLevel(minLevel, maxLevel, distribution = 'uniform') {
        switch (distribution) {
            case 'normal':
                // 正态分布，偏向中间值
                const mean = (minLevel + maxLevel) / 2;
                const stdDev = (maxLevel - minLevel) / 6;
                const normalLevel = Math.floor(this.normalRandom(mean, stdDev));
                return Math.max(minLevel, Math.min(maxLevel, normalLevel));
            
            case 'exponential':
                // 指数分布，偏向低等级
                const lambda = 1 / ((minLevel + maxLevel) / 2);
                const expLevel = Math.floor(this.exponentialRandom(lambda));
                return Math.max(minLevel, Math.min(maxLevel, expLevel));
            
            default:
                // 均匀分布
                return this.randomInt(minLevel, maxLevel);
        }
    }

    // 正态分布随机数
    normalRandom(mean, stdDev) {
        let u = 0, v = 0;
        while (u === 0) u = this.random();
        while (v === 0) v = this.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + z * stdDev;
    }

    // 指数分布随机数
    exponentialRandom(lambda) {
        return -Math.log(1 - this.random()) / lambda;
    }

    // 生成随机进化链
    generateRandomEvolutionChain(basePokemon, maxEvolutions = 2) {
        const chain = [basePokemon];
        let currentPokemon = basePokemon;
        
        for (let i = 0; i < maxEvolutions; i++) {
            if (this.randomBool(0.7)) { // 70%概率继续进化
                const evolutionName = this.randomPokemonName();
                chain.push(evolutionName);
                currentPokemon = evolutionName;
            } else {
                break;
            }
        }
        
        return chain;
    }

    // 生成随机战斗结果
    generateRandomBattleResult(playerPokemon, enemyPokemon) {
        const playerPower = playerPokemon.atk + playerPokemon.def;
        const enemyPower = enemyPokemon.atk + enemyPokemon.def;
        const totalPower = playerPower + enemyPower;
        
        const playerWinChance = playerPower / totalPower;
        const isPlayerWin = this.randomBool(playerWinChance);
        
        return {
            winner: isPlayerWin ? 'player' : 'enemy',
            playerDamage: this.randomInt(1, Math.max(1, enemyPokemon.atk)),
            enemyDamage: this.randomInt(1, Math.max(1, playerPokemon.atk)),
            criticalHit: this.randomBool(0.1), // 10%暴击概率
            miss: this.randomBool(0.05) // 5%miss概率
        };
    }

    // 生成随机捕捉结果
    generateRandomCatchResult(pokemon, pokeballType = 'normal') {
        const baseCatchRate = pokemon.catchRate;
        let modifiedCatchRate = baseCatchRate;
        
        // 根据精灵球类型调整捕捉率
        switch (pokeballType) {
            case 'super':
                modifiedCatchRate *= 1.5;
                break;
            case 'master':
                modifiedCatchRate = 1.0; // 大师球必定捕捉
                break;
            default:
                break;
        }
        
        const isCaught = this.randomBool(modifiedCatchRate);
        
        return {
            caught: isCaught,
            catchRate: modifiedCatchRate,
            pokeballUsed: pokeballType
        };
    }

    // 生成随机地图事件
    generateRandomMapEvent() {
        const events = [
            { type: 'pokemon_encounter', weight: 60, description: '遇到野生宠物' },
            { type: 'item_found', weight: 20, description: '发现道具' },
            { type: 'treasure_chest', weight: 10, description: '发现宝箱' },
            { type: 'special_event', weight: 5, description: '特殊事件' },
            { type: 'nothing', weight: 5, description: '什么都没发生' }
        ];
        
        return this.weightedChoice(events);
    }

    // 生成随机天气
    generateRandomWeather() {
        const weathers = [
            { type: 'sunny', weight: 30, effect: '火系宠物攻击力+10%' },
            { type: 'rainy', weight: 25, effect: '水系宠物攻击力+10%' },
            { type: 'stormy', weight: 15, effect: '电系宠物攻击力+15%' },
            { type: 'foggy', weight: 20, effect: '所有宠物命中率-5%' },
            { type: 'clear', weight: 10, effect: '无特殊效果' }
        ];
        
        return this.weightedChoice(weathers);
    }
} 