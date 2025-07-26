// 战斗系统
class BattleSystem {
    constructor(player) {
        this.player = player;
        this.isRunning = false;
        this.battleInterval = null;
        this.battleTime = 5000; // 5秒
        this.currentEnemy = null;
        this.battleLog = [];
        this.onBattleUpdate = null;
        this.onBattleEnd = null;
    }

    // 开始自动战斗
    startAutoBattle() {
        if (this.isRunning) return false;
        
        this.isRunning = true;
        this.battleInterval = setInterval(() => {
            this.performBattle();
        }, this.battleTime);
        
        this.addLog("自动战斗已开始", "info");
        return true;
    }

    // 停止自动战斗
    stopAutoBattle() {
        if (!this.isRunning) return false;
        
        this.isRunning = false;
        if (this.battleInterval) {
            clearInterval(this.battleInterval);
            this.battleInterval = null;
        }
        
        this.addLog("自动战斗已停止", "info");
        return true;
    }

    // 执行单次战斗
    performBattle() {
        // 检查玩家是否有可战斗的宠物
        if (!this.player.hasBattleReadyPokemon()) {
            this.addLog("没有可战斗的宠物，战斗停止", "info");
            this.stopAutoBattle();
            return;
        }

        // 如果没有当前敌人，生成新敌人
        if (!this.currentEnemy || !this.currentEnemy.isAlive()) {
            this.currentEnemy = this.generateEnemy();
            if (!this.currentEnemy) {
                this.addLog("无法生成敌人，战斗停止", "info");
                this.stopAutoBattle();
                return;
            }
            this.addLog(`遇到了 ${this.currentEnemy.getDisplayName()}！`, "info");
        }

        // 执行战斗
        const battleResult = this.executeBattle();
        
        // 处理战斗结果
        this.handleBattleResult(battleResult);
        
        // 触发更新回调
        if (this.onBattleUpdate) {
            this.onBattleUpdate(battleResult);
        }
    }

    // 生成敌人
    generateEnemy() {
        const currentMap = this.player.getCurrentMapData();
        if (!currentMap) return null;

        // 根据地图的宠物池随机选择
        const pokemonPool = currentMap.pokemonPool;
        const totalWeight = pokemonPool.reduce((sum, pokemon) => sum + pokemon.weight, 0);
        let random = Math.random() * totalWeight;
        
        let selectedPokemon = null;
        for (const pokemon of pokemonPool) {
            random -= pokemon.weight;
            if (random <= 0) {
                selectedPokemon = pokemon;
                break;
            }
        }

        if (!selectedPokemon) return null;

        // 生成敌人等级（基于地图等级范围）
        const levelRange = currentMap.levelRange.split('-').map(Number);
        const minLevel = levelRange[0];
        const maxLevel = levelRange[1];
        const enemyLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;

        // 创建敌人宠物
        const enemy = new Pokemon(selectedPokemon.name, enemyLevel);
        enemy.isPlayerOwned = false;
        
        return enemy;
    }

    // 执行战斗
    executeBattle() {
        const playerPokemon = this.player.getSelectedPokemon();
        const enemy = this.currentEnemy;

        // 计算属性相克
        const playerEffectiveness = playerPokemon.getEffectiveness(enemy.element);
        const enemyEffectiveness = enemy.getEffectiveness(playerPokemon.element);

        // 计算伤害
        const playerDamage = playerPokemon.calculateDamage(enemy, playerEffectiveness);
        const enemyDamage = enemy.calculateDamage(playerPokemon, enemyEffectiveness);

        // 应用伤害
        const actualPlayerDamage = enemy.takeDamage(playerDamage);
        const actualEnemyDamage = playerPokemon.takeDamage(enemyDamage);

        // 记录战斗过程
        this.addLog(`${playerPokemon.getDisplayName()} 攻击 ${enemy.getDisplayName()}，造成 ${actualPlayerDamage} 点伤害`, "info");
        this.addLog(`${enemy.getDisplayName()} 攻击 ${playerPokemon.getDisplayName()}，造成 ${actualEnemyDamage} 点伤害`, "info");

        // 判断胜负
        let result = {
            playerPokemon: playerPokemon,
            enemy: enemy,
            playerDamage: actualPlayerDamage,
            enemyDamage: actualEnemyDamage,
            playerEffectiveness: playerEffectiveness,
            enemyEffectiveness: enemyEffectiveness,
            winner: null,
            rewards: {}
        };

        if (!enemy.isAlive() && !playerPokemon.isAlive()) {
            // 平局
            result.winner = 'draw';
            this.addLog("战斗平局！", "info");
        } else if (!enemy.isAlive()) {
            // 玩家胜利
            result.winner = 'player';
            this.addLog(`${playerPokemon.getDisplayName()} 击败了 ${enemy.getDisplayName()}！`, "victory");
        } else if (!playerPokemon.isAlive()) {
            // 敌人胜利
            result.winner = 'enemy';
            this.addLog(`${enemy.getDisplayName()} 击败了 ${playerPokemon.getDisplayName()}！`, "defeat");
        }

        return result;
    }

