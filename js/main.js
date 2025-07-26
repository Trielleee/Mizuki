// 主游戏类
class IdlePokemonGame {
    constructor() {
        this.player = null;
        this.battleSystem = null;
        this.inventorySystem = null;
        this.pokedexSystem = null;
        this.mapSystem = null;
        this.storageManager = null;
        this.uiManager = null;
        this.randomUtils = null;
        this.debugTools = null;
        
        this.isInitialized = false;
        this.gameLoop = null;
        this.updateInterval = 1000; // 1秒更新一次
    }

    // 初始化游戏
    async init() {
        try {
            console.log('正在初始化游戏...');
            
            // 初始化工具类
            this.storageManager = new StorageManager();
            this.randomUtils = new RandomUtils();
            
            // 加载或创建玩家数据
            this.player = this.storageManager.loadGame();
            if (!this.player) {
                this.player = new Player();
                // 给新玩家一些初始宠物
                this.giveInitialPokemon();
            }
            
            // 初始化系统
            this.battleSystem = new BattleSystem(this.player);
            this.inventorySystem = new InventorySystem(this.player);
            this.pokedexSystem = new PokedexSystem(this.player);
            this.mapSystem = new MapSystem(this.player);
            
            // 初始化UI管理器
            this.uiManager = new UIManager();
            this.uiManager.init();
            
            // 初始化Debug工具
            this.debugTools = new DebugTools(this);
            this.debugTools.init();
            
            // 绑定事件
            this.bindEvents();
            
            // 启动自动保存
            this.storageManager.startAutoSave(this.player);
            
            // 启动游戏循环
            this.startGameLoop();
            
            // 初始化UI
            this.initializeUI();
            
            this.isInitialized = true;
            console.log('游戏初始化完成');
            
            // 显示欢迎消息
            this.uiManager.showNotification('欢迎来到放置宠物养成！', 'success', 5000);
            
        } catch (error) {
            console.error('游戏初始化失败:', error);
            this.uiManager.showNotification('游戏初始化失败，请刷新页面重试', 'error');
        }
    }

    // 给新玩家初始宠物
    giveInitialPokemon() {
        const initialPokemon = [
            new Pokemon('Normie', 1),
            new Pokemon('Flarion', 1)
        ];
        
        initialPokemon.forEach(pokemon => {
            this.player.addPokemon(pokemon);
        });
        
        console.log('已给予初始宠物');
    }

    // 绑定事件
    bindEvents() {
        // 战斗按钮事件
        const startBattleBtn = document.getElementById('start-battle');
        const stopBattleBtn = document.getElementById('stop-battle');
        
        if (startBattleBtn) {
            startBattleBtn.addEventListener('click', () => {
                this.startBattle();
            });
        }
        
        if (stopBattleBtn) {
            stopBattleBtn.addEventListener('click', () => {
                this.stopBattle();
            });
        }

        // 精灵球装备选择事件
        const pokeballSelector = document.getElementById('pokeball-selector');
        if (pokeballSelector) {
            pokeballSelector.addEventListener('change', (e) => {
                this.equipPokeball(e.target.value);
            });
        }

        // 设置战斗系统回调
        this.battleSystem.setCallbacks(
            (result) => this.onBattleUpdate(result),
            (result) => this.onBattleEnd(result)
        );

        // 页面卸载时保存游戏
        window.addEventListener('beforeunload', () => {
            this.storageManager.saveGame(this.player);
        });

        // 页面可见性变化时处理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });
    }

    // 初始化UI
    initializeUI() {
        // 更新状态栏
        this.uiManager.updateStatusBar(this.player);
        
        // 初始化各个面板
        this.initializeBattleUI();
        this.initializeInventoryUI();
        this.initializePokedexUI();
        this.initializeMapUI();
    }

    // 初始化战斗UI
    initializeBattleUI() {
        this.updateBattleUI();
    }

    // 初始化背包UI
    initializeInventoryUI() {
        this.updateInventoryUI();
    }

    // 初始化图鉴UI
    initializePokedexUI() {
        this.updatePokedexUI();
    }

    // 初始化地图UI
    initializeMapUI() {
        this.updateMapUI();
    }

