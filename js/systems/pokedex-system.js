// 图鉴系统
class PokedexSystem {
    constructor(player) {
        this.player = player;
    }

    // 获取图鉴信息
    getPokedexInfo() {
        return this.player.getPokedexInfo();
    }

    // 获取所有宠物模板
    getAllPokemonTemplates() {
        return Object.keys(POKEMON_TEMPLATES);
    }

    // 获取宠物模板信息
    getPokemonTemplate(pokemonName) {
        return POKEMON_TEMPLATES[pokemonName];
    }

    // 检查是否发现过宠物
    isPokemonDiscovered(pokemonName) {
        return this.player.hasDiscoveredPokemon(pokemonName);
    }

    // 发现宠物
    discoverPokemon(pokemonName) {
        this.player.discoverPokemon(pokemonName);
    }

    // 获取图鉴条目
    getPokedexEntry(pokemonName) {
        const template = POKEMON_TEMPLATES[pokemonName];
        if (!template) return null;

        const isDiscovered = this.isPokemonDiscovered(pokemonName);
        const playerPokemon = this.player.getAllPokemon().find(p => p.name === pokemonName);

        return {
            name: template.name,
            rarity: template.rarity,
            element: template.element,
            description: template.description,
            emoji: template.emoji,
            isDiscovered: isDiscovered,
            playerOwned: !!playerPokemon,
            playerPokemon: playerPokemon ? {
                level: playerPokemon.level,
                status: playerPokemon.getStatusInfo()
            } : null,
            baseStats: template.baseStats,
            evolveLevel: template.evolveLevel,
            nextForm: template.nextForm,
            catchRate: template.catchRate
        };
    }

    // 获取过滤后的图鉴列表
    getFilteredPokedex(rarityFilter = "", elementFilter = "") {
        const allPokemon = this.getAllPokemonTemplates();
        const filtered = allPokemon.filter(pokemonName => {
            const template = POKEMON_TEMPLATES[pokemonName];
            
            // 稀有度过滤
            if (rarityFilter && template.rarity !== rarityFilter) {
                return false;
            }
            
            // 属性过滤
            if (elementFilter && template.element !== elementFilter) {
                return false;
            }
            
            return true;
        });

        return filtered.map(pokemonName => this.getPokedexEntry(pokemonName));
    }

    // 获取图鉴统计信息
    getPokedexStats() {
        const pokedexInfo = this.getPokedexInfo();
        const allPokemon = this.getAllPokemonTemplates();
        
        const stats = {
            total: pokedexInfo.total,
            discovered: pokedexInfo.discovered,
            percentage: pokedexInfo.percentage,
            byRarity: {
                Common: { total: 0, discovered: 0 },
                Rare: { total: 0, discovered: 0 },
                Epic: { total: 0, discovered: 0 },
                Legendary: { total: 0, discovered: 0 }
            },
            byElement: {
                Fire: { total: 0, discovered: 0 },
                Water: { total: 0, discovered: 0 },
                Grass: { total: 0, discovered: 0 },
                Electric: { total: 0, discovered: 0 },
                Normal: { total: 0, discovered: 0 }
            }
        };

        // 统计各稀有度和属性的宠物数量
        allPokemon.forEach(pokemonName => {
            const template = POKEMON_TEMPLATES[pokemonName];
            const isDiscovered = this.isPokemonDiscovered(pokemonName);
            
            stats.byRarity[template.rarity].total++;
            if (isDiscovered) {
                stats.byRarity[template.rarity].discovered++;
            }
            
            stats.byElement[template.element].total++;
            if (isDiscovered) {
                stats.byElement[template.element].discovered++;
            }
        });

        return stats;
    }

    // 获取稀有度完成度
    getRarityCompletion() {
        const stats = this.getPokedexStats();
        const completion = {};
        
        Object.keys(stats.byRarity).forEach(rarity => {
            const rarityStats = stats.byRarity[rarity];
            completion[rarity] = {
                total: rarityStats.total,
                discovered: rarityStats.discovered,
                percentage: rarityStats.total > 0 ? (rarityStats.discovered / rarityStats.total) * 100 : 0
            };
        });
        
        return completion;
    }

    // 获取属性完成度
    getElementCompletion() {
        const stats = this.getPokedexStats();
        const completion = {};
        
        Object.keys(stats.byElement).forEach(element => {
            const elementStats = stats.byElement[element];
            completion[element] = {
                total: elementStats.total,
                discovered: elementStats.discovered,
                percentage: elementStats.total > 0 ? (elementStats.discovered / elementStats.total) * 100 : 0
            };
        });
        
        return completion;
    }

