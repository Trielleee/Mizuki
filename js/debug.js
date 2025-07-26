// Debug工具类
class GameDebugger {
    constructor() {
        this.isDebugMode = false;
        this.debugPanel = null;
        this.init();
    }

    // 初始化debug工具
    init() {
        // 创建debug面板
        this.createDebugPanel();
        
        // 添加键盘快捷键
        this.addKeyboardShortcuts();
        
        // 添加调试按钮到游戏界面
        this.addDebugButton();
    }

    // 创建debug面板
    createDebugPanel() {
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'debug-panel';
        this.debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1000;
            max-width: 300px;
            display: none;
        `;

        this.debugPanel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #00ff00;">🔧 DEBUG 工具</div>
            
            <div style="margin-bottom: 15px;">
                <div style="margin-bottom: 5px;">💰 金币操作:</div>
                <button onclick="gameDebugger.addCoins(10)" style="margin: 2px; padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">+10</button>
                <button onclick="gameDebugger.addCoins(100)" style="margin: 2px; padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">+100</button>
                <button onclick="gameDebugger.addCoins(1000)" style="margin: 2px; padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">+1000</button>
                <button onclick="gameDebugger.setCoins(0)" style="margin: 2px; padding: 5px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">重置</button>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="margin-bottom: 5px;">⚡ 点击力量:</div>
                <button onclick="gameDebugger.setClickPower(1)" style="margin: 2px; padding: 5px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">重置</button>
                <button onclick="gameDebugger.setClickPower(10)" style="margin: 2px; padding: 5px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">设为10</button>
                <button onclick="gameDebugger.setClickPower(100)" style="margin: 2px; padding: 5px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">设为100</button>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="margin-bottom: 5px;">🤖 自动点击器:</div>
                <button onclick="gameDebugger.setAutoClickers(0)" style="margin: 2px; padding: 5px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer;">重置</button>
                <button onclick="gameDebugger.setAutoClickers(10)" style="margin: 2px; padding: 5px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer;">设为10</button>
                <button onclick="gameDebugger.setAutoClickers(100)" style="margin: 2px; padding: 5px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer;">设为100</button>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="margin-bottom: 5px;">⛏️ 矿场:</div>
                <button onclick="gameDebugger.setMines(0)" style="margin: 2px; padding: 5px; background: #9C27B0; color: white; border: none; border-radius: 3px; cursor: pointer;">重置</button>
                <button onclick="gameDebugger.setMines(10)" style="margin: 2px; padding: 5px; background: #9C27B0; color: white; border: none; border-radius: 3px; cursor: pointer;">设为10</button>
                <button onclick="gameDebugger.setMines(100)" style="margin: 2px; padding: 5px; background: #9C27B0; color: white; border: none; border-radius: 3px; cursor: pointer;">设为100</button>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="margin-bottom: 5px;">🎮 游戏控制:</div>
                <button onclick="gameDebugger.resetGame()" style="margin: 2px; padding: 5px; background: #607D8B; color: white; border: none; border-radius: 3px; cursor: pointer;">重置游戏</button>
                <button onclick="gameDebugger.maxUpgrades()" style="margin: 2px; padding: 5px; background: #607D8B; color: white; border: none; border-radius: 3px; cursor: pointer;">最大升级</button>
                <button onclick="gameDebugger.toggleGameSpeed()" style="margin: 2px; padding: 5px; background: #607D8B; color: white; border: none; border-radius: 3px; cursor: pointer;">加速游戏</button>
            </div>

            <div style="margin-bottom: 10px;">
                <div style="margin-bottom: 5px;">📊 状态信息:</div>
                <div id="debug-info" style="font-size: 10px; color: #ccc;"></div>
            </div>

            <div style="text-align: center; margin-top: 10px;">
                <button onclick="gameDebugger.toggleDebug()" style="padding: 5px 10px; background: #ff5722; color: white; border: none; border-radius: 3px; cursor: pointer;">关闭调试</button>
            </div>
        `;

        document.body.appendChild(this.debugPanel);
    }

