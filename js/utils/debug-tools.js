// Debug工具类
class DebugTools {
    constructor(game) {
        this.game = game;
        this.isEnabled = false;
        this.debugPanel = null;
        this.debugLog = [];
        this.maxLogEntries = 100;
    }

    // 初始化debug工具
    init() {
        this.createDebugPanel();
        this.bindKeyboardShortcuts();
        this.log("Debug工具已初始化", "info");
    }

    // 创建debug面板
    createDebugPanel() {
        // 创建debug面板容器
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'debug-panel';
        this.debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 10px;
            border: 2px solid #00ff00;
            border-radius: 5px;
            z-index: 10000;
            overflow-y: auto;
            display: none;
        `;

        // 创建标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #00ff00;
            padding-bottom: 5px;
        `;
        
        const title = document.createElement('h3');
        title.textContent = 'DEBUG PANEL';
        title.style.margin = '0';
        title.style.color = '#00ff00';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = `
            background: none;
            border: 1px solid #00ff00;
            color: #00ff00;
            cursor: pointer;
            padding: 2px 6px;
        `;
        closeBtn.onclick = () => this.togglePanel();
        
        titleBar.appendChild(title);
        titleBar.appendChild(closeBtn);
        this.debugPanel.appendChild(titleBar);

        // 创建控制按钮区域
        this.createControlButtons();
        
        // 创建信息显示区域
        this.createInfoDisplay();
        
        // 创建日志区域
        this.createLogDisplay();

        document.body.appendChild(this.debugPanel);
    }

