// 宠物类
class Pokemon {
    constructor(templateName, level = 1) {
        const template = POKEMON_TEMPLATES[templateName];
        if (!template) {
            throw new Error(`Unknown pokemon template: ${templateName}`);
        }

        this.id = this.generateId();
        this.name = template.name;
        this.level = level;
        this.exp = 0;
        this.rarity = template.rarity;
        this.element = template.element;
        this.evolveLevel = template.evolveLevel;
        this.nextForm = template.nextForm;
        this.catchRate = template.catchRate;
        this.isPlayerOwned = false;
        this.description = template.description;
        this.emoji = template.emoji;

        // 计算当前等级的基础属性
        this.calculateStats(template.baseStats);
        
        // 设置当前HP为满血
        this.currentHp = this.maxHp;
    }

    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 计算属性值
    calculateStats(baseStats) {
        const rarityModifier = RARITY_MODIFIERS[this.rarity].statGrowth;
        const levelMultiplier = 1 + (this.level - 1) * 0.1;

        this.maxHp = Math.floor(baseStats.maxHp * rarityModifier * levelMultiplier);
        this.atk = Math.floor(baseStats.atk * rarityModifier * levelMultiplier);
        this.def = Math.floor(baseStats.def * rarityModifier * levelMultiplier);
    }

    // 获得经验值
    gainExp(expAmount) {
        this.exp += expAmount;
        
        // 检查是否可以升级
        while (this.canLevelUp()) {
            this.levelUp();
        }
    }

    // 检查是否可以升级
    canLevelUp() {
        const requiredExp = this.getRequiredExp();
        return this.exp >= requiredExp && this.level < 100;
    }

    // 升级
    levelUp() {
        if (this.level >= 100) return false;

        this.level++;
        this.exp -= this.getRequiredExp();
        
        // 重新计算属性
        const template = POKEMON_TEMPLATES[this.name];
        this.calculateStats(template.baseStats);
        
        // 升级时恢复满血
        this.currentHp = this.maxHp;

        // 检查是否可以进化
        if (this.canEvolve()) {
            return this.evolve();
        }

        return true;
    }

    // 获取升级所需经验
    getRequiredExp() {
        return this.level * 10;
    }

    // 检查是否可以进化
    canEvolve() {
        return this.evolveLevel && this.level >= this.evolveLevel && this.nextForm;
    }

    // 进化
    evolve() {
        if (!this.canEvolve()) return false;

        const oldName = this.name;
        this.name = this.nextForm;
        
        // 获取新的模板
        const newTemplate = POKEMON_TEMPLATES[this.name];
        if (!newTemplate) return false;

        // 更新属性
        this.rarity = newTemplate.rarity;
        this.element = newTemplate.element;
        this.evolveLevel = newTemplate.evolveLevel;
        this.nextForm = newTemplate.nextForm;
        this.catchRate = newTemplate.catchRate;
        this.description = newTemplate.description;
        this.emoji = newTemplate.emoji;

        // 重新计算属性
        this.calculateStats(newTemplate.baseStats);
        this.currentHp = this.maxHp;

        return true;
    }

    // 受到伤害
    takeDamage(damage) {
        // 直接使用传入的伤害值，因为伤害计算已经在 calculateDamage 中处理了
        const actualDamage = Math.max(1, damage);
        this.currentHp = Math.max(0, this.currentHp - actualDamage);
        return actualDamage;
    }

    // 恢复生命值
    heal(amount) {
        this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    }

    // 完全恢复
    fullHeal() {
        this.currentHp = this.maxHp;
    }

    // 检查是否存活
    isAlive() {
        return this.currentHp > 0;
    }

    // 获取HP百分比
    getHpPercentage() {
        return (this.currentHp / this.maxHp) * 100;
    }

    // 获取经验百分比
    getExpPercentage() {
        const requiredExp = this.getRequiredExp();
        return (this.exp / requiredExp) * 100;
    }