    // 添加键盘快捷键
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + D 切换调试模式
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleDebug();
            }
            
            // 数字键快速操作
            if (this.isDebugMode) {
                switch(e.key) {
                    case '1':
                        this.addCoins(10);
                        break;
                    case '2':
                        this.addCoins(100);
                        break;
                    case '3':
                        this.addCoins(1000);
                        break;
                    case 'r':
                        this.resetGame();
                        break;
                    case 'm':
                        this.maxUpgrades();
                        break;
                }
            }
        });
    }

    // 添加调试按钮到游戏界面
    addDebugButton() {
        const debugButton = document.createElement('button');
        debugButton.innerHTML = '🔧 Debug';
        debugButton.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 8px 12px;
            background: #ff5722;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            z-index: 999;
        `;
        debugButton.onclick = () => this.toggleDebug();
        document.body.appendChild(debugButton);
    }

    // 切换调试模式
    toggleDebug() {
        this.isDebugMode = !this.isDebugMode;
        this.debugPanel.style.display = this.isDebugMode ? 'block' : 'none';
        
        if (this.isDebugMode) {
            this.updateDebugInfo();
            // 定期更新调试信息
            this.debugInfoInterval = setInterval(() => this.updateDebugInfo(), 1000);
        } else {
            if (this.debugInfoInterval) {
                clearInterval(this.debugInfoInterval);
            }
        }
    }

    // 更新调试信息
    updateDebugInfo() {
        const infoDiv = document.getElementById('debug-info');
        if (infoDiv) {
            infoDiv.innerHTML = `
                金币: ${Math.floor(gameState.coins)}<br>
                每秒: ${gameState.coinsPerSecond.toFixed(1)}<br>
                点击力量: ${gameState.clickPower}<br>
                自动点击器: ${gameState.autoClickers}<br>
                矿场: ${gameState.mines}
            `;
        }
    }

    // 增加金币
    addCoins(amount) {
        gameState.coins += amount;
        updateDisplay();
        this.showNotification(`+${amount} 金币`);
    }

    // 设置金币
    setCoins(amount) {
        gameState.coins = amount;
        updateDisplay();
        this.showNotification(`金币设为 ${amount}`);
    }

    // 设置点击力量
    setClickPower(amount) {
        gameState.clickPower = amount;
        updateDisplay();
        this.showNotification(`点击力量设为 ${amount}`);
    }

    // 设置自动点击器
    setAutoClickers(amount) {
        gameState.autoClickers = amount;
        updateDisplay();
        this.showNotification(`自动点击器设为 ${amount}`);
    }

    // 设置矿场
    setMines(amount) {
        gameState.mines = amount;
        updateDisplay();
        this.showNotification(`矿场设为 ${amount}`);
    }

    // 重置游戏
    resetGame() {
        gameState = {
            coins: 0,
            coinsPerSecond: 0,
            clickPower: 1,
            autoClickers: 0,
            mines: 0,
            autoClickerCost: 10,
            mineCost: 50,
            clickPowerCost: 25
        };
        updateDisplay();
        this.showNotification('游戏已重置');
    }

    // 最大升级
    maxUpgrades() {
        gameState.coins = 999999;
        gameState.clickPower = 1000;
        gameState.autoClickers = 100;
        gameState.mines = 100;
        updateDisplay();
        this.showNotification('已获得最大升级');
    }

    // 游戏速度控制
    toggleGameSpeed() {
        if (window.gameSpeedMultiplier) {
            window.gameSpeedMultiplier = 1;
            this.showNotification('游戏速度恢复正常');
        } else {
            window.gameSpeedMultiplier = 10;
            this.showNotification('游戏速度提升10倍');
        }
    }

    // 显示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1001;
            font-size: 14px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}

// 创建全局debugger实例
let gameDebugger;
document.addEventListener('DOMContentLoaded', () => {
    gameDebugger = new GameDebugger();
}); 