    // 开始战斗
    startBattle() {
        if (!this.player.hasBattleReadyPokemon()) {
            this.uiManager.showNotification('请先选择一只宠物进行战斗', 'warning');
            return;
        }

        const success = this.battleSystem.startAutoBattle();
        if (success) {
            document.getElementById('start-battle').disabled = true;
            document.getElementById('stop-battle').disabled = false;
            this.uiManager.showNotification('自动战斗已开始', 'success');
        }
    }

    // 停止战斗
    stopBattle() {
        const success = this.battleSystem.stopAutoBattle();
        if (success) {
            // 敌人消失
            this.battleSystem.currentEnemy = null;
            // 宠物回血
            this.player.healAllPokemon();
            // 立即刷新UI
            this.updateBattleUI();
            this.updateInventoryUI();
            document.getElementById('start-battle').disabled = false;
            document.getElementById('stop-battle').disabled = true;
            this.uiManager.showNotification('自动战斗已停止，所有宠物已恢复满血', 'info');
        }
    }

    // 战斗更新回调
    onBattleUpdate(result) {
        this.updateBattleUI();
        this.updateInventoryUI(); // 更新背包UI以显示血量变化
        
        // 更新状态栏
        this.uiManager.updateStatusBar(this.player);
        
        // 保存游戏
        this.storageManager.saveGame(this.player);
    }

    // 战斗结束回调
    onBattleEnd(result) {
        if (result.winner === 'player') {
            this.uiManager.showNotification('战斗胜利！', 'success');
        } else if (result.winner === 'enemy') {
            this.uiManager.showNotification('战斗失败', 'error');
        }
        
        this.updateBattleUI();
        this.updateInventoryUI(); // 更新背包UI以显示血量变化
    }

    // 更新战斗UI
    updateBattleUI() {
        const playerPokemon = this.player.getSelectedPokemon();
        const enemy = this.battleSystem.getCurrentEnemy();
        const battleStatus = this.battleSystem.getBattleStatus();
        
        // 更新玩家宠物显示
        const playerDisplay = document.getElementById('player-pokemon-display');
        if (playerDisplay) {
            if (playerPokemon) {
                playerDisplay.innerHTML = this.createPokemonCard(playerPokemon);
            } else {
                playerDisplay.innerHTML = '<div class="pokemon-placeholder">未选择宠物</div>';
            }
        }
        
        // 更新敌人显示
        const enemyDisplay = document.getElementById('enemy-pokemon-display');
        if (enemyDisplay) {
            if (enemy) {
                enemyDisplay.innerHTML = this.createPokemonCard(enemy);
            } else {
                enemyDisplay.innerHTML = '<div class="pokemon-placeholder">等待敌人...</div>';
            }
        }
        
        // 更新战斗状态
        const battleStatusElement = document.getElementById('battle-status');
        if (battleStatusElement) {
            battleStatusElement.textContent = battleStatus.isRunning ? '战斗中...' : '准备中...';
        }
        
        // 更新战斗按钮状态
        const startBattleBtn = document.getElementById('start-battle');
        const stopBattleBtn = document.getElementById('stop-battle');
        if (startBattleBtn && stopBattleBtn) {
            startBattleBtn.disabled = battleStatus.isRunning;
            stopBattleBtn.disabled = !battleStatus.isRunning;
        }
        
        // 更新精灵球装备显示
        this.updatePokeballEquipment();
        
        // 更新战斗日志
        this.updateBattleLog();
    }

