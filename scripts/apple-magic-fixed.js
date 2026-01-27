// 苹果计算器风格的精确流程魔术计算器 - 修复版
class AppleMagicCalculatorFixed {
    constructor() {
        this.isMagicMode = false;
        this.magicStep = 0; // 0=未开始, 1=输入A, 2=等待+, 3=输入B, 4=等待=, 5=等待+, 6=盲按C, 7=等待=
        this.audienceNumbers = {
            A: '',
            B: '',
            C: ''
        };
        this.calibrationNumber = '';
        this.startTime = null;
        
        // 连续按键检测
        this.keySequence = [];
        this.keySequenceTimeout = null;
        this.SEQUENCE_LENGTH = 5;
        this.SEQUENCE_TIMEOUT = 1000; // 1秒内必须完成序列
        
        // 计算器状态
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.waitingForNewValue = false;
        this.lastResult = '';
        
        // DOM元素引用
        this.elements = {
            appleCalculator: document.getElementById('apple-calculator'),
            magicIndicator: document.getElementById('magic-indicator'),
            mainDisplay: document.getElementById('main-display'),
            operationDisplay: document.getElementById('operation-display'),
            numberButtons: document.querySelectorAll('.number'),
            operatorButtons: document.querySelectorAll('.operator'),
            clearButton: document.getElementById('clear'),
            equalsButton: document.getElementById('equals')
        };
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // 双击启动魔术模式
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
                    this.startAppleMagicMode();
                }
                lastClickTime = currentTime;
            }
        });
        
        // 数字按钮事件
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
            this.equalsWithMagic();
        });
        
        // 键盘支持
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardWithMagic(e);
        });
        
        // 空格键备用触发
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isMagicMode) {
                e.preventDefault();
                this.startAppleMagicMode();
            }
        });
    }
    
    // 启动苹果魔术模式
    startAppleMagicMode() {
        console.log('🍎 启动苹果计算器魔术模式');
        
        if (this.isMagicMode) return;
        
        this.isMagicMode = true;
        this.magicStep = 1;
        this.startTime = Date.now();
        
        // 重置计算器状态
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.waitingForNewValue = false;
        this.lastResult = '';
        
        // 添加苹果计算器魔术效果
        this.elements.appleCalculator.classList.add('magic-mode');
        this.elements.magicIndicator.classList.add('active');
        
        // 显示第一步提示
        this.showMagicHint('步骤1: 请观众A输入任意6位数字...');
        this.updateDisplay();
    }
    
    // 处理数字输入（带精确魔术流程）
    handleNumberWithMagic(number) {
        console.log(`🔢 数字输入: ${number}, 当前步骤: ${this.magicStep}`);
        
        if (!this.isMagicMode) {
            // 正常计算器行为
            this.handleNormalNumber(number);
            return;
        }
        
        // 魔术模式下的数字输入 - 严格按步骤控制
        if (this.magicStep === 1) {
            // 步骤1：输入观众A的数字
            if (this.waitingForNewValue) {
                this.currentValue = number;
                this.waitingForNewValue = false;
            } else {
                this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
            }
            
            this.updateDisplay();
            this.animateButton(event.target);
            
            // 检查是否完成6位数字
            if (this.currentValue.length === 6) {
                this.audienceNumbers.A = this.currentValue;
                this.showMagicHint('观众A的数字已记录，请按+号继续...');
                console.log(`✅ 观众A数字: ${this.audienceNumbers.A}`);
            }
        } else if (this.magicStep === 3) {
            // 步骤3：输入观众B的数字
            if (this.waitingForNewValue) {
                this.currentValue = number;
                this.waitingForNewValue = false;
            } else {
                this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
            }
            
            this.updateDisplay();
            this.animateButton(event.target);
            
            // 检查是否完成6位数字
            if (this.currentValue.length === 6) {
                this.audienceNumbers.B = this.currentValue;
                this.showMagicHint('观众B的数字已记录，请按=号计算A+B...');
                console.log(`✅ 观众B数字: ${this.audienceNumbers.B}`);
            }
        } else if (this.magicStep === 6) {
            // 步骤6：盲点输入（这里不处理，由盲点输入逻辑处理）
            console.log('🙏 盲点输入阶段，忽略数字输入');
            return;
        } else {
            // 允许步骤2输入数字（观众B的输入）
            if (this.magicStep === 2) {
                if (this.waitingForNewValue) {
                    this.currentValue = number;
                    this.waitingForNewValue = false;
                } else {
                    this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
                }
                
                this.updateDisplay();
                this.animateButton(event.target);
                
                // 检查是否完成6位数字
                if (this.currentValue.length === 6) {
                    this.audienceNumbers.B = this.currentValue;
                    this.showMagicHint('观众B的数字已记录，请按=号计算A+B...');
                    console.log(`✅ 观众B数字: ${this.audienceNumbers.B}`);
                }
            } else {
                // 其他步骤不允许数字输入
                console.log(`⚠️ 步骤${this.magicStep}不允许数字输入`);
                this.showMagicHint(`请按正确的按钮继续步骤${this.magicStep}...`);
                return;
            }
        }
    }
    
    // 检测连续按键序列
    detectKeySequence(operator) {
        // 清除之前的超时
        if (this.keySequenceTimeout) {
            clearTimeout(this.keySequenceTimeout);
        }
        
        // 添加按键到序列
        this.keySequence.push(operator);
        
        // 检查是否达到5次
        if (this.keySequence.length >= this.SEQUENCE_LENGTH) {
            const lastFiveKeys = this.keySequence.slice(-this.SEQUENCE_LENGTH);
            const isAllPlus = lastFiveKeys.every(key => key === '+');
            const isAllMinus = lastFiveKeys.every(key => key === '-');
            
            if (isAllPlus && !this.isMagicMode) {
                // 连续5次+：进入魔术模式
                this.startAppleMagicMode();
                this.keySequence = [];
                console.log('🎭 连续5次+，进入魔术模式');
                return;
            } else if (isAllMinus && this.isMagicMode) {
                // 连续5次-：退出魔术模式
                this.exitMagicMode();
                this.keySequence = [];
                console.log('🚪 连续5次-，退出魔术模式');
                return;
            }
        }
        
        // 设置新的超时
        this.keySequenceTimeout = setTimeout(() => {
            this.keySequence = [];
            console.log('🔑 按键序列超时，重置');
        }, this.SEQUENCE_TIMEOUT);
    }
    
    // 处理运算符输入（带精确魔术流程）
    handleOperatorWithMagic(operator) {
        console.log(`➕ 运算符输入: ${operator}, 当前步骤: ${this.magicStep}`);
        
        // 检测连续按键序列
        this.detectKeySequence(operator);
        
        if (!this.isMagicMode) {
            // 正常计算器行为
            this.handleNormalOperator(operator);
            return;
        }
        
        // 魔术模式下的运算符处理 - 严格按步骤控制
        if (operator === '+') {
            if (this.magicStep === 1 && this.audienceNumbers.A) {
                // 步骤2：观众A输入完成，按+
                this.magicStep = 2; // 步骤2：输入观众B的数字
                this.showMagicHint('步骤2: 请观众B输入任意6位数字...');
                
                // 执行正常的+操作
                this.handleNormalOperator(operator);
                console.log('✅ 步骤2完成，现在是步骤3，等待观众B输入');
            } else if (this.magicStep === 4 && this.lastResult) {
                // 步骤5：A+B计算完成，按+
                this.magicStep = 5;
                this.showMagicHint('步骤5: 现在请观众C闭上眼睛，在计算器上随意点击...');
                
                // 准备盲点输入
                this.prepareBlindInput();
                
                // 执行正常的+操作
                this.handleNormalOperator(operator);
                console.log('✅ 步骤5完成，准备盲点输入');
            } else {
                console.log(`⚠️ 步骤${this.magicStep}不能按+号`);
                this.showMagicHint(`请先完成前面的步骤...`);
            }
        } else {
            console.log(`⚠️ 魔术模式下只允许+号运算符`);
            this.showMagicHint('魔术模式下请使用+号...');
        }
    }
    }
    
    // 处理等号（带精确魔术流程）
    equalsWithMagic() {
        console.log(`= 等号输入, 当前步骤: ${this.magicStep}`);
        
        if (!this.isMagicMode) {
            // 正常计算
            this.calculate();
            return;
        }
        
        if (this.magicStep === 2 && this.audienceNumbers.B) {
            // 步骤3：观众B输入完成，按=
            this.magicStep = 4;
            
            // 执行A+B的计算
            this.calculate();
            this.lastResult = this.currentValue;
            
            this.showMagicHint(`步骤4: A+B=${this.lastResult}，请按+号继续...`);
            console.log(`✅ 步骤4完成，A+B=${this.lastResult}`);
        } else if (this.magicStep === 6 && this.audienceNumbers.C) {
            // 步骤7：盲点输入完成，按=
            this.performFinalMagicCalculation();
        } else {
            console.log(`⚠️ 步骤${this.magicStep}不能按=号`);
            this.showMagicHint(`请先完成前面的步骤...`);
        }
    }
    
    // 准备盲点输入
    prepareBlindInput() {
        console.log('🙏 准备盲点输入');
        
        // 计算需要的校准数字
        this.calculateCalibrationNumber();
        
        // 添加盲点输入效果
        this.elements.appleCalculator.classList.add('blind-input-effect');
        
        // 模拟盲点输入
        setTimeout(() => {
            this.simulateBlindTyping();
        }, 2000);
    }
    
    // 模拟盲点输入
    simulateBlindTyping() {
        console.log('🎲 开始模拟盲点输入');
        let inputCount = 0;
        const targetLength = 6; // 固定为6位：月日时分
        
        const simulateInput = () => {
            if (inputCount < targetLength) {
                // 生成随机显示的数字
                const fakeDigit = Math.floor(Math.random() * 10);
                this.currentValue = (this.currentValue || '').slice(0, -1) + fakeDigit;
                this.updateDisplay();
                
                // 添加输入动画
                this.elements.mainDisplay.classList.add('number-flash');
                setTimeout(() => {
                    this.elements.mainDisplay.classList.remove('number-flash');
                }, 300);
                
                inputCount++;
                setTimeout(simulateInput, 300);
            } else {
                // 完成盲点输入，设置实际校准数字
                this.currentValue = this.calibrationNumber;
                this.audienceNumbers.C = this.calibrationNumber;
                this.updateDisplay();
                
                this.magicStep = 6;
                this.showMagicHint('观众C的数字已记录，请按=号见证奇迹...');
                console.log(`✅ 盲点输入完成，C=${this.audienceNumbers.C}`);
                
                // 移除盲点输入效果
                this.elements.appleCalculator.classList.remove('blind-input-effect');
                
                // 添加完成效果
                this.addBlindCompleteEffect();
            }
        };
        
        simulateInput();
    }
    
    // 添加盲点输入完成效果
    addBlindCompleteEffect() {
        this.elements.mainDisplay.classList.add('magic-result-animation');
        setTimeout(() => {
            this.elements.mainDisplay.classList.remove('magic-result-animation');
        }, 2000);
    }
    
    // 执行最终魔术计算
    performFinalMagicCalculation() {
        console.log('🎯 执行最终魔术计算');
        
        // 执行最终计算：(A+B) + C = 日期+时间
        const abResult = parseInt(this.lastResult);
        const cNumber = parseInt(this.audienceNumbers.C);
        const finalResult = abResult + cNumber;
        
        // 获取当前完整日期时间
        const currentDateTime = this.getCurrentDateTime();
        
        // 显示计算过程
        this.elements.operationDisplay.textContent = 
            `${this.lastResult} + ${this.audienceNumbers.C} =`;
        
        // 更新显示为最终结果
        this.currentValue = currentDateTime.toString();
        this.updateDisplay();
        
        // 震撼的结果显示
        setTimeout(() => {
            this.showMagicResult(currentDateTime);
        }, 500);
        
        // 完成魔术
        this.completeMagic();
    }
    
    // 显示魔术结果
    showMagicResult(result) {
        const display = this.elements.mainDisplay;
        
        // 先显示问号
        display.textContent = '??????';
        display.classList.add('magic-result-animation');
        
        setTimeout(() => {
            // 格式化显示结果 - 修复解析逻辑
            const resultStr = result.toString().padStart(6, '0');
            const month = resultStr.slice(0, 2);
            const day = resultStr.slice(2, 4);
            const hour = resultStr.slice(4, 6);
            const minute = this.getCurrentMinutes();
            
            // 显示屏显示月日时分
            const formattedDisplay = `${month}${day}${hour}${minute}`;
            
            display.textContent = formattedDisplay;
            display.classList.add('magic-result-animation');
            
            console.log(`📱 显示屏显示: ${formattedDisplay}`);
            console.log(`🎯 完整时间: ${month}月${day}日${hour}时${minute}分`);
            
            // 添加结果解释
            setTimeout(() => {
                this.showMagicResultModal(result);
            }, 1000);
        }, 2000);
    }
    
    // 显示魔术结果弹窗
    showMagicResultModal(result) {
        // 获取当前真实时间，避免解析错误
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        
        const formattedResult = `${month}月${day}日 ${hour}:${minute}`;
        
        console.log(`🎯 弹窗显示真实时间: ${formattedResult}`);
        console.log(`🔢 计算结果: ${result}`);
        
        const modal = document.createElement('div');
        modal.className = 'magic-result-modal';
        modal.innerHTML = `
            <div class="magic-result-title">🎩 神奇的时间预言！</div>
            <div class="magic-result-value">${formattedResult}</div>
            <div class="magic-result-meaning">就是现在的日期和时间！</div>
            <button class="magic-restart-btn" onclick="window.appleMagicCalculatorFixed.resetMagic()">再来一次</button>
        `;
        
        document.body.appendChild(modal);
    }
    
    // 获取当前分钟数
    getCurrentMinutes() {
        const now = new Date();
        return now.getMinutes().toString().padStart(2, '0');
    }
    
    // 计算校准数字
    calculateCalibrationNumber() {
        const currentDateTime = this.getCurrentDateTime();
        const abResult = parseInt(this.lastResult);
        
        // 算法：(A+B) + C = 当前日期时间（月日时分）
        // 所以：C = 当前日期时间 - (A+B)
        this.calibrationNumber = (currentDateTime - abResult).toString().padStart(6, '0');
        
        console.log(`🔢 校准数字计算: ${currentDateTime} - ${abResult} = ${this.calibrationNumber}`);
    }
    
    // 获取当前日期时间（不含年份）
    getCurrentDateTime() {
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        
        const timeString = `${month}${day}${hour}${minute}`;
        console.log(`🕐 当前时间: ${month}月${day}日${hour}时${minute}分`);
        console.log(`🔢 时间数字: ${timeString} (应该是8位数字)`);
        
        return parseInt(timeString);
    }
    
    // 显示魔术提示
    showMagicHint(message) {
        console.log(`💬 提示: ${message}`);
        
        // 移除现有提示
        const existingHint = document.querySelector('.magic-hint');
        if (existingHint) existingHint.remove();
        
        // 创建新提示
        const hint = document.createElement('div');
        hint.className = 'magic-hint';
        hint.textContent = message;
        
        document.body.appendChild(hint);
        
        // 3秒后自动消失
        setTimeout(() => {
            hint.style.animation = 'hintSlideIn 0.3s ease-out reverse';
            setTimeout(() => hint.remove(), 300);
        }, 3000);
    }
    
    // 退出魔术模式
    exitMagicMode() {
        console.log('🚪 退出魔术模式');
        
        if (!this.isMagicMode) return;
        
        this.isMagicMode = false;
        this.magicStep = 0;
        
        // 重置状态
        this.audienceNumbers = { A: '', B: '', C: '' };
        this.calibrationNumber = '';
        this.lastResult = '';
        
        // 清除计算器
        this.clear();
        
        // 在iPhone版本中显示简单的提示
        if (document.querySelector('.magic-result-modal') === null) {
            const modal = document.createElement('div');
            modal.className = 'magic-result-modal';
            modal.innerHTML = `
                <div class="magic-result-title">魔术模式已退出</div>
                <button class="magic-restart-btn" onclick="this.parentElement.remove()">确定</button>
            `;
            modal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                z-index: 2000;
                backdrop-filter: blur(10px);
            `;
            
            document.body.appendChild(modal);
            
            // 3秒后自动移除
            setTimeout(() => {
                if (modal.parentElement) {
                    modal.remove();
                }
            }, 3000);
        }
        
        console.log('✅ 魔术模式已退出');
    }
    
    // 完成魔术
    completeMagic() {
        this.isMagicMode = false;
        this.magicStep = 0;
        
        // 移除魔术效果
        this.elements.appleCalculator.classList.remove('magic-mode');
        this.elements.magicIndicator.classList.remove('active');
    }
    
    // 重置魔术
    resetMagic() {
        // 移除结果弹窗
        const modal = document.querySelector('.magic-result-modal');
        if (modal) modal.remove();
        
        // 重置状态
        this.isMagicMode = false;
        this.magicStep = 0;
        this.audienceNumbers = { A: '', B: '', C: '' };
        this.calibrationNumber = '';
        this.lastResult = '';
        
        // 重置按键序列
        this.keySequence = [];
        if (this.keySequenceTimeout) {
            clearTimeout(this.keySequenceTimeout);
            this.keySequenceTimeout = null;
        }
        
        // 清除计算器
        this.clear();
        
        // 移除所有效果
        this.elements.appleCalculator.classList.remove('magic-mode', 'blind-input-effect');
        this.elements.magicIndicator.classList.remove('active');
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
            const button = document.querySelector(`.number[data-value="${key}"]`);
            if (button) this.animateButton(button);
        } else if (['+', '-', '*', '/'].includes(key)) {
            this.handleOperatorWithMagic(key);
            const button = document.querySelector(`.operator[data-value="${key}"]`);
            if (button) this.animateButton(button);
        } else if (key === 'Enter' || key === '=') {
            this.equalsWithMagic();
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
                const button = document.querySelector('.number[data-value="."]');
                if (button) this.animateButton(button);
            }
        }
    }
    
    // 以下是正常计算器的方法
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
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

// 页面加载完成后初始化修复版苹果魔术计算器
document.addEventListener('DOMContentLoaded', () => {
    window.appleMagicCalculatorFixed = new AppleMagicCalculatorFixed();
    
    // 替换原有的魔术计算器
    if (window.magicCalculator) {
        window.magicCalculator.startMagicMode = () => {
            window.appleMagicCalculatorFixed.startAppleMagicMode();
        };
    }
});