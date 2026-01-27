// iOS风格魔术计算器逻辑
class IOSMagicCalculator {
    constructor() {
        this.isMagicMode = false;
        this.currentStep = 0;
        this.audienceNumbers = {
            A: '',
            B: '',
            C: ''
        };
        this.calibrationNumber = '';
        this.startTime = null;
        
        // iOS元素引用
        this.elements = {
            // 显示相关
            iosMainText: document.getElementById('ios-main-text'),
            iosOperationText: document.getElementById('ios-operation-text'),
            iosMagicIndicator: document.getElementById('ios-magic-indicator'),
            iosMagicDisplay: document.getElementById('ios-magic-display'),
            iosStepLabel: document.getElementById('ios-step-label'),
            iosStepNumber: document.getElementById('ios-step-number'),
            
            // 按钮相关
            iosAudienceABtn: document.getElementById('ios-audience-a-btn'),
            iosAudienceBBtn: document.getElementById('ios-audience-b-btn'),
            iosAudienceCBtn: document.getElementById('ios-audience-c-btn'),
            iosClearBtn: document.getElementById('ios-clear-btn'),
            iosEqualsBtn: document.getElementById('ios-equals-btn'),
            
            // 输入界面
            iosMagicInput: document.getElementById('ios-magic-input'),
            iosInputTitle: document.getElementById('ios-input-title'),
            iosBackBtn: document.getElementById('ios-back-btn'),
            iosConfirmBtn: document.getElementById('ios-confirm-btn'),
            iosNumberInput: document.getElementById('ios-number-input'),
            
            // 盲点输入
            iosBlindTouch: document.getElementById('ios-blind-touch'),
            iosTouchArea: document.getElementById('ios-touch-area'),
            iosTouchPoints: document.getElementById('ios-touch-points'),
            
            // 计算过程
            iosCalculation: document.getElementById('ios-calculation'),
            iosCalcLine1: document.getElementById('ios-calc-line-1'),
            iosCalcLine2: document.getElementById('ios-calc-line-2'),
            iosCalcResult: document.getElementById('ios-calc-result'),
            iosCalcA: document.getElementById('ios-calc-a'),
            iosCalcB: document.getElementById('ios-calc-b'),
            iosCalcC: document.getElementById('ios-calc-c'),
            iosFinalResult: document.getElementById('ios-final-result'),
            
            // 时间揭晓
            iosTimeReveal: document.getElementById('ios-time-reveal'),
            iosTimeResult: document.getElementById('ios-time-result'),
            
            // 重新开始
            iosRestart: document.getElementById('ios-restart'),
            iosRestartBtn: document.getElementById('ios-restart-btn'),
            
            // 原始元素（保持兼容）
            normalMode: document.getElementById('normal-mode'),
            magicMode: document.getElementById('magic-mode')
        };
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // 双击事件监听（保持原有逻辑）
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
                const timeDiff = currentTime - lastClickTime;
                
                console.log('检测到空白区域点击，时间差:', timeDiff + 'ms');
                
                if (timeDiff < 300) {
                    console.log('双击检测成功！启动iOS魔术模式');
                    this.startIOSMagicMode();
                }
                lastClickTime = currentTime;
            }
        });
        
        // iOS观众按钮事件
        this.elements.iosAudienceABtn.addEventListener('click', () => {
            this.handleAudienceButton('A');
        });
        
        this.elements.iosAudienceBBtn.addEventListener('click', () => {
            this.handleAudienceButton('B');
        });
        
        this.elements.iosAudienceCBtn.addEventListener('click', () => {
            this.handleAudienceButton('C');
        });
        
        // iOS输入界面事件
        this.elements.iosBackBtn.addEventListener('click', () => {
            this.hideIOSInput();
        });
        
        this.elements.iosConfirmBtn.addEventListener('click', () => {
            this.submitIOSNumber();
        });
        
        this.elements.iosNumberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitIOSNumber();
            }
        });
        
        // iOS数字键盘事件
        this.initializeIOSNumberPad();
        
        // iOS盲点触摸事件
        this.elements.iosTouchArea.addEventListener('click', (e) => {
            if (this.currentStep === 3) {
                this.handleIOSTouch(e);
            }
        });
        
        this.elements.iosTouchArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.currentStep === 3) {
                this.handleIOSTouch(e.touches[0]);
            }
        });
        
        // iOS重新开始按钮
        this.elements.iosRestartBtn.addEventListener('click', () => {
            this.resetIOSMagic();
        });
        
        // 空格键备用触发
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isMagicMode) {
                e.preventDefault();
                console.log('⌨️ 空格键触发iOS魔术模式');
                this.startIOSMagicMode();
            }
        });
    }
    
    // 初始化iOS数字键盘
    initializeIOSNumberPad() {
        const numberButtons = document.querySelectorAll('.ios-number-keypad .ios-btn-number');
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.textContent;
                if (value === '←') {
                    this.deleteIOSNumber();
                } else {
                    this.appendIOSNumber(value);
                }
            });
        });
    }
    
    // 启动iOS魔术模式
    startIOSMagicMode() {
        console.log('🍎 启动iOS魔术模式...');
        
        if (this.isMagicMode) {
            console.log('⚠️ iOS魔术模式已经启动');
            return;
        }
        
        this.isMagicMode = true;
        this.currentStep = 1;
        this.startTime = Date.now();
        
        console.log('📱 切换到iOS界面...');
        
        // 切换到iOS魔术模式
        this.elements.normalMode.classList.add('hidden');
        this.elements.magicMode.classList.remove('hidden');
        
        // 显示iOS魔术指示器
        this.elements.iosMagicIndicator.classList.remove('hidden');
        this.elements.iosMagicDisplay.classList.remove('hidden');
        
        // 设置初始显示
        this.elements.iosMainText.textContent = '0';
        this.elements.iosOperationText.textContent = '';
        this.elements.iosStepLabel.textContent = '请观众A说出6位数字';
        this.elements.iosStepNumber.textContent = '------';
        
        // 添加iOS启动动画
        this.addIOSStartAnimation();
        
        console.log('🎯 开始iOS魔术流程...');
    }
    
    // iOS启动动画
    addIOSStartAnimation() {
        const calculator = document.querySelector('.ios-calculator');
        calculator.style.animation = 'iosCalculatorSlideIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            calculator.style.animation = '';
        }, 600);
    }
    
    // 处理观众按钮点击
    handleAudienceButton(audience) {
        if (!this.isMagicMode) return;
        
        console.log(`👥 观众${audience}按钮被点击`);
        
        // 显示对应的输入界面
        this.showIOSInput(audience);
    }
    
    // 显示iOS输入界面
    showIOSInput(audience) {
        this.currentAudience = audience;
        
        // 设置标题
        const titles = {
            'A': '观众A的数字',
            'B': '观众B的数字',
            'C': '观众C的盲点数字'
        };
        
        this.elements.iosInputTitle.textContent = titles[audience];
        this.elements.iosNumberInput.value = '';
        this.elements.iosMagicInput.classList.remove('hidden');
        
        // 聚焦输入框
        setTimeout(() => {
            this.elements.iosNumberInput.focus();
        }, 300);
    }
    
    // 隐藏iOS输入界面
    hideIOSInput() {
        this.elements.iosMagicInput.classList.add('hidden');
    }
    
    // 追加iOS数字
    appendIOSNumber(digit) {
        const input = this.elements.iosNumberInput;
        if (input.value.length < 6) {
            input.value += digit;
            this.addIOSInputFeedback();
        }
    }
    
    // 删除iOS数字
    deleteIOSNumber() {
        const input = this.elements.iosNumberInput;
        if (input.value.length > 0) {
            input.value = input.value.slice(0, -1);
            this.addIOSInputFeedback();
        }
    }
    
    // iOS输入反馈
    addIOSInputFeedback() {
        const input = this.elements.iosNumberInput;
        input.style.transform = 'scale(1.02)';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 100);
    }
    
    // 提交iOS数字
    submitIOSNumber() {
        const number = this.elements.iosNumberInput.value;
        
        if (!this.validateSixDigit(number)) {
            this.showIOSError('请输入正确的6位数字！');
            return;
        }
        
        // 保存数字
        this.audienceNumbers[this.currentAudience] = number;
        
        // 更新显示
        this.updateIOSDisplay();
        
        // 隐藏输入界面
        this.hideIOSInput();
        
        // 处理下一步
        this.handleNextStep();
    }
    
    // 更新iOS显示
    updateIOSDisplay() {
        // 更新主显示
        if (this.audienceNumbers.A) {
            this.elements.iosMainText.textContent = this.audienceNumbers.A;
        }
        
        // 更新步骤显示
        this.elements.iosStepNumber.textContent = this.audienceNumbers[this.currentAudience] || '------';
        
        // 添加动画效果
        this.elements.iosStepNumber.style.animation = 'iosNumberUpdate 0.3s ease-out';
        setTimeout(() => {
            this.elements.iosStepNumber.style.animation = '';
        }, 300);
    }
    
    // 处理下一步
    handleNextStep() {
        if (this.currentAudience === 'A') {
            this.currentStep = 2;
            this.elements.iosStepLabel.textContent = '请观众B说出6位数字';
        } else if (this.currentAudience === 'B') {
            this.currentStep = 3;
            this.elements.iosStepLabel.textContent = '请观众C闭上眼睛，在屏幕上随意点击';
            setTimeout(() => {
                this.startIOSBlindTouch();
            }, 1500);
        } else if (this.currentAudience === 'C') {
            this.showIOSCalculation();
        }
    }
    
    // 开始iOS盲点输入
    startIOSBlindTouch() {
        console.log('🙏 开始iOS盲点输入');
        
        // 计算校准数字
        this.calculateCalibrationNumber();
        
        // 显示盲点界面
        this.elements.iosBlindTouch.classList.remove('hidden');
        this.elements.iosMagicDisplay.classList.add('hidden');
        
        // 模拟盲点输入
        setTimeout(() => {
            this.simulateIOSBlindInput();
        }, 2000);
    }
    
    // 模拟iOS盲点输入
    simulateIOSBlindInput() {
        let touchCount = 0;
        const targetTouches = 6;
        
        const createIOSTouch = () => {
            if (touchCount < targetTouches) {
                // 创建随机触摸点
                const rect = this.elements.iosTouchArea.getBoundingClientRect();
                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;
                
                this.createIOSTouchEffect(x, y);
                
                // 显示假数字
                const fakeDigit = Math.floor(Math.random() * 10);
                this.showIOSFakeDigit(fakeDigit);
                
                touchCount++;
                
                setTimeout(createIOSTouch, 600);
            } else {
                // 完成盲点输入
                setTimeout(() => {
                    this.elements.iosBlindTouch.classList.add('hidden');
                    this.elements.iosMagicDisplay.classList.remove('hidden');
                    this.updateIOSDisplay();
                    setTimeout(() => this.showIOSCalculation(), 1500);
                }, 1000);
            }
        };
        
        createIOSTouch();
    }
    
    // 创建iOS触摸效果
    createIOSTouchEffect(x, y) {
        const touchPoint = document.createElement('div');
        touchPoint.className = 'ios-touch-point';
        touchPoint.style.left = x + 'px';
        touchPoint.style.top = y + 'px';
        
        this.elements.iosTouchPoints.appendChild(touchPoint);
        
        setTimeout(() => {
            touchPoint.remove();
        }, 1500);
    }
    
    // 显示iOS假数字
    showIOSFakeDigit(digit) {
        const tempDisplay = document.createElement('div');
        tempDisplay.className = 'ios-fake-digit';
        tempDisplay.textContent = digit;
        tempDisplay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 72px;
            font-weight: 300;
            color: #ff9f0a;
            font-family: 'SF Mono', monospace;
            z-index: 10;
            animation: iosFakeDigitAppear 0.5s ease-out;
        `;
        
        this.elements.iosTouchArea.appendChild(tempDisplay);
        
        setTimeout(() => {
            tempDisplay.remove();
        }, 500);
    }
    
    // 显示iOS计算过程
    showIOSCalculation() {
        console.log('🧮 显示iOS计算过程');
        
        this.elements.iosMagicDisplay.classList.add('hidden');
        this.elements.iosCalculation.classList.remove('hidden');
        
        // 第一行：A + C
        this.elements.iosCalcA.textContent = this.audienceNumbers.A;
        this.elements.iosCalcC.textContent = this.audienceNumbers.C;
        this.elements.iosCalcLine1.classList.remove('hidden');
        
        setTimeout(() => {
            // 计算中间结果
            const tempResult = parseInt(this.audienceNumbers.A) + parseInt(this.audienceNumbers.C);
            
            // 第二行：temp - B
            this.elements.iosCalcLine2.querySelector('.ios-calc-number').textContent = tempResult;
            this.elements.iosCalcB.textContent = this.audienceNumbers.B;
            this.elements.iosCalcLine2.classList.remove('hidden');
            
            setTimeout(() => {
                // 显示最终结果
                this.elements.iosCalcResult.classList.remove('hidden');
                this.elements.iosFinalResult.textContent = '????';
                
                setTimeout(() => {
                    this.revealIOSTime();
                }, 2000);
            }, 2000);
        }, 2000);
    }
    
    // 揭示iOS时间
    revealIOSTime() {
        console.log('⏰ 揭示iOS时间');
        
        const finalResult = this.getCurrentTime();
        this.elements.iosFinalResult.textContent = finalResult.toString().padStart(4, '0');
        
        setTimeout(() => {
            this.elements.iosCalculation.classList.add('hidden');
            this.elements.iosTimeReveal.classList.remove('hidden');
            
            const currentTime = new Date();
            const timeString = currentTime.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            this.elements.iosTimeResult.textContent = timeString;
            
            // 显示重新开始按钮
            setTimeout(() => {
                this.elements.iosRestart.classList.remove('hidden');
            }, 2000);
        }, 1500);
    }
    
    // 重置iOS魔术
    resetIOSMagic() {
        console.log('🔄 重置iOS魔术');
        
        this.isMagicMode = false;
        this.currentStep = 0;
        this.audienceNumbers = { A: '', B: '', C: '' };
        this.calibrationNumber = '';
        
        // 重置显示
        this.elements.normalMode.classList.remove('hidden');
        this.elements.magicMode.classList.add('hidden');
        
        // 重置iOS界面
        this.elements.iosMagicIndicator.classList.add('hidden');
        this.elements.iosMagicDisplay.classList.add('hidden');
        this.elements.iosMagicInput.classList.add('hidden');
        this.elements.iosBlindTouch.classList.add('hidden');
        this.elements.iosCalculation.classList.add('hidden');
        this.elements.iosTimeReveal.classList.add('hidden');
        this.elements.iosRestart.classList.add('hidden');
        
        // 清空触摸点
        this.elements.iosTouchPoints.innerHTML = '';
    }
    
    // 计算校准数字
    calculateCalibrationNumber() {
        const currentTime = this.getCurrentTime();
        const numA = parseInt(this.audienceNumbers.A);
        const numB = parseInt(this.audienceNumbers.B);
        
        this.calibrationNumber = (currentTime - numA + numB).toString().padStart(6, '0');
        this.audienceNumbers.C = this.calibrationNumber;
    }
    
    // 获取当前时间
    getCurrentTime() {
        const now = new Date();
        return now.getHours() * 100 + now.getMinutes();
    }
    
    // 验证6位数字
    validateSixDigit(input) {
        return /^\d{6}$/.test(input);
    }
    
    // 显示iOS错误
    showIOSError(message) {
        const input = this.elements.iosNumberInput;
        input.style.animation = 'iosErrorShake 0.5s ease-out';
        alert(message);
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
}

// 添加iOS特殊动画CSS
const iosAnimationCSS = `
@keyframes iosCalculatorSlideIn {
    0% {
        transform: translate(-50%, -50%) scale(0.8) rotateX(90deg);
        opacity: 0;
    }
    100% {
        transform: translate(-50%, -50%) scale(1) rotateX(0deg);
        opacity: 1;
    }
}

@keyframes iosNumberUpdate {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

@keyframes iosFakeDigitAppear {
    0% {
        transform: translate(-50%, -50%) scale(0) rotate(180deg);
        opacity: 0;
    }
    50% {
        transform: translate(-50%, -50%) scale(1.2) rotate(90deg);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
        opacity: 0;
    }
}

@keyframes iosErrorShake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-10px); }
    40%, 80% { transform: translateX(10px); }
}

.ios-fake-digit {
    animation: iosFakeDigitAppear 0.5s ease-out;
}
`;

// 添加CSS到页面
const iosStyleSheet = document.createElement('style');
iosStyleSheet.textContent = iosAnimationCSS;
document.head.appendChild(iosStyleSheet);

// 页面加载完成后初始化iOS魔术计算器
document.addEventListener('DOMContentLoaded', () => {
    window.iosMagicCalculator = new IOSMagicCalculator();
    
    // 保持与原有魔术计算器的兼容性
    if (window.magicCalculator) {
        // 重写启动方法以使用iOS版本
        window.magicCalculator.startMagicMode = () => {
            window.iosMagicCalculator.startIOSMagicMode();
        };
    }
});