    // 更新战斗UI（不更新日志，避免闪烁）
    updateBattleUIWithoutLog() {
        const playerPokemon = this.player.getSelectedPokemon();
        const enemy = this.battleSystem.getCurrentEnemy();
        const battleStatus = this.battleSystem.getBattleStatus();
        
        // 更新玩家宠物显示
        const playerDisplay = document.getElementById('player-pokemon-display');
        if (playerDisplay) {
            if (playerPokemon) {
                playerDisplay.innerHTML = this.createPokemonCard(playerPokemon);
            } else {
                playerDisplay.innerHTML = '<div class="pokemon-placeholder">未选择宠物</div>';
            }
        }
        
        // 更新敌人显示
        const enemyDisplay = document.getElementById('enemy-pokemon-display');
        if (enemyDisplay) {
            if (enemy) {
                enemyDisplay.innerHTML = this.createPokemonCard(enemy);
            } else {
                enemyDisplay.innerHTML = '<div class="pokemon-placeholder">等待敌人...</div>';
            }
        }
        
        // 更新战斗状态
        const battleStatusElement = document.getElementById('battle-status');
        if (battleStatusElement) {
            battleStatusElement.textContent = battleStatus.isRunning ? '战斗中...' : '准备中...';
        }
        
        // 更新战斗按钮状态
        const startBattleBtn = document.getElementById('start-battle');
        const stopBattleBtn = document.getElementById('stop-battle');
        if (startBattleBtn && stopBattleBtn) {
            startBattleBtn.disabled = battleStatus.isRunning;
            stopBattleBtn.disabled = !battleStatus.isRunning;
        }
        
        // 更新精灵球装备显示
        this.updatePokeballEquipment();
        
        // 注意：不更新战斗日志，避免闪烁
    }

