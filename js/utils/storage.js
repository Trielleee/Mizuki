// 存储工具类
class StorageManager {
    constructor() {
        this.storageKey = 'idlePokemonGame';
        this.autoSaveInterval = null;
        this.autoSaveEnabled = true;
        this.autoSaveTime = 30000; // 30秒自动保存
    }

    // 保存游戏数据
    saveGame(player) {
        try {
            const gameData = {
                player: player.toJSON(),
                timestamp: Date.now(),
                version: '1.0.0'
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(gameData));
            console.log('游戏数据已保存');
            return true;
        } catch (error) {
            console.error('保存游戏数据失败:', error);
            return false;
        }
    }

    // 加载游戏数据
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                console.log('没有找到保存的游戏数据');
                return null;
            }

            const gameData = JSON.parse(savedData);
            
            // 检查版本兼容性
            if (!gameData.version || gameData.version !== '1.0.0') {
                console.warn('游戏数据版本不匹配，使用默认数据');
                return null;
            }

            // 恢复玩家数据
            const player = Player.fromJSON(gameData.player);
            console.log('游戏数据已加载');
            return player;
        } catch (error) {
            console.error('加载游戏数据失败:', error);
            return null;
        }
    }

    // 删除游戏数据
    deleteGame() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('游戏数据已删除');
            return true;
        } catch (error) {
            console.error('删除游戏数据失败:', error);
            return false;
        }
    }

    // 检查是否有保存的数据
    hasSavedGame() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    // 获取保存时间
    getSaveTime() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return null;

            const gameData = JSON.parse(savedData);
            return gameData.timestamp;
        } catch (error) {
            console.error('获取保存时间失败:', error);
            return null;
        }
    }

    // 获取保存时间字符串
    getSaveTimeString() {
        const timestamp = this.getSaveTime();
        if (!timestamp) return '无';

        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN');
    }

    // 开始自动保存
    startAutoSave(player) {
        if (!this.autoSaveEnabled) return;

        this.stopAutoSave();
        
        this.autoSaveInterval = setInterval(() => {
            this.saveGame(player);
        }, this.autoSaveTime);
        
        console.log('自动保存已启动');
    }

    // 停止自动保存
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
            console.log('自动保存已停止');
        }
    }

    // 设置自动保存
    setAutoSave(enabled, time = null) {
        this.autoSaveEnabled = enabled;
        if (time !== null) {
            this.autoSaveTime = time;
        }
    }

    // 导出游戏数据
    exportGame(player) {
        try {
            const gameData = {
                player: player.toJSON(),
                timestamp: Date.now(),
                version: '1.0.0'
            };
            
            const dataStr = JSON.stringify(gameData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `idlePokemon_${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            
            console.log('游戏数据已导出');
            return true;
        } catch (error) {
            console.error('导出游戏数据失败:', error);
            return false;
        }
    }

    // 导入游戏数据
    importGame(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const gameData = JSON.parse(event.target.result);
                    
                    // 检查版本兼容性
                    if (!gameData.version || gameData.version !== '1.0.0') {
                        reject(new Error('游戏数据版本不兼容'));
                        return;
                    }
                    
                    // 恢复玩家数据
                    const player = Player.fromJSON(gameData.player);
                    console.log('游戏数据已导入');
                    resolve(player);
                } catch (error) {
                    console.error('导入游戏数据失败:', error);
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('读取文件失败'));
            };
            
            reader.readAsText(file);
        });
    }

    // 获取存储统计信息
    getStorageStats() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return null;

            const gameData = JSON.parse(savedData);
            const dataSize = new Blob([savedData]).size;
            
            return {
                hasData: true,
                dataSize: dataSize,
                dataSizeKB: (dataSize / 1024).toFixed(2),
                saveTime: gameData.timestamp,
                saveTimeString: new Date(gameData.timestamp).toLocaleString('zh-CN'),
                version: gameData.version
            };
        } catch (error) {
            console.error('获取存储统计失败:', error);
            return null;
        }
    }

    // 清理过期数据
    cleanupOldData() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return;

            const gameData = JSON.parse(savedData);
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000; // 24小时
            
            // 如果数据超过30天，询问是否清理
            if (now - gameData.timestamp > 30 * oneDay) {
                console.warn('发现30天前的游戏数据');
                // 这里可以添加用户确认逻辑
            }
        } catch (error) {
            console.error('清理过期数据失败:', error);
        }
    }

    // 备份游戏数据
    backupGame(player) {
        try {
            const backupKey = `${this.storageKey}_backup_${Date.now()}`;
            const gameData = {
                player: player.toJSON(),
                timestamp: Date.now(),
                version: '1.0.0'
            };
            
            localStorage.setItem(backupKey, JSON.stringify(gameData));
            console.log('游戏数据已备份');
            return true;
        } catch (error) {
            console.error('备份游戏数据失败:', error);
            return false;
        }
    }

    // 恢复备份数据
    restoreBackup(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                console.log('备份数据不存在');
                return null;
            }

            const gameData = JSON.parse(backupData);
            
            // 检查版本兼容性
            if (!gameData.version || gameData.version !== '1.0.0') {
                console.warn('备份数据版本不匹配');
                return null;
            }

            // 恢复玩家数据
            const player = Player.fromJSON(gameData.player);
            console.log('备份数据已恢复');
            return player;
        } catch (error) {
            console.error('恢复备份数据失败:', error);
            return null;
        }
    }

    // 获取所有备份
    getAllBackups() {
        const backups = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${this.storageKey}_backup_`)) {
                try {
                    const backupData = localStorage.getItem(key);
                    const gameData = JSON.parse(backupData);
                    
                    backups.push({
                        key: key,
                        timestamp: gameData.timestamp,
                        timeString: new Date(gameData.timestamp).toLocaleString('zh-CN'),
                        version: gameData.version
                    });
                } catch (error) {
                    console.error('解析备份数据失败:', error);
                }
            }
        }
        
        return backups.sort((a, b) => b.timestamp - a.timestamp);
    }
} 