// 普通计算器功能
class Calculator {
    constructor() {
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
        // 数字按钮事件
        this.elements.numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleNumber(button.dataset.value);
            });
        });
        
        // 运算符按钮事件
        this.elements.operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperator(button.dataset.value);
            });
        });
        
        // 清除按钮
        this.elements.clearButton.addEventListener('click', () => {
            this.clear();
        });
        
        // 等号按钮
        this.elements.equalsButton.addEventListener('click', () => {
            this.calculate();
        });
        
        // 键盘支持
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    // 处理数字输入
    handleNumber(number) {
        if (this.waitingForNewValue) {
            this.currentValue = number;
            this.waitingForNewValue = false;
        } else {
            this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
        }
        
        this.updateDisplay();
        this.animateButton(event.target);
    }
    
    // 处理运算符输入
    handleOperator(operator) {
        if (this.operation && !this.waitingForNewValue) {
            this.calculate();
        }
        
        this.previousValue = this.currentValue;
        this.operation = operator;
        this.waitingForNewValue = true;
        
        this.updateDisplay();
        this.animateButton(event.target);
    }
    
    // 计算结果
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
        
        // 更新显示运算过程
        this.elements.operationDisplay.textContent = 
            `${this.previousValue} ${this.getOperatorSymbol(this.operation)} ${this.currentValue}`;
        
        this.currentValue = result.toString();
        this.operation = null;
        this.previousValue = '';
        this.waitingForNewValue = true;
        
        this.updateDisplay();
        this.animateButton(this.elements.equalsButton);
    }
    
    // 清除
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.waitingForNewValue = false;
        
        this.updateDisplay();
        this.animateButton(this.elements.clearButton);
    }
    
    // 更新显示
    updateDisplay() {
        // 主显示
        let displayValue = this.currentValue;
        
        // 处理数字格式化
        if (displayValue.length > 12) {
            displayValue = parseFloat(displayValue).toExponential(6);
        } else if (!isNaN(displayValue) && displayValue !== 'Error') {
            const num = parseFloat(displayValue);
            if (!num.toString().includes('.')) {
                displayValue = num.toLocaleString();
            }
        }
        
        this.elements.mainDisplay.textContent = displayValue;
        
        // 运算显示
        let operationText = '';
        if (this.operation && this.previousValue) {
            operationText = `${this.previousValue} ${this.getOperatorSymbol(this.operation)}`;
        }
        this.elements.operationDisplay.textContent = operationText;
    }
    
    // 获取运算符符号
    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }
    
    // 按钮动画
    animateButton(button) {
        if (!button) return;
        
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 200);
    }
    
    // 键盘事件处理
    handleKeyboard(e) {
        const key = e.key;
        
        // 数字键
        if (key >= '0' && key <= '9') {
            this.handleNumber(key);
            const button = document.querySelector(`.number-buttons [data-value="${key}"]`);
            if (button) this.animateButton(button);
        }
        // 运算符键
        else if (['+', '-', '*', '/'].includes(key)) {
            this.handleOperator(key);
            const button = document.querySelector(`.operator-buttons [data-value="${key}"]`);
            if (button) this.animateButton(button);
        }
        // 等号键
        else if (key === 'Enter' || key === '=') {
            this.calculate();
            this.animateButton(this.elements.equalsButton);
        }
        // 清除键
        else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clear();
            this.animateButton(this.elements.clearButton);
        }
        // 退格键
        else if (key === 'Backspace') {
            if (this.currentValue.length > 1) {
                this.currentValue = this.currentValue.slice(0, -1);
            } else {
                this.currentValue = '0';
            }
            this.updateDisplay();
        }
        // 小数点
        else if (key === '.') {
            if (!this.currentValue.includes('.')) {
                this.handleNumber('.');
                const button = document.querySelector('.number-buttons [data-value="."]');
                if (button) this.animateButton(button);
            }
        }
    }
}

// 页面加载完成后初始化计算器
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
});