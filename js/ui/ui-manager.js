// UI管理器
class UIManager {
    constructor() {
        this.currentPanel = 'battle';
        this.panels = {};
        this.initializePanels();
        this.bindEvents();
    }

    // 初始化面板
    initializePanels() {
        this.panels = {
            battle: document.getElementById('battle-panel'),
            inventory: document.getElementById('inventory-panel'),
            pokedex: document.getElementById('pokedex-panel'),
            map: document.getElementById('map-panel')
        };
    }

    // 绑定事件
    bindEvents() {
        // 菜单切换事件
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const panelName = e.currentTarget.dataset.panel;
                this.switchPanel(panelName);
            });
        });

        // 模态框关闭事件
        const modal = document.getElementById('modal');
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // 背包标签页切换
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    // 切换面板
    switchPanel(panelName) {
        if (!this.panels[panelName]) {
            console.error(`面板 ${panelName} 不存在`);
            return;
        }

        // 更新菜单状态
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-panel="${panelName}"]`).classList.add('active');

        // 隐藏所有面板
        Object.values(this.panels).forEach(panel => {
            panel.classList.remove('active');
        });

        // 显示目标面板
        this.panels[panelName].classList.add('active');
        this.currentPanel = panelName;

        // 触发面板切换事件
        this.onPanelSwitch(panelName);
    }

    // 切换标签页
    switchTab(tabName) {
        // 更新按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 隐藏所有标签内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // 显示目标标签内容
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    // 显示模态框
    showModal(content, title = '') {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        
        if (title) {
            modalBody.innerHTML = `<h3>${title}</h3>${content}`;
        } else {
            modalBody.innerHTML = content;
        }
        
        modal.style.display = 'block';
    }

    // 关闭模态框
    closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    // 更新状态栏
    updateStatusBar(player) {
        const stats = player.getStats();
        
        document.getElementById('gold').textContent = stats.gold;
        document.getElementById('pokeballs').textContent = stats.pokeballs;
        document.getElementById('player-level').textContent = stats.level;
    }

    // 显示通知
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        // 根据类型设置背景色
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
        }

        document.body.appendChild(notification);

        // 自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // 显示确认对话框
    showConfirmDialog(message, onConfirm, onCancel) {
        const content = `
            <div class="confirm-dialog">
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="btn btn-secondary" id="confirm-cancel">取消</button>
                    <button class="btn btn-primary" id="confirm-ok">确定</button>
                </div>
            </div>
        `;

        this.showModal(content, '确认');

        // 绑定按钮事件
        document.getElementById('confirm-ok').addEventListener('click', () => {
            this.closeModal();
            if (onConfirm) onConfirm();
        });

        document.getElementById('confirm-cancel').addEventListener('click', () => {
            this.closeModal();
            if (onCancel) onCancel();
        });
    }

    // 显示输入对话框
    showInputDialog(message, defaultValue = '', onConfirm, onCancel) {
        const content = `
            <div class="input-dialog">
                <p>${message}</p>
                <input type="text" id="input-field" value="${defaultValue}" placeholder="请输入...">
                <div class="input-buttons">
                    <button class="btn btn-secondary" id="input-cancel">取消</button>
                    <button class="btn btn-primary" id="input-ok">确定</button>
                </div>
            </div>
        `;

        this.showModal(content, '输入');

        // 聚焦输入框
        setTimeout(() => {
            document.getElementById('input-field').focus();
        }, 100);

        // 绑定按钮事件
        document.getElementById('input-ok').addEventListener('click', () => {
            const value = document.getElementById('input-field').value;
            this.closeModal();
            if (onConfirm) onConfirm(value);
        });

        document.getElementById('input-cancel').addEventListener('click', () => {
            this.closeModal();
            if (onCancel) onCancel();
        });

        // 回车确认
        document.getElementById('input-field').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const value = e.target.value;
                this.closeModal();
                if (onConfirm) onConfirm(value);
            }
        });
    }

    // 显示加载动画
    showLoading(message = '加载中...') {
        const loading = document.createElement('div');
        loading.id = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        document.body.appendChild(loading);
    }

    // 隐藏加载动画
    hideLoading() {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            loading.remove();
        }
    }

    // 面板切换回调
    onPanelSwitch(panelName) {
        // 这里可以添加面板切换时的逻辑
        console.log(`切换到面板: ${panelName}`);
    }

    // 获取当前面板
    getCurrentPanel() {
        return this.currentPanel;
    }

    // 检查面板是否激活
    isPanelActive(panelName) {
        return this.currentPanel === panelName;
    }

    // 刷新当前面板
    refreshCurrentPanel() {
        // 这里可以添加刷新当前面板的逻辑
        console.log(`刷新面板: ${this.currentPanel}`);
    }

    // 添加CSS动画
    addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 10px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-content {
                text-align: center;
                color: white;
            }
            
            .confirm-dialog, .input-dialog {
                text-align: center;
            }
            
            .confirm-buttons, .input-buttons {
                margin-top: 20px;
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            
            #input-field {
                width: 100%;
                padding: 10px;
                border: 2px solid #ecf0f1;
                border-radius: 5px;
                margin: 10px 0;
                font-size: 14px;
            }
            
            #input-field:focus {
                outline: none;
                border-color: #3498db;
            }
        `;
        document.head.appendChild(style);
    }

    // 初始化
    init() {
        this.addAnimations();
        console.log('UI管理器已初始化');
    }
} 