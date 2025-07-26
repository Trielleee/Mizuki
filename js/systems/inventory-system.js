// 背包系统
class InventorySystem {
    constructor(player) {
        this.player = player;
    }

    // 获取所有宠物
    getAllPokemon() {
        return this.player.getAllPokemon();
    }

    // 获取宠物信息
    getPokemonInfo(pokemonId) {
        const pokemon = this.player.getPokemon(pokemonId);
        if (!pokemon) return null;

        return {
            id: pokemon.id,
            name: pokemon.name,
            level: pokemon.level,
            rarity: pokemon.rarity,
            element: pokemon.element,
            emoji: pokemon.emoji,
            description: pokemon.description,
            isSelected: this.player.getSelectedPokemon()?.id === pokemon.id,
            status: pokemon.getStatusInfo(),
            evolutionInfo: pokemon.getEvolutionInfo()
        };
    }

    // 选择宠物
    selectPokemon(pokemonId) {
        return this.player.selectPokemon(pokemonId);
    }

    // 进化宠物
    evolvePokemon(pokemonId) {
        const pokemon = this.player.getPokemon(pokemonId);
        if (!pokemon) return { success: false, message: "宠物不存在" };

        if (!pokemon.canEvolve()) {
            return { success: false, message: "宠物无法进化" };
        }

        const oldName = pokemon.name;
        const evolved = pokemon.evolve();
        
        if (evolved) {
            return { 
                success: true, 
                message: `${oldName} 进化为 ${pokemon.name}！`,
                oldName: oldName,
                newName: pokemon.name
            };
        } else {
            return { success: false, message: "进化失败" };
        }
    }

    // 使用道具
    useItem(itemName, targetId = null) {
        const itemCount = this.player.getItemCount(itemName);
        if (itemCount <= 0) {
            return { success: false, message: "道具不足" };
        }

        switch (itemName) {
            case "生命药水":
                return this.useHealthPotion(targetId);
            case "超级药水":
                return this.useSuperPotion(targetId);
            case "进化石":
                return this.useEvolutionStone(targetId);
            default:
                return { success: false, message: "未知道具" };
        }
    }

    // 使用生命药水
    useHealthPotion(pokemonId) {
        const pokemon = pokemonId ? this.player.getPokemon(pokemonId) : this.player.getSelectedPokemon();
        if (!pokemon) {
            return { success: false, message: "没有可治疗的宠物" };
        }

        if (pokemon.currentHp >= pokemon.maxHp) {
            return { success: false, message: "宠物生命值已满" };
        }

        const healAmount = Math.floor(pokemon.maxHp * 0.3);
        pokemon.heal(healAmount);
        this.player.useItem("生命药水");

        return { 
            success: true, 
            message: `${pokemon.name} 恢复了 ${healAmount} 点生命值`,
            healAmount: healAmount
        };
    }

    // 使用超级药水
    useSuperPotion(pokemonId) {
        const pokemon = pokemonId ? this.player.getPokemon(pokemonId) : this.player.getSelectedPokemon();
        if (!pokemon) {
            return { success: false, message: "没有可治疗的宠物" };
        }

        if (pokemon.currentHp >= pokemon.maxHp) {
            return { success: false, message: "宠物生命值已满" };
        }

        pokemon.fullHeal();
        this.player.useItem("超级药水");

        return { 
            success: true, 
            message: `${pokemon.name} 完全恢复了生命值`
        };
    }

    // 使用进化石
    useEvolutionStone(pokemonId) {
        const pokemon = pokemonId ? this.player.getPokemon(pokemonId) : this.player.getSelectedPokemon();
        if (!pokemon) {
            return { success: false, message: "没有可进化的宠物" };
        }

        if (!pokemon.canEvolve()) {
            return { success: false, message: "宠物无法进化" };
        }

        const oldName = pokemon.name;
        const evolved = pokemon.evolve();
        
        if (evolved) {
            this.player.useItem("进化石");
            return { 
                success: true, 
                message: `${oldName} 使用进化石进化为 ${pokemon.name}！`,
                oldName: oldName,
                newName: pokemon.name
            };
        } else {
            return { success: false, message: "进化失败" };
        }
    }

    // 获取所有道具
    getAllItems() {
        return this.player.getAllItems();
    }

    // 获取道具信息
    getItemInfo(itemName) {
        const itemInfo = {
            "精灵球": {
                name: "精灵球",
                description: "用于捕捉野生宠物",
                icon: "🔴",
                effect: "捕捉宠物"
            },
            "超级球": {
                name: "超级球",
                description: "比普通精灵球更容易捕捉宠物",
                icon: "🔵",
                effect: "提高捕捉成功率"
            },
            "大师球": {
                name: "大师球",
                description: "必定能捕捉到任何宠物",
                icon: "🟣",
                effect: "100%捕捉成功率"
            },
            "生命药水": {
                name: "生命药水",
                description: "恢复宠物30%的生命值",
                icon: "❤️",
                effect: "恢复生命值"
            },
            "超级药水": {
                name: "超级药水",
                description: "完全恢复宠物的生命值",
                icon: "💙",
                effect: "完全恢复生命值"
            },
            "进化石": {
                name: "进化石",
                description: "强制宠物进化",
                icon: "💎",
                effect: "强制进化"
            }
        };

        return itemInfo[itemName] || null;
    }

    // 获取背包统计信息
    getInventoryStats() {
        const pokemon = this.player.getAllPokemon();
        const stats = {
            totalPokemon: pokemon.length,
            byRarity: {
                Common: 0,
                Rare: 0,
                Epic: 0,
                Legendary: 0
            },
            byElement: {
                Fire: 0,
                Water: 0,
                Grass: 0,
                Electric: 0,
                Normal: 0
            },
            averageLevel: 0,
            totalItems: 0
        };

        // 统计宠物
        pokemon.forEach(p => {
            stats.byRarity[p.rarity]++;
            stats.byElement[p.element]++;
        });

        // 计算平均等级
        if (pokemon.length > 0) {
            const totalLevel = pokemon.reduce((sum, p) => sum + p.level, 0);
            stats.averageLevel = Math.floor(totalLevel / pokemon.length);
        }

        // 统计道具
        const items = this.player.getAllItems();
        stats.totalItems = Object.values(items).reduce((sum, count) => sum + count, 0);

        return stats;
    }

    // 释放宠物
    releasePokemon(pokemonId) {
        const pokemon = this.player.getPokemon(pokemonId);
        if (!pokemon) {
            return { success: false, message: "宠物不存在" };
        }

        // 不能释放当前选择的宠物
        if (this.player.getSelectedPokemon()?.id === pokemonId) {
            return { success: false, message: "不能释放当前选择的宠物" };
        }

        const removed = this.player.removePokemon(pokemonId);
        if (removed) {
            return { 
                success: true, 
                message: `释放了 ${removed.name}`,
                releasedPokemon: removed
            };
        }

        return { success: false, message: "释放失败" };
    }

    // 获取背包信息
    getInventoryInfo() {
        return this.player.getInventoryInfo();
    }
} 