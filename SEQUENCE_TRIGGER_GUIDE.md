# 🔧 连续按键触发魔术模式

## 🎯 新增功能

**连续按5次+** → 进入魔术模式  
**连续按5次-** → 退出魔术模式

## 🔧 技术实现

### 📋 **按键序列检测**
```javascript
// 新增属性
this.keySequence = [];              // 记录按键序列
this.keySequenceTimeout = null;      // 序列超时器
this.SEQUENCE_LENGTH = 5;             // 需要5次按键
this.SEQUENCE_TIMEOUT = 1000;        // 1秒内必须完成
```

### 🎮 **检测逻辑**
```javascript
detectKeySequence(operator) {
    // 添加按键到序列
    this.keySequence.push(operator);
    
    // 检查最后5次按键
    if (this.keySequence.length >= 5) {
        const lastFiveKeys = this.keySequence.slice(-5);
        const isAllPlus = lastFiveKeys.every(key => key === '+');
        const isAllMinus = lastFiveKeys.every(key => key === '-');
        
        if (isAllPlus && !this.isMagicMode) {
            // 连续5次+：进入魔术模式
            this.startAppleMagicMode();
            this.keySequence = [];
        } else if (isAllMinus && this.isMagicMode) {
            // 连续5次-：退出魔术模式
            this.exitMagicMode();
            this.keySequence = [];
        }
    }
    
    // 1秒后自动重置序列
    this.keySequenceTimeout = setTimeout(() => {
        this.keySequence = [];
    }, 1000);
}
```

## 🎯 使用方法

### 🎭 **进入魔术模式**
1. 在计算器上快速连续按 **5次+号**
2. 1秒内必须完成所有5次按键
3. 成功后看到控制台：`🎭 连续5次+，进入魔术模式`
4. 开始魔术流程：A→+→B→=→+→盲按C→=

### 🚪 **退出魔术模式**
1. 在魔术模式下快速连续按 **5次-号**
2. 1秒内必须完成所有5次按键
3. 成功后看到提示："魔术模式已退出"
4. 控制台显示：`🚪 连续5次-，退出魔术模式`

## 🔍 特性说明

### ⏱️ **时间窗口**
- **1秒内**必须完成5次按键
- 超时自动重置序列
- 确保不会误触发

### 🔒 **安全性**
- **正常使用**：不会意外触发
- **快速连击**：才能触发模式切换
- **即时反馈**：控制台显示触发状态

### 📱 **iPhone适配**
- 完全兼容触摸操作
- 保持静态UI外观
- 无任何视觉提示

## 🎪 操作示例

### 进入魔术模式：
```
快速连击：+ + + + + （1秒内）
结果：进入魔术模式，可开始A→+→B→=→+→盲按C→=流程
```

### 退出魔术模式：
```
快速连击：- - - - - （1秒内）
结果：退出魔术模式，回到普通计算器
```

## 🔍 调试信息

### 📊 **控制台输出**
- `🔑 按键序列: [+,+,+,+,+]`
- `🎭 连续5次+，进入魔术模式`
- `🚪 连续5次-，退出魔术模式`
- `🔑 按键序列超时，重置`

### 🧪 **测试命令**
```javascript
// 查看当前按键序列
console.log(window.appleMagicCalculatorFixed.keySequence);

// 查看魔术模式状态
console.log(window.appleMagicCalculatorFixed.isMagicMode);

// 手动重置序列
window.appleMagicCalculatorFixed.keySequence = [];
```

---

## 🎉 **现在你可以像特工一样操作！**

**快速连击5次+号进入魔术模式，快速连击5次-号退出，完全隐藏的秘密开关！** 🕵️✨

**普通用户永远不会发现这个隐藏功能！** 🎩