    // 更新背包UI
    updateInventoryUI() {
        const pokemonGrid = document.getElementById('pokemon-grid');
        const itemsList = document.getElementById('items-list');
        
        if (pokemonGrid) {
            const pokemon = this.player.getAllPokemon();
            if (pokemon.length === 0) {
                pokemonGrid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🎒</div>
                        <div class="empty-state-text">背包空空如也</div>
                        <div class="empty-state-subtext">去战斗获得宠物吧！</div>
                    </div>
                `;
            } else {
                pokemonGrid.innerHTML = pokemon.map(p => this.createPokemonItem(p)).join('');
            }
        }
        
        if (itemsList) {
            const items = this.player.getAllItems();
            const itemCards = Object.entries(items).map(([name, count]) => {
                if (count > 0) {
                    return this.createItemCard(name, count);
                }
                return '';
            }).join('');
            
            itemsList.innerHTML = itemCards || `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <div class="empty-state-text">没有道具</div>
                    <div class="empty-state-subtext">去战斗获得道具吧！</div>
                </div>
            `;
        }
    }

    // 更新图鉴UI
    updatePokedexUI() {
        const pokedexGrid = document.getElementById('pokedex-grid');
        if (pokedexGrid) {
            const allPokemon = this.pokedexSystem.getAllPokemonTemplates();
            const pokedexEntries = allPokemon.map(name => this.pokedexSystem.getPokedexEntry(name));
            
            pokedexGrid.innerHTML = pokedexEntries.map(entry => this.createPokedexEntry(entry)).join('');
        }
    }

    // 更新地图UI
    updateMapUI() {
        const mapGrid = document.getElementById('map-grid');
        const mapPokemonList = document.getElementById('map-pokemon-list');
        
        if (mapGrid) {
            const allMaps = this.mapSystem.getAllMaps();
            mapGrid.innerHTML = allMaps.map(mapName => this.createMapCard(mapName)).join('');
        }
        
        if (mapPokemonList) {
            const currentMapPokemon = this.mapSystem.getCurrentMapPokemon();
            mapPokemonList.innerHTML = currentMapPokemon.map(pokemon => this.createMapPokemonItem(pokemon)).join('');
        }
        
        // 更新当前地图信息
        const currentMapName = document.getElementById('current-map-name');
        const mapLevelRange = document.getElementById('map-level-range');
        
        if (currentMapName) {
            currentMapName.textContent = this.player.getCurrentMap();
        }
        
        if (mapLevelRange) {
            const currentMapData = this.player.getCurrentMapData();
            if (currentMapData) {
                mapLevelRange.textContent = currentMapData.levelRange;
            }
        }
    }

    // 创建宠物卡片
    createPokemonCard(pokemon) {
        const status = pokemon.getStatusInfo();
        const hpClass = status.hpPercentage > 50 ? '' : status.hpPercentage > 25 ? 'medium' : 'low';
        
        return `
            <div class="pokemon-card">
                <div class="pokemon-avatar">${pokemon.emoji}</div>
                <div class="pokemon-name">${pokemon.name}</div>
                <div class="pokemon-level">等级 ${pokemon.level}</div>
                <div class="hp-container">
                    <div class="hp-label">
                        <span>HP</span>
                        <span>${pokemon.currentHp}/${pokemon.maxHp}</span>
                    </div>
                    <div class="hp-bar">
                        <div class="hp-fill ${hpClass}" style="width: ${status.hpPercentage}%"></div>
                    </div>
                </div>
                <div class="pokemon-stats">
                    <div class="stat-item">
                        <span class="stat-label">攻击</span>
                        <span class="stat-value">${pokemon.atk}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">防御</span>
                        <span class="stat-value">${pokemon.def}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 创建宠物项目
    createPokemonItem(pokemon) {
        const status = pokemon.getStatusInfo();
        const isSelected = this.player.getSelectedPokemon()?.id === pokemon.id;
        
        return `
            <div class="pokemon-item ${pokemon.rarity.toLowerCase()}" data-pokemon-id="${pokemon.id}">
                <div class="pokemon-header">
                    <div class="pokemon-avatar">${pokemon.emoji}</div>
                    <div class="pokemon-info">
                        <div class="pokemon-name">${pokemon.name}</div>
                        <div class="pokemon-level">等级 ${pokemon.level}</div>
                        <div class="pokemon-rarity ${pokemon.rarity.toLowerCase()}">${pokemon.getRarityDisplayName()}</div>
                    </div>
                </div>
                <div class="pokemon-stats">
                    <div class="stat-item">
                        <span class="stat-label">HP</span>
                        <span class="stat-value">${pokemon.currentHp}/${pokemon.maxHp}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">攻击</span>
                        <span class="stat-value">${pokemon.atk}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">防御</span>
                        <span class="stat-value">${pokemon.def}</span>
                    </div>
                </div>
                <div class="pokemon-actions">
                    <button class="btn btn-select" onclick="game.selectPokemon('${pokemon.id}')" ${isSelected ? 'disabled' : ''}>
                        ${isSelected ? '已选择' : '选择'}
                    </button>
                    <button class="btn btn-evolve" onclick="game.evolvePokemon('${pokemon.id}')" ${pokemon.canEvolve() ? '' : 'disabled'}>
                        进化
                    </button>
                </div>
            </div>
        `;
    }

    // 创建道具卡片
    createItemCard(itemName, count) {
        const itemInfo = this.inventorySystem.getItemInfo(itemName);
        if (!itemInfo) return '';
        
        return `
            <div class="item-card">
                <div class="item-icon">${itemInfo.icon}</div>
                <div class="item-name">${itemInfo.name}</div>
                <div class="item-count">数量: ${count}</div>
                <div class="item-description">${itemInfo.description}</div>
                <button class="item-use-btn" onclick="game.useItem('${itemName}')" ${count > 0 ? '' : 'disabled'}>
                    使用
                </button>
            </div>
        `;
    }

    // 创建图鉴条目
    createPokedexEntry(entry) {
        const discoveredClass = entry.isDiscovered ? 'discovered' : 'undiscovered';
        
        return `
            <div class="pokedex-entry ${entry.rarity.toLowerCase()} ${discoveredClass}">
                <div class="discovery-status ${entry.isDiscovered ? 'discovered' : 'undiscovered'}">
                    ${entry.isDiscovered ? '✓' : '?'}
                </div>
                <div class="pokedex-header">
                    <div class="pokedex-avatar">${entry.emoji}</div>
                    <div class="pokedex-info">
                        <div class="pokedex-name">${entry.name}</div>
                        <div class="pokedex-rarity ${entry.rarity.toLowerCase()}">${entry.rarity}</div>
                        <div class="pokedex-element ${entry.element.toLowerCase()}">${entry.element}</div>
                    </div>
                </div>
                <div class="pokedex-description">${entry.description}</div>
                ${entry.isDiscovered ? `
                    <div class="base-stats">
                        <h4>基础属性</h4>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">HP</span>
                                <span class="stat-value">${entry.baseStats.maxHp}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">攻击</span>
                                <span class="stat-value">${entry.baseStats.atk}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">防御</span>
                                <span class="stat-value">${entry.baseStats.def}</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // 创建地图卡片
    createMapCard(mapName) {
        const mapData = this.mapSystem.getMapInfo(mapName);
        const isUnlocked = this.mapSystem.isMapUnlocked(mapName);
        const isCurrent = this.player.getCurrentMap() === mapName;
        const unlockProgress = this.mapSystem.getMapUnlockProgress(mapName);
        
        return `
            <div class="map-card ${isCurrent ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}" 
                 onclick="game.changeMap('${mapName}')" data-map-name="${mapName}">
                <div class="map-icon">${mapData.icon}</div>
                <div class="map-name">${mapData.name}</div>
                <div class="map-description">${mapData.description}</div>
                <div class="map-requirements">
                    <h4>解锁条件</h4>
                    <p>等级 ${mapData.minPlayerLevel} | 推荐 ${mapData.levelRange}</p>
                </div>
                ${!isUnlocked && unlockProgress ? `
                    <div class="map-progress" style="background: conic-gradient(#3498db 0deg, #3498db ${unlockProgress.overall ? 360 : 0}deg, #ecf0f1 0deg)">
                        <div class="map-progress-text">${unlockProgress.overall ? '100%' : '0%'}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // 创建地图宠物项目
    createMapPokemonItem(pokemon) {
        return `
            <div class="map-pokemon-item ${pokemon.rarity.toLowerCase()}">
                <div class="map-pokemon-avatar">${pokemon.emoji}</div>
                <div class="map-pokemon-name">${pokemon.name}</div>
                <div class="map-pokemon-rarity ${pokemon.rarity.toLowerCase()}">${pokemon.rarity}</div>
                <div class="map-pokemon-stats">
                    <div class="map-stat-item">
                        <span class="map-stat-label">权重</span>
                        <span class="map-stat-value">${pokemon.weight}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 更新战斗日志
    updateBattleLog() {
        const logContent = document.getElementById('battle-log-content');
        if (logContent) {
            const logs = this.battleSystem.getBattleLog();
            logContent.innerHTML = logs.map(log => `
                <div class="log-entry ${log.type}">
                    <span class="log-time">[${log.timestamp}]</span>
                    <span class="log-message">${log.message}</span>
                </div>
            `).join('');
            
            // 滚动到底部
            logContent.scrollTop = logContent.scrollHeight;
        }
    }

    // 选择宠物
    selectPokemon(pokemonId) {
        const success = this.player.selectPokemon(pokemonId);
        if (success) {
            this.updateBattleUI();
            this.updateInventoryUI();
            this.uiManager.showNotification('宠物选择成功', 'success');
        }
    }

    // 进化宠物
    evolvePokemon(pokemonId) {
        const result = this.inventorySystem.evolvePokemon(pokemonId);
        if (result.success) {
            this.updateBattleUI();
            this.updateInventoryUI();
            this.uiManager.showNotification(result.message, 'success');
        } else {
            this.uiManager.showNotification(result.message, 'warning');
        }
    }

    // 使用道具
    useItem(itemName) {
        const result = this.inventorySystem.useItem(itemName);
        if (result.success) {
            this.updateBattleUI();
            this.updateInventoryUI();
            this.uiManager.showNotification(result.message, 'success');
        } else {
            this.uiManager.showNotification(result.message, 'warning');
        }
    }

    // 切换地图
    changeMap(mapName) {
        const result = this.mapSystem.changeMap(mapName);
        if (result.success) {
            this.updateMapUI();
            this.uiManager.showNotification(result.message, 'success');
        } else {
            this.uiManager.showNotification(result.message, 'warning');
        }
    }

    // 装备精灵球
    equipPokeball(pokeballName) {
        const success = this.player.equipPokeball(pokeballName);
        if (success) {
            this.updatePokeballEquipment();
            this.uiManager.showNotification(`已装备${pokeballName}`, 'success');
        } else {
            this.uiManager.showNotification(`没有${pokeballName}，无法装备`, 'warning');
        }
    }

    // 更新精灵球装备显示
    updatePokeballEquipment() {
        const pokeballSelector = document.getElementById('pokeball-selector');
        const pokeballCount = document.getElementById('equipped-pokeball-count');
        
        if (pokeballSelector) {
            // 更新选择器显示当前装备的精灵球
            pokeballSelector.value = this.player.getEquippedPokeball();
            
            // 更新选项显示数量
            const items = this.player.getAllItems();
            const options = pokeballSelector.options;
            
            for (let i = 0; i < options.length; i++) {
                const pokeballName = options[i].value;
                const count = items[pokeballName] || 0;
                const catchRate = this.player.getPokeballCatchRate(pokeballName);
                const percentage = Math.round(catchRate * 100);
                
                options[i].textContent = `${pokeballName} (${percentage}%) - ${count}个`;
                
                // 如果没有该精灵球，禁用选项
                if (count <= 0) {
                    options[i].disabled = true;
                } else {
                    options[i].disabled = false;
                }
            }
        }
        
        if (pokeballCount) {
            // 更新当前装备精灵球的数量
            const count = this.player.getEquippedPokeballCount();
            pokeballCount.textContent = count;
            
            // 根据数量改变颜色
            if (count <= 0) {
                pokeballCount.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            } else if (count <= 2) {
                pokeballCount.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
            } else {
                pokeballCount.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
            }
        }
    }

    // 页面隐藏时处理
    onPageHidden() {
        // 保存游戏
        this.storageManager.saveGame(this.player);
        console.log('页面隐藏，游戏已保存');
    }

    // 页面显示时处理
    onPageVisible() {
        // 更新UI
        this.uiManager.updateStatusBar(this.player);
        console.log('页面显示，UI已更新');
    }

    // 启动游戏循环
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.gameUpdate();
        }, this.updateInterval);
    }

    // 游戏更新
    gameUpdate() {
        // 更新UI
        this.uiManager.updateStatusBar(this.player);
        
        // 更新各个面板的UI（但不包括战斗日志，避免闪烁）
        this.updateBattleUIWithoutLog();
        this.updateInventoryUI();
        this.updatePokedexUI();
        this.updateMapUI();
        
        // 检查升级
        const levelInfo = this.player.getLevelInfo();
        if (levelInfo.canLevelUp) {
            this.uiManager.showNotification(`恭喜升级到 ${this.player.level} 级！`, 'success');
        }
    }

    // 获取游戏状态
    getGameStatus() {
        return {
            isInitialized: this.isInitialized,
            playerLevel: this.player.level,
            currentMap: this.player.getCurrentMap(),
            battleRunning: this.battleSystem.isBattleRunning(),
            pokemonCount: this.player.getAllPokemon().length,
            discoveredCount: this.player.getDiscoveredPokemonCount()
        };
    }

    // 重置游戏
    resetGame() {
        this.uiManager.showConfirmDialog('确定要重置游戏吗？这将删除所有进度！', () => {
            this.storageManager.deleteGame();
            location.reload();
        });
    }

    // 导出游戏数据
    exportGame() {
        const success = this.storageManager.exportGame(this.player);
        if (success) {
            this.uiManager.showNotification('游戏数据导出成功', 'success');
        } else {
            this.uiManager.showNotification('游戏数据导出失败', 'error');
        }
    }

    // 导入游戏数据
    importGame(file) {
        this.storageManager.importGame(file).then(player => {
            this.player = player;
            this.initializeUI();
            this.uiManager.showNotification('游戏数据导入成功', 'success');
        }).catch(error => {
            this.uiManager.showNotification('游戏数据导入失败: ' + error.message, 'error');
        });
    }

    // 保存游戏
    saveGame() {
        try {
            this.storageManager.saveGame(this.player);
            return true;
        } catch (error) {
            console.error('保存游戏失败:', error);
            throw error;
        }
    }

    // 加载游戏
    loadGame() {
        try {
            const savedPlayer = this.storageManager.loadGame();
            if (savedPlayer) {
                this.player = savedPlayer;
                // 重新初始化系统
                this.battleSystem = new BattleSystem(this.player);
                this.inventorySystem = new InventorySystem(this.player);
                this.pokedexSystem = new PokedexSystem(this.player);
                this.mapSystem = new MapSystem(this.player);
                
                // 更新UI
                this.updateBattleUI();
                this.updateInventoryUI();
                this.updatePokedexUI();
                this.updateMapUI();
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('加载游戏失败:', error);
            throw error;
        }
    }
}

// 全局游戏实例
let game;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', async () => {
    game = new IdlePokemonGame();
    await game.init();
});

// 导出游戏实例供其他脚本使用
window.game = game; 