    // 计算战斗伤害
    calculateDamage(target, effectiveness = 1.0) {
        const baseDamage = this.atk * effectiveness;
        // 防御力减少伤害的百分比，而不是直接减去
        const damageReduction = target.def / (target.def + 50); // 防御力越高，减伤越多，但有上限
        const finalDamage = Math.max(1, baseDamage * (1 - damageReduction));
        return Math.floor(finalDamage);
    }

    // 尝试捕捉
    attemptCatch() {
        const finalCatchRate = this.catchRate * RARITY_MODIFIERS[this.rarity].catchRate;
        return Math.random() < finalCatchRate;
    }

    // 获取显示名称
    getDisplayName() {
        return `${this.emoji} ${this.name}`;
    }

    // 获取稀有度显示名称
    getRarityDisplayName() {
        const rarityNames = {
            "Common": "普通",
            "Rare": "稀有",
            "Epic": "史诗",
            "Legendary": "传说"
        };
        return rarityNames[this.rarity] || this.rarity;
    }

    // 获取属性显示名称
    getElementDisplayName() {
        const elementNames = {
            "Fire": "火",
            "Water": "水",
            "Grass": "草",
            "Electric": "电",
            "Normal": "普通"
        };
        return elementNames[this.element] || this.element;
    }

    // 获取属性相克倍率
    getEffectiveness(opponentElement) {
        const effectiveness = ELEMENT_EFFECTIVENESS[this.element];
        return effectiveness ? effectiveness[opponentElement] || 1.0 : 1.0;
    }

    // 获取进化信息
    getEvolutionInfo() {
        if (!this.evolveLevel) {
            return "无法进化";
        }
        
        if (this.level >= this.evolveLevel) {
            return `可以进化为 ${this.nextForm}`;
        }
        
        return `等级 ${this.evolveLevel} 时进化为 ${this.nextForm}`;
    }

    // 获取状态信息
    getStatusInfo() {
        const hpStatus = this.getHpPercentage() > 50 ? "健康" : 
                        this.getHpPercentage() > 25 ? "受伤" : "濒死";
        
        return {
            hp: this.currentHp,
            maxHp: this.maxHp,
            hpPercentage: this.getHpPercentage(),
            hpStatus: hpStatus,
            exp: this.exp,
            requiredExp: this.getRequiredExp(),
            expPercentage: this.getExpPercentage(),
            canLevelUp: this.canLevelUp(),
            canEvolve: this.canEvolve()
        };
    }

    // 克隆宠物
    clone() {
        const cloned = new Pokemon(this.name, this.level);
        cloned.exp = this.exp;
        cloned.currentHp = this.currentHp;
        cloned.isPlayerOwned = this.isPlayerOwned;
        return cloned;
    }

    // 转换为JSON
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            level: this.level,
            exp: this.exp,
            rarity: this.rarity,
            element: this.element,
            evolveLevel: this.evolveLevel,
            nextForm: this.nextForm,
            catchRate: this.catchRate,
            isPlayerOwned: this.isPlayerOwned,
            description: this.description,
            emoji: this.emoji,
            maxHp: this.maxHp,
            currentHp: this.currentHp,
            atk: this.atk,
            def: this.def
        };
    }

    // 从JSON恢复
    static fromJSON(data) {
        const pokemon = new Pokemon(data.name, data.level);
        pokemon.id = data.id;
        pokemon.exp = data.exp;
        pokemon.rarity = data.rarity;
        pokemon.element = data.element;
        pokemon.evolveLevel = data.evolveLevel;
        pokemon.nextForm = data.nextForm;
        pokemon.catchRate = data.catchRate;
        pokemon.isPlayerOwned = data.isPlayerOwned;
        pokemon.description = data.description;
        pokemon.emoji = data.emoji;
        pokemon.maxHp = data.maxHp;
        pokemon.currentHp = data.currentHp;
        pokemon.atk = data.atk;
        pokemon.def = data.def;
        return pokemon;
    }
} 