    // 处理战斗结果
    handleBattleResult(result) {
        if (!result.winner) return;

        const currentMap = this.player.getCurrentMapData();
        const mapRewards = currentMap.rewards;
        const difficultyMultiplier = MAP_REWARD_MULTIPLIERS[currentMap.difficulty];

        if (result.winner === 'player') {
            // 玩家胜利
            this.player.updateBattleStats('win');
            
            // 胜利后全体宠物恢复满血
            this.player.healAllPokemon();
            this.addLog('所有宠物已恢复满血量', 'info');
            
            // 计算奖励
            const goldReward = Math.floor(
                (Math.random() * (mapRewards.gold.max - mapRewards.gold.min) + mapRewards.gold.min) * 
                difficultyMultiplier.gold
            );
            const expReward = Math.floor(
                (Math.random() * (mapRewards.exp.max - mapRewards.exp.min) + mapRewards.exp.min) * 
                difficultyMultiplier.exp
            );

            // 给予奖励
            this.player.gainGold(goldReward);
            this.player.gainExp(expReward);
            result.playerPokemon.gainExp(expReward);

            this.addLog(`获得 ${goldReward} 金币和 ${expReward} 经验值`, "reward");

            // 检查是否掉落精灵球
            if (Math.random() < mapRewards.pokeballChance) {
                // 根据地图难度决定掉落精灵球类型
                const pokeballType = this.getRandomPokeballType(currentMap.difficulty);
                this.player.addItem(pokeballType, 1);
                this.addLog(`获得${pokeballType}！`, "reward");
            }

            // 尝试捕捉敌人
            this.attemptCatch(result.enemy);

        } else if (result.winner === 'enemy') {
            // 敌人胜利
            this.player.updateBattleStats('loss');
            this.addLog("战斗失败，没有获得奖励", "defeat");
            
            // 战斗失败后恢复宠物血量并重置战斗界面
            this.handleBattleDefeat(result.playerPokemon);
        } else if (result.winner === 'draw') {
            // 平局
            this.player.healAllPokemon();
            this.addLog('所有宠物已恢复满血量（平局）', 'info');
        }

        // 战斗结束后清除当前敌人，为下次战斗做准备
        if (result.winner === 'player' || result.winner === 'enemy' || result.winner === 'draw') {
            this.currentEnemy = null;
        }

        // 触发战斗结束回调
        if (this.onBattleEnd) {
            this.onBattleEnd(result);
        }
    }

    // 尝试捕捉敌人
    attemptCatch(enemy) {
        // 检查是否有装备的精灵球
        const equippedPokeball = this.player.getEquippedPokeball();
        const pokeballCount = this.player.getEquippedPokeballCount();
        
        if (pokeballCount <= 0) {
            this.addLog(`没有${equippedPokeball}，无法捕捉`, "info");
            return false;
        }

        // 使用装备的精灵球
        this.player.useEquippedPokeball();

        // 计算捕捉概率
        const baseCatchRate = enemy.catchRate;
        const rarityModifier = RARITY_MODIFIERS[enemy.rarity].catchRate;
        const pokeballCatchRate = this.player.getPokeballCatchRate(equippedPokeball);
        const finalCatchRate = baseCatchRate * rarityModifier * pokeballCatchRate;

        this.addLog(`使用${equippedPokeball}尝试捕捉 ${enemy.getDisplayName()}...`, "info");

        // 尝试捕捉
        if (Math.random() < finalCatchRate) {
            // 捕捉成功
            this.player.addPokemon(enemy);
            this.player.incrementCaughtPokemon();
            this.addLog(`成功捕捉 ${enemy.getDisplayName()}！`, "victory");
            return true;
        } else {
            // 捕捉失败
            this.addLog(`${enemy.getDisplayName()} 逃脱了！`, "defeat");
            return false;
        }
    }

