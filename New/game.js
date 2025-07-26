// 游戏状态
let gameState = {
    coins: 0,
    coinsPerSecond: 0,
    clickPower: 1,
    autoClickers: 0,
    mines: 0,
    autoClickerCost: 10,
    mineCost: 50,
    clickPowerCost: 25
};

// 手动点击
function manualClick() {
    gameState.coins += gameState.clickPower;
    updateDisplay();
}

// 购买自动点击器
function buyAutoClicker() {
    if (gameState.coins >= gameState.autoClickerCost) {
        gameState.coins -= gameState.autoClickerCost;
        gameState.autoClickers++;
        gameState.autoClickerCost = Math.floor(gameState.autoClickerCost * 1.15);
        updateDisplay();
    }
}

// 购买矿场
function buyMine() {
    if (gameState.coins >= gameState.mineCost) {
        gameState.coins -= gameState.mineCost;
        gameState.mines++;
        gameState.mineCost = Math.floor(gameState.mineCost * 1.2);
        updateDisplay();
    }
}

// 购买点击力量
function buyClickPower() {
    if (gameState.coins >= gameState.clickPowerCost) {
        gameState.coins -= gameState.clickPowerCost;
        gameState.clickPower++;
        gameState.clickPowerCost = Math.floor(gameState.clickPowerCost * 1.1);
        updateDisplay();
    }
}

// 更新显示
function updateDisplay() {
    document.getElementById('coins').textContent = Math.floor(gameState.coins);
    document.getElementById('coinsPerSecond').textContent = gameState.coinsPerSecond.toFixed(1);
    document.getElementById('clickPower').textContent = gameState.clickPower;
    
    // 更新成本显示
    document.getElementById('autoClickerCost').textContent = gameState.autoClickerCost;
    document.getElementById('mineCost').textContent = gameState.mineCost;
    document.getElementById('clickPowerCost').textContent = gameState.clickPowerCost;
    
    // 更新按钮状态
    document.getElementById('autoClickerBtn').disabled = gameState.coins < gameState.autoClickerCost;
    document.getElementById('mineBtn').disabled = gameState.coins < gameState.mineCost;
    document.getElementById('clickPowerBtn').disabled = gameState.coins < gameState.clickPowerCost;
}

// 游戏循环
function gameLoop() {
    // 计算每秒金币收入
    gameState.coinsPerSecond = gameState.autoClickers * gameState.clickPower + gameState.mines * 2;
    
    // 自动生产
    const speedMultiplier = window.gameSpeedMultiplier || 1;
    gameState.coins += (gameState.coinsPerSecond / 10) * speedMultiplier; // 每0.1秒更新一次
    
    updateDisplay();
}

// 启动游戏
function initGame() {
    setInterval(gameLoop, 100); // 每0.1秒更新一次
    updateDisplay();
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame); 