// 隐藏式魔术计算器 - 全程正常UI，后台魔术逻辑
class HiddenMagicCalculator {
    constructor() {
        this.isMagicMode = false;
        this.magicStep = 0;
        this.audienceNumbers = {
            A: '',
            B: '',
            C: ''
        };
        this.calibrationNumber = '';
        this.startTime = null;
        
        // 保持与原计算器的兼容
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.waitingForNewValue = false;
        
        // DOM元素引用
        this.elements = {
            mainDisplay: document.getElementById('main-display'),
            operationDisplay: document.getElementById('operation-display'),
            numberButtons: document.querySelectorAll('.number-buttons .btn'),
            operatorButtons: document.querySelectorAll('.operator-buttons .operator'),
            clearButton: document.getElementById('clear'),
            equalsButton: document.getElementById('equals')
        };
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // 双击启动魔术模式（隐藏）
        let lastClickTime = 0;
        document.addEventListener('click', (e) => {
            const isBlankArea = (
                e.target === document.body || 
                e.target.id === 'app' ||
                e.target.id === 'header' ||
                e.target.classList.contains('subtitle') ||
                e.target.tagName === 'H1' ||
                e.target.closest('#header')
            );
            
            if (isBlankArea) {
                const currentTime = Date.now();
                if (currentTime - lastClickTime < 300) {
                    this.startHiddenMagicMode();
                }
                lastClickTime = currentTime;
            }
        });
        
        // 数字按钮事件 - 正常计算器行为 + 魔术逻辑
        this.elements.numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleNumberWithMagic(button.dataset.value);
            });
        });
        
        // 运算符按钮事件
        this.elements.operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperatorWithMagic(button.dataset.value);
            });
        });
        
        // 清除和等号按钮
        this.elements.clearButton.addEventListener('click', () => {
            this.clearWithMagic();
        });
        
        this.elements.equalsButton.addEventListener('click', () => {
            this.calculateWithMagic();
        });
        
        // 键盘支持
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardWithMagic(e);
        });
        
        // 空格键备用触发
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isMagicMode) {
                e.preventDefault();
                this.startHiddenMagicMode();
            }
        });
    }
    
    // 启动隐藏魔术模式
    startHiddenMagicMode() {
        console.log('🎭 启动隐藏魔术模式');
        
        if (this.isMagicMode) return;
        
        this.isMagicMode = true;
        this.magicStep = 1;
        this.startTime = Date.now();
        
        // 添加微妙的视觉提示
        this.addMagicIndicator();
        
        // 显示魔术提示（可选）
        this.showMagicHint('请观众A输入任意6位数字...');
    }
    
    // 添加魔术指示器（微妙）
    addMagicIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'magic-indicator';
        indicator.innerHTML = '✨';
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 16px;
            opacity: 0.3;
            animation: magicPulse 2s ease-in-out infinite;
            pointer-events: none;
            z-index: 10;
        `;
        
        document.querySelector('.calculator').appendChild(indicator);
        
        // 添加CSS动画
        if (!document.querySelector('#magic-indicator-style')) {
            const style = document.createElement('style');
            style.id = 'magic-indicator-style';
            style.textContent = `
                @keyframes magicPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 显示魔术提示
    showMagicHint(message) {
        // 创建临时提示
        const hint = document.createElement('div');
        hint.className = 'magic-hint';
        hint.textContent = message;
        hint.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 1000;
            animation: hintSlideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(hint);
        
        // 3秒后自动消失
        setTimeout(() => {
            hint.style.animation = 'hintSlideOut 0.3s ease-out';
            setTimeout(() => hint.remove(), 300);
        }, 3000);
        
        // 添加CSS动画
        if (!document.querySelector('#magic-hint-style')) {
            const style = document.createElement('style');
            style.id = 'magic-hint-style';
            style.textContent = `
                @keyframes hintSlideIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes hintSlideOut {
                    from { opacity: 1; transform: translateX(-50%) translateY(0); }
                    to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 处理数字输入（带魔术逻辑）
    handleNumberWithMagic(number) {
        if (!this.isMagicMode) {
            // 正常计算器行为
            this.handleNormalNumber(number);
            return;
        }
        
        // 魔术模式下的数字输入
        if (this.waitingForNewValue) {
            this.currentValue = number;
            this.waitingForNewValue = false;
        } else {
            this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
        }
        
        this.updateDisplay();
        this.animateButton(event.target);
        
        // 检查是否完成6位数字输入
        if (this.currentValue.length === 6 && this.magicStep <= 2) {
            this.completeMagicStep();
        }
    }
    
    // 处理运算符输入（带魔术逻辑）
    handleOperatorWithMagic(operator) {
        if (!this.isMagicMode) {
            // 正常计算器行为
            this.handleNormalOperator(operator);
            return;
        }
        
        // 魔术模式下，运算符触发步骤完成
        if (this.magicStep === 1 && this.audienceNumbers.A) {
            this.audienceNumbers.B = this.currentValue;
            this.magicStep = 2;
            this.showMagicHint('请观众C闭上眼睛，在计算器上随意点击...');
            this.prepareBlindInput();
        } else if (this.magicStep === 2 && this.audienceNumbers.B) {
            this.audienceNumbers.C = this.currentValue;
            this.magicStep = 3;
            this.performMagicCalculation();
        }
        
        // 继续正常计算器行为
        this.handleNormalOperator(operator);
    }
    
    // 完成魔术步骤
    completeMagicStep() {
        if (this.magicStep === 1) {
            this.audienceNumbers.A = this.currentValue;
            this.showMagicHint('观众A的数字已记录，请输入运算符...');
        } else if (this.magicStep === 2) {
            this.audienceNumbers.B = this.currentValue;
            this.showMagicHint('观众B的数字已记录，准备观众C的盲点输入...');
            this.prepareBlindInput();
        }
    }
    
    // 准备盲点输入
    prepareBlindInput() {
        console.log('🙏 准备盲点输入');
        
        // 计算需要的校准数字
        this.calculateCalibrationNumber();
        
        // 添加盲点输入效果
        this.addBlindInputEffect();
        
        // 模拟盲点输入
        setTimeout(() => {
            this.simulateBlindTyping();
        }, 2000);
    }
    
    // 添加盲点输入效果
    addBlindInputEffect() {
        const calculator = document.querySelector('.calculator');
        calculator.style.animation = 'blindInputGlow 2s ease-in-out';
        
        // 添加CSS动画
        if (!document.querySelector('#blind-input-style')) {
            const style = document.createElement('style');
            style.id = 'blind-input-style';
            style.textContent = `
                @keyframes blindInputGlow {
                    0%, 100% { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); }
                    50% { box-shadow: 0 20px 60px rgba(255, 159, 10, 0.4); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            calculator.style.animation = '';
        }, 2000);
    }
    
    // 模拟盲点输入
    simulateBlindTyping() {
        let inputCount = 0;
        const targetLength = 6;
        
        const simulateInput = () => {
            if (inputCount < targetLength) {
                // 生成随机显示的数字
                const fakeDigit = Math.floor(Math.random() * 10);
                this.currentValue = (this.currentValue || '').slice(0, -1) + fakeDigit;
                this.updateDisplay();
                
                // 添加输入动画
                this.elements.mainDisplay.style.animation = 'blindDigitFlash 0.3s ease-out';
                setTimeout(() => {
                    this.elements.mainDisplay.style.animation = '';
                }, 300);
                
                inputCount++;
                setTimeout(simulateInput, 400);
            } else {
                // 完成盲点输入，设置实际校准数字
                this.currentValue = this.calibrationNumber;
                this.audienceNumbers.C = this.calibrationNumber;
                this.updateDisplay();
                
                this.showMagicHint('观众C的数字已记录，按等号见证奇迹...');
                
                // 添加完成效果
                this.addBlindCompleteEffect();
            }
        };
        
        simulateInput();
    }
    
    // 添加盲点输入完成效果
    addBlindCompleteEffect() {
        const display = this.elements.mainDisplay;
        display.style.animation = 'blindCompletePulse 1s ease-out';
        
        // 添加CSS动画
        if (!document.querySelector('#blind-complete-style')) {
            const style = document.createElement('style');
            style.id = 'blind-complete-style';
            style.textContent = `
                @keyframes blindDigitFlash {
                    0% { color: #ffffff; }
                    50% { color: #ff9f0a; }
                    100% { color: #ffffff; }
                }
                @keyframes blindCompletePulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); color: #ff9f0a; }
                    100% { transform: scale(1); color: #ffffff; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            display.style.animation = '';
        }, 1000);
    }
    
    // 带魔术的计算
    calculateWithMagic() {
        if (!this.isMagicMode) {
            // 正常计算
            this.calculate();
            return;
        }
        
        // 魔术模式下的计算
        if (this.magicStep === 3 || this.audienceNumbers.C) {
            this.performMagicCalculation();
        } else {
            // 正常计算
            this.calculate();
        }
    }
    
    // 执行魔术计算
    performMagicCalculation() {
        console.log('🎯 执行魔术计算');
        
        // 获取当前完整时间：年月日时分
        const currentDateTime = this.getCurrentDateTime();
        
        // 显示计算过程
        this.elements.operationDisplay.textContent = 
            `${this.audienceNumbers.A} + ${this.audienceNumbers.B} + ${this.audienceNumbers.C}`;
        
        // 震撼的结果显示
        this.showMagicResult(currentDateTime);
        
        // 完成魔术
        this.completeMagic();
    }
    
    // 显示魔术结果
    showMagicResult(result) {
        const display = this.elements.mainDisplay;
        
        // 先显示问号
        display.textContent = '????????';
        display.style.animation = 'magicQuestion 1s ease-out';
        
        setTimeout(() => {
            // 揭示结果
            display.textContent = result;
            display.style.animation = 'magicReveal 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            // 添加结果解释
            this.showMagicResultExplanation(result);
        }, 1500);
        
        // 添加CSS动画
        if (!document.querySelector('#magic-result-style')) {
            const style = document.createElement('style');
            style.id = 'magic-result-style';
            style.textContent = `
                @keyframes magicQuestion {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                @keyframes magicReveal {
                    0% { transform: scale(0.8) rotate(180deg); opacity: 0; }
                    50% { transform: scale(1.2) rotate(90deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 显示魔术结果解释
    showMagicResultExplanation(result) {
        const explanation = document.createElement('div');
        explanation.className = 'magic-explanation';
        explanation.innerHTML = `
            <div class="magic-title">🎩 神奇的时间预言！</div>
            <div class="magic-result">${result}</div>
            <div class="magic-meaning">就是现在的年月日时分！</div>
            <button class="magic-restart" onclick="window.hiddenMagicCalculator.resetMagic()">再来一次</button>
        `;
        explanation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            color: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            z-index: 2000;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: explanationAppear 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        // 添加样式
        explanation.querySelector('.magic-title').style.cssText = `
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
        `;
        
        explanation.querySelector('.magic-result').style.cssText = `
            font-size: 48px;
            font-weight: 700;
            color: #ff9f0a;
            margin-bottom: 15px;
            font-family: monospace;
        `;
        
        explanation.querySelector('.magic-meaning').style.cssText = `
            font-size: 18px;
            opacity: 0.8;
            margin-bottom: 30px;
        `;
        
        explanation.querySelector('.magic-restart').style.cssText = `
            background: #ff9f0a;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        explanation.querySelector('.magic-restart').addEventListener('mouseover', () => {
            explanation.querySelector('.magic-restart').style.background = '#ffb145';
        });
        
        document.body.appendChild(explanation);
        
        // 添加CSS动画
        if (!document.querySelector('#explanation-style')) {
            const style = document.createElement('style');
            style.id = 'explanation-style';
            style.textContent = `
                @keyframes explanationAppear {
                    0% { transform: translate(-50%, -50%) scale(0.8) rotateX(90deg); opacity: 0; }
                    100% { transform: translate(-50%, -50%) scale(1) rotateX(0deg); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 完成魔术
    completeMagic() {
        this.isMagicMode = false;
        this.magicStep = 0;
        
        // 移除魔术指示器
        const indicator = document.getElementById('magic-indicator');
        if (indicator) indicator.remove();
    }
    
    // 重置魔术
    resetMagic() {
        // 移除解释界面
        const explanation = document.querySelector('.magic-explanation');
        if (explanation) explanation.remove();
        
        // 重置状态
        this.isMagicMode = false;
        this.magicStep = 0;
        this.audienceNumbers = { A: '', B: '', C: '' };
        this.calibrationNumber = '';
        
        // 清除计算器
        this.clear();
        
        // 移除魔术指示器
        const indicator = document.getElementById('magic-indicator');
        if (indicator) indicator.remove();
    }
    
    // 计算校准数字
    calculateCalibrationNumber() {
        const currentDateTime = this.getCurrentDateTime();
        const numA = parseInt(this.audienceNumbers.A);
        const numB = parseInt(this.audienceNumbers.B);
        
        // 算法：A + B + C = 当前时间
        // 所以：C = 当前时间 - A - B
        this.calibrationNumber = (currentDateTime - numA - numB).toString().padStart(8, '0');
        
        console.log(`🔢 校准数字计算: ${currentDateTime} - ${numA} - ${numB} = ${this.calibrationNumber}`);
    }
    
    // 获取当前完整时间（年月日时分）
    getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        
        return parseInt(`${year}${month}${day}${hour}${minute}`);
    }
    
    // 带魔术的清除
    clearWithMagic() {
        this.clear();
        this.animateButton(this.elements.clearButton);
    }
    
    // 带魔术的键盘处理
    handleKeyboardWithMagic(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.handleNumberWithMagic(key);
            const button = document.querySelector(`.number-buttons [data-value="${key}"]`);
            if (button) this.animateButton(button);
        } else if (['+', '-', '*', '/'].includes(key)) {
            this.handleOperatorWithMagic(key);
            const button = document.querySelector(`.operator-buttons [data-value="${key}"]`);
            if (button) this.animateButton(button);
        } else if (key === 'Enter' || key === '=') {
            this.calculateWithMagic();
            this.animateButton(this.elements.equalsButton);
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clearWithMagic();
            this.animateButton(this.elements.clearButton);
        } else if (key === 'Backspace') {
            if (this.currentValue.length > 1) {
                this.currentValue = this.currentValue.slice(0, -1);
            } else {
                this.currentValue = '0';
            }
            this.updateDisplay();
        } else if (key === '.') {
            if (!this.currentValue.includes('.')) {
                this.handleNumberWithMagic('.');
                const button = document.querySelector('.number-buttons [data-value="."]');
                if (button) this.animateButton(button);
            }
        }
    }
    
    // 以下是正常计算器的方法（保持原有功能）
    handleNormalNumber(number) {
        if (this.waitingForNewValue) {
            this.currentValue = number;
            this.waitingForNewValue = false;
        } else {
            this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
        }
        this.updateDisplay();
    }
    
    handleNormalOperator(operator) {
        if (this.operation && !this.waitingForNewValue) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operation = operator;
        this.waitingForNewValue = true;
        this.updateDisplay();
    }
    
    calculate() {
        if (!this.operation || !this.previousValue) return;
        
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;
        
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : 'Error';
                break;
            default:
                return;
        }
        
        this.elements.operationDisplay.textContent = 
            `${this.previousValue} ${this.getOperatorSymbol(this.operation)} ${this.currentValue}`;
        
        this.currentValue = result.toString();
        this.operation = null;
        this.previousValue = '';
        this.waitingForNewValue = true;
        this.updateDisplay();
    }
    
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.waitingForNewValue = false;
        this.updateDisplay();
    }
    
    updateDisplay() {
        let displayValue = this.currentValue;
        
        if (displayValue.length > 12) {
            displayValue = parseFloat(displayValue).toExponential(6);
        } else if (!isNaN(displayValue) && displayValue !== 'Error') {
            const num = parseFloat(displayValue);
            if (!num.toString().includes('.')) {
                displayValue = num.toLocaleString();
            }
        }
        
        this.elements.mainDisplay.textContent = displayValue;
        
        let operationText = '';
        if (this.operation && this.previousValue) {
            operationText = `${this.previousValue} ${this.getOperatorSymbol(this.operation)}`;
        }
        this.elements.operationDisplay.textContent = operationText;
    }
    
    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }
    
    animateButton(button) {
        if (!button) return;
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 200);
    }
}

// 页面加载完成后初始化隐藏式魔术计算器
document.addEventListener('DOMContentLoaded', () => {
    window.hiddenMagicCalculator = new HiddenMagicCalculator();
    
    // 替换原有的魔术计算器
    if (window.magicCalculator) {
        window.magicCalculator.startMagicMode = () => {
            window.hiddenMagicCalculator.startHiddenMagicMode();
        };
    }
    
    // 保持与原计算器的兼容
    if (window.calculator) {
        // 可以选择性地集成功能
    }
});