    // 手动战斗（单次）
    manualBattle() {
        if (this.isRunning) {
            this.addLog("自动战斗正在进行中，无法手动战斗", "info");
            return false;
        }

        this.performBattle();
        return true;
    }

    // 添加战斗日志
    addLog(message, type = "info") {
        const logEntry = {
            message: message,
            type: type,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.battleLog.push(logEntry);
        
        // 限制日志数量
        if (this.battleLog.length > 100) {
            this.battleLog.shift();
        }
    }

    // 获取战斗日志
    getBattleLog() {
        return this.battleLog;
    }

    // 清空战斗日志
    clearBattleLog() {
        this.battleLog = [];
    }

    // 获取当前敌人
    getCurrentEnemy() {
        return this.currentEnemy;
    }

    // 检查是否正在战斗
    isBattleRunning() {
        return this.isRunning;
    }

    // 获取战斗状态
    getBattleStatus() {
        return {
            isRunning: this.isRunning,
            currentEnemy: this.currentEnemy,
            battleTime: this.battleTime,
            logCount: this.battleLog.length
        };
    }

    // 设置战斗间隔时间
    setBattleTime(time) {
        this.battleTime = time;
        if (this.isRunning) {
            this.stopAutoBattle();
            this.startAutoBattle();
        }
    }

    // 设置回调函数
    setCallbacks(onBattleUpdate, onBattleEnd) {
        this.onBattleUpdate = onBattleUpdate;
        this.onBattleEnd = onBattleEnd;
    }

    // 获取随机精灵球类型
    getRandomPokeballType(difficulty) {
        const pokeballTypes = ["精灵球", "超级球", "大师球"];
        const weights = [0, 0, 0];
        
        // 根据难度调整权重
        switch (difficulty) {
            case 1: // 新手村
                weights[0] = 100; // 100% 精灵球
                break;
            case 2: // 火焰森林
                weights[0] = 80;  // 80% 精灵球
                weights[1] = 20;  // 20% 超级球
                break;
            case 3: // 深海遗迹、神秘花园
                weights[0] = 60;  // 60% 精灵球
                weights[1] = 35;  // 35% 超级球
                weights[2] = 5;   // 5% 大师球
                break;
            case 4: // 雷电场
                weights[0] = 40;  // 40% 精灵球
                weights[1] = 50;  // 50% 超级球
                weights[2] = 10;  // 10% 大师球
                break;
            case 5: // 进化之塔
                weights[0] = 20;  // 20% 精灵球
                weights[1] = 60;  // 60% 超级球
                weights[2] = 20;  // 20% 大师球
                break;
            case 10: // 传说之地
                weights[0] = 10;  // 10% 精灵球
                weights[1] = 40;  // 40% 超级球
                weights[2] = 50;  // 50% 大师球
                break;
            default:
                weights[0] = 100;
        }
        
        // 根据权重随机选择
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return pokeballTypes[i];
            }
        }
        
        return "精灵球"; // 默认返回
    }

    // 处理战斗失败
    handleBattleDefeat(playerPokemon) {
        // 恢复宠物血量
        playerPokemon.fullHeal();
        this.addLog(`${playerPokemon.getDisplayName()} 已恢复满血量`, "info");
        
        // 清除当前敌人，重置战斗界面
        this.currentEnemy = null;
        this.addLog("战斗界面已重置", "info");
        
        // 停止自动战斗
        this.stopAutoBattle();
        
        // 确保战斗状态完全重置
        this.isRunning = false;
        if (this.battleInterval) {
            clearInterval(this.battleInterval);
            this.battleInterval = null;
        }
    }

    // 重置战斗系统
    reset() {
        this.stopAutoBattle();
        this.currentEnemy = null;
        this.battleLog = [];
        this.onBattleUpdate = null;
        this.onBattleEnd = null;
    }
} 