    // 创建控制按钮
    createControlButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px;
            margin-bottom: 10px;
        `;

        const buttons = [
            { text: '玩家信息', action: () => this.showPlayerInfo() },
            { text: '宠物信息', action: () => this.showPokemonInfo() },
            { text: '地图信息', action: () => this.showMapInfo() },
            { text: '战斗信息', action: () => this.showBattleInfo() },
            { text: '添加金币', action: () => this.addGold() },
            { text: '添加经验', action: () => this.addExp() },
            { text: '恢复血量', action: () => this.healAllPokemon() },
            { text: '升级宠物', action: () => this.levelUpPokemon() },
            { text: '生成敌人', action: () => this.generateEnemy() },
            { text: '测试血量', action: () => this.testHpChange() },
            { text: '测试失败', action: () => this.testBattleDefeat() },
            { text: '清空日志', action: () => this.clearLog() },
            { text: '保存游戏', action: () => this.saveGame() },
            { text: '加载游戏', action: () => this.loadGame() }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                background: #000;
                border: 1px solid #00ff00;
                color: #00ff00;
                cursor: pointer;
                padding: 5px;
                font-size: 10px;
            `;
            button.onclick = btn.action;
            buttonContainer.appendChild(button);
        });

        this.debugPanel.appendChild(buttonContainer);
    }

    // 创建信息显示区域
    createInfoDisplay() {
        this.infoDisplay = document.createElement('div');
        this.infoDisplay.id = 'debug-info';
        this.infoDisplay.style.cssText = `
            margin-bottom: 10px;
            padding: 5px;
            border: 1px solid #00ff00;
            background: rgba(0, 255, 0, 0.1);
            max-height: 200px;
            overflow-y: auto;
        `;
        this.debugPanel.appendChild(this.infoDisplay);
    }

    // 创建日志显示区域
    createLogDisplay() {
        this.logDisplay = document.createElement('div');
        this.logDisplay.id = 'debug-log';
        this.logDisplay.style.cssText = `
            max-height: 150px;
            overflow-y: auto;
            border: 1px solid #00ff00;
            padding: 5px;
            background: rgba(0, 0, 0, 0.5);
        `;
        this.debugPanel.appendChild(this.logDisplay);
    }

    // 绑定键盘快捷键
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + D 切换debug面板
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.togglePanel();
            }
            
            // 只有在debug面板打开时才处理其他快捷键
            if (!this.isEnabled) return;
            
            switch(e.key) {
                case '1': // 显示玩家信息
                    e.preventDefault();
                    this.showPlayerInfo();
                    break;
                case '2': // 显示宠物信息
                    e.preventDefault();
                    this.showPokemonInfo();
                    break;
                case '3': // 显示地图信息
                    e.preventDefault();
                    this.showMapInfo();
                    break;
                case '4': // 显示战斗信息
                    e.preventDefault();
                    this.showBattleInfo();
                    break;
                case 'g': // 添加金币
                    e.preventDefault();
                    this.addGold();
                    break;
                case 'e': // 添加经验
                    e.preventDefault();
                    this.addExp();
                    break;
                case 'h': // 恢复血量
                    e.preventDefault();
                    this.healAllPokemon();
                    break;
                case 'l': // 升级宠物
                    e.preventDefault();
                    this.levelUpPokemon();
                    break;
                case 't': // 测试血量变化
                    e.preventDefault();
                    this.testHpChange();
                    break;
            }
        });
    }

    // 切换debug面板显示
    togglePanel() {
        this.isEnabled = !this.isEnabled;
        this.debugPanel.style.display = this.isEnabled ? 'block' : 'none';
        this.log(`Debug面板${this.isEnabled ? '已开启' : '已关闭'}`, "info");
        
        if (this.isEnabled) {
            this.showPlayerInfo(); // 默认显示玩家信息
        }
    }

    // 显示玩家信息
    showPlayerInfo() {
        const player = this.game.player;
        const info = `
玩家信息:
- 等级: ${player.level}
- 经验: ${player.exp}/${player.getRequiredExp()}
- 金币: ${player.gold}
- 当前地图: ${player.currentMap}
- 战斗统计: 胜利${player.battleStats.wins}次, 失败${player.battleStats.losses}次
- 宠物数量: ${player.pokemon.length}
- 已捕捉: ${player.caughtPokemon}只
- 装备精灵球: ${player.getEquippedPokeball()} (${player.getEquippedPokeballCount()}个)
        `;
        this.updateInfoDisplay(info);
        this.log("显示玩家信息", "info");
    }

    // 显示宠物信息
    showPokemonInfo() {
        const player = this.game.player;
        let info = `宠物信息 (共${player.pokemon.length}只):\n`;
        
        player.pokemon.forEach((pokemon, index) => {
            const status = pokemon.isAlive() ? '存活' : '死亡';
            info += `
${index + 1}. ${pokemon.getDisplayName()} (Lv.${pokemon.level})
   HP: ${pokemon.currentHp}/${pokemon.maxHp} (${pokemon.getHpPercentage().toFixed(1)}%)
   攻击: ${pokemon.atk} | 防御: ${pokemon.def}
   属性: ${pokemon.getElementDisplayName()} | 稀有度: ${pokemon.getRarityDisplayName()}
   状态: ${status}
            `;
        });
        
        this.updateInfoDisplay(info);
        this.log("显示宠物信息", "info");
    }

    // 显示地图信息
    showMapInfo() {
        const player = this.game.player;
        const currentMapData = player.getCurrentMapData();
        const info = `
当前地图信息:
- 地图: ${player.currentMap}
- 描述: ${currentMapData.description}
- 等级范围: ${currentMapData.levelRange}
- 难度: ${currentMapData.difficulty}
- 奖励倍率: 金币${MAP_REWARD_MULTIPLIERS[currentMapData.difficulty].gold}x, 经验${MAP_REWARD_MULTIPLIERS[currentMapData.difficulty].exp}x
- 宠物池: ${currentMapData.pokemonPool.map(p => `${p.name}(${p.weight})`).join(', ')}
        `;
        this.updateInfoDisplay(info);
        this.log("显示地图信息", "info");
    }

    // 显示战斗信息
    showBattleInfo() {
        const battleSystem = this.game.battleSystem;
        const status = battleSystem.getBattleStatus();
        const currentEnemy = battleSystem.getCurrentEnemy();
        
        let info = `
战斗系统信息:
- 运行状态: ${status.isRunning ? '运行中' : '已停止'}
- 战斗间隔: ${status.battleTime}ms
- 日志数量: ${status.logCount}
        `;
        
        if (currentEnemy) {
            info += `
当前敌人:
- ${currentEnemy.getDisplayName()} (Lv.${currentEnemy.level})
- HP: ${currentEnemy.currentHp}/${currentEnemy.maxHp}
- 攻击: ${currentEnemy.atk} | 防御: ${currentEnemy.def}
- 属性: ${currentEnemy.getElementDisplayName()}
            `;
        } else {
            info += '\n当前敌人: 无';
        }
        
        this.updateInfoDisplay(info);
        this.log("显示战斗信息", "info");
    }

    // 添加金币
    addGold() {
        const amount = prompt("请输入要添加的金币数量:", "1000");
        if (amount && !isNaN(amount)) {
            this.game.player.gainGold(parseInt(amount));
            this.log(`添加了 ${amount} 金币`, "success");
            // 立即更新游戏UI
            this.game.uiManager.updateStatusBar(this.game.player);
            this.showPlayerInfo();
        }
    }

    // 添加经验
    addExp() {
        const amount = prompt("请输入要添加的经验值:", "100");
        if (amount && !isNaN(amount)) {
            this.game.player.gainExp(parseInt(amount));
            this.log(`添加了 ${amount} 经验值`, "success");
            // 立即更新游戏UI
            this.game.uiManager.updateStatusBar(this.game.player);
            this.showPlayerInfo();
        }
    }

    // 恢复所有宠物血量
    healAllPokemon() {
        this.game.player.pokemon.forEach(pokemon => {
            pokemon.fullHeal();
        });
        this.log("所有宠物血量已恢复", "success");
        // 立即更新游戏UI
        this.game.updateBattleUI();
        this.game.updateInventoryUI();
        this.showPokemonInfo();
    }

    // 升级宠物
    levelUpPokemon() {
        const player = this.game.player;
        if (player.pokemon.length === 0) {
            this.log("没有宠物可以升级", "error");
            return;
        }
        
        const pokemonIndex = prompt(`选择要升级的宠物 (1-${player.pokemon.length}):`, "1");
        if (pokemonIndex && !isNaN(pokemonIndex)) {
            const index = parseInt(pokemonIndex) - 1;
            if (index >= 0 && index < player.pokemon.length) {
                const pokemon = player.pokemon[index];
                const oldLevel = pokemon.level;
                pokemon.gainExp(pokemon.getRequiredExp());
                this.log(`${pokemon.getDisplayName()} 从 ${oldLevel} 级升级到 ${pokemon.level} 级`, "success");
                // 立即更新游戏UI
                this.game.updateBattleUI();
                this.game.updateInventoryUI();
                this.showPokemonInfo();
            }
        }
    }

    // 生成敌人
    generateEnemy() {
        const enemy = this.game.battleSystem.generateEnemy();
        if (enemy) {
            this.game.battleSystem.currentEnemy = enemy;
            this.log(`生成了敌人: ${enemy.getDisplayName()} (Lv.${enemy.level})`, "success");
            // 立即更新游戏UI
            this.game.updateBattleUI();
            this.showBattleInfo();
        } else {
            this.log("无法生成敌人", "error");
        }
    }

    // 测试血量变化
    testHpChange() {
        const player = this.game.player;
        if (player.pokemon.length === 0) {
            this.log("没有宠物可以测试", "error");
            return;
        }
        
        // 随机选择一个宠物并减少血量
        const randomIndex = Math.floor(Math.random() * player.pokemon.length);
        const pokemon = player.pokemon[randomIndex];
        const damage = Math.floor(pokemon.maxHp * 0.3); // 减少30%血量
        
        pokemon.takeDamage(damage);
        this.log(`${pokemon.getDisplayName()} 血量减少 ${damage} 点`, "warning");
        
        // 立即更新游戏UI
        this.game.updateBattleUI();
        this.game.updateInventoryUI();
        this.showPokemonInfo();
    }

    // 测试战斗失败重置
    testBattleDefeat() {
        const player = this.game.player;
        if (player.pokemon.length === 0) {
            this.log("没有宠物可以测试", "error");
            return;
        }
        
        // 选择一个宠物并设置为死亡状态
        const pokemon = player.pokemon[0];
        pokemon.currentHp = 0;
        this.log(`${pokemon.getDisplayName()} 血量设为0`, "warning");
        
        // 模拟战斗失败
        this.game.battleSystem.handleBattleDefeat(pokemon);
        
        // 立即更新游戏UI
        this.game.updateBattleUI();
        this.game.updateInventoryUI();
        this.showBattleInfo();
        this.showPokemonInfo();
    }

    // 更新信息显示
    updateInfoDisplay(info) {
        this.infoDisplay.innerHTML = info.replace(/\n/g, '<br>');
    }

    // 添加日志
    log(message, type = "info") {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            message: message,
            type: type,
            timestamp: timestamp
        };
        
        this.debugLog.push(logEntry);
        
        // 限制日志数量
        if (this.debugLog.length > this.maxLogEntries) {
            this.debugLog.shift();
        }
        
        this.updateLogDisplay();
    }

    // 更新日志显示
    updateLogDisplay() {
        this.logDisplay.innerHTML = this.debugLog
            .map(entry => {
                const color = this.getLogColor(entry.type);
                return `<div style="color: ${color}; margin-bottom: 2px;">
                    [${entry.timestamp}] ${entry.message}
                </div>`;
            })
            .join('');
        
        // 滚动到底部
        this.logDisplay.scrollTop = this.logDisplay.scrollHeight;
    }

    // 获取日志颜色
    getLogColor(type) {
        switch(type) {
            case 'success': return '#00ff00';
            case 'error': return '#ff0000';
            case 'warning': return '#ffff00';
            case 'info': 
            default: return '#00ffff';
        }
    }

    // 清空日志
    clearLog() {
        this.debugLog = [];
        this.updateLogDisplay();
        this.log("日志已清空", "info");
    }

    // 保存游戏
    saveGame() {
        try {
            this.game.saveGame();
            this.log("游戏已保存", "success");
        } catch (error) {
            this.log(`保存失败: ${error.message}`, "error");
        }
    }

    // 加载游戏
    loadGame() {
        try {
            this.game.loadGame();
            this.log("游戏已加载", "success");
            this.showPlayerInfo();
        } catch (error) {
            this.log(`加载失败: ${error.message}`, "error");
        }
    }

    // 获取调试信息
    getDebugInfo() {
        return {
            isEnabled: this.isEnabled,
            logCount: this.debugLog.length,
            gameState: {
                playerLevel: this.game.player.level,
                pokemonCount: this.game.player.pokemon.length,
                currentMap: this.game.player.currentMap,
                battleRunning: this.game.battleSystem.isBattleRunning()
            }
        };
    }

    // 销毁debug工具
    destroy() {
        if (this.debugPanel) {
            document.body.removeChild(this.debugPanel);
        }
        this.log("Debug工具已销毁", "info");
    }
} 