    // 获取最近发现的宠物
    getRecentlyDiscovered(limit = 5) {
        // 这里可以扩展为记录发现时间，暂时返回所有发现的宠物
        const discovered = this.player.getPokedexInfo().discoveredList;
        return discovered.slice(-limit).map(pokemonName => this.getPokedexEntry(pokemonName));
    }

    // 获取未发现的宠物
    getUndiscoveredPokemon() {
        const undiscovered = this.player.getPokedexInfo().undiscoveredList;
        return undiscovered.map(pokemonName => this.getPokedexEntry(pokemonName));
    }

    // 搜索宠物
    searchPokemon(query) {
        const allPokemon = this.getAllPokemonTemplates();
        const results = allPokemon.filter(pokemonName => {
            const template = POKEMON_TEMPLATES[pokemonName];
            return pokemonName.toLowerCase().includes(query.toLowerCase()) ||
                   template.description.toLowerCase().includes(query.toLowerCase()) ||
                   template.element.toLowerCase().includes(query.toLowerCase()) ||
                   template.rarity.toLowerCase().includes(query.toLowerCase());
        });
        
        return results.map(pokemonName => this.getPokedexEntry(pokemonName));
    }

    // 获取进化链信息
    getEvolutionChain(pokemonName) {
        const chain = [];
        let currentName = pokemonName;
        
        // 向前查找基础形态
        while (true) {
            const template = POKEMON_TEMPLATES[currentName];
            if (!template) break;
            
            // 查找是否有其他宠物进化为此宠物
            const prevEvolution = Object.keys(POKEMON_TEMPLATES).find(name => {
                const t = POKEMON_TEMPLATES[name];
                return t.nextForm === currentName;
            });
            
            if (!prevEvolution) break;
            currentName = prevEvolution;
        }
        
        // 构建进化链
        while (currentName) {
            const template = POKEMON_TEMPLATES[currentName];
            if (!template) break;
            
            chain.push({
                name: currentName,
                template: template,
                isDiscovered: this.isPokemonDiscovered(currentName),
                playerOwned: !!this.player.getAllPokemon().find(p => p.name === currentName)
            });
            
            currentName = template.nextForm;
        }
        
        return chain;
    }

    // 获取图鉴成就
    getPokedexAchievements() {
        const stats = this.getPokedexStats();
        const achievements = [];
        
        // 发现成就
        if (stats.discovered >= 10) {
            achievements.push({
                name: "初级收集者",
                description: "发现10只宠物",
                completed: true,
                progress: stats.discovered,
                target: 10
            });
        } else {
            achievements.push({
                name: "初级收集者",
                description: "发现10只宠物",
                completed: false,
                progress: stats.discovered,
                target: 10
            });
        }
        
        if (stats.discovered >= 25) {
            achievements.push({
                name: "中级收集者",
                description: "发现25只宠物",
                completed: true,
                progress: stats.discovered,
                target: 25
            });
        } else {
            achievements.push({
                name: "中级收集者",
                description: "发现25只宠物",
                completed: false,
                progress: stats.discovered,
                target: 25
            });
        }
        
        if (stats.discovered >= 50) {
            achievements.push({
                name: "高级收集者",
                description: "发现50只宠物",
                completed: true,
                progress: stats.discovered,
                target: 50
            });
        } else {
            achievements.push({
                name: "高级收集者",
                description: "发现50只宠物",
                completed: false,
                progress: stats.discovered,
                target: 50
            });
        }
        
        // 稀有度成就
        const rarityCompletion = this.getRarityCompletion();
        Object.keys(rarityCompletion).forEach(rarity => {
            const completion = rarityCompletion[rarity];
            if (completion.total > 0) {
                if (completion.discovered === completion.total) {
                    achievements.push({
                        name: `${rarity}大师`,
                        description: `发现所有${rarity}宠物`,
                        completed: true,
                        progress: completion.discovered,
                        target: completion.total
                    });
                } else {
                    achievements.push({
                        name: `${rarity}大师`,
                        description: `发现所有${rarity}宠物`,
                        completed: false,
                        progress: completion.discovered,
                        target: completion.total
                    });
                }
            }
        });
        
        return achievements;
    }
} 