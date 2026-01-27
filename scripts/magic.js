// 魔术计算器核心逻辑
class MagicCalculator {
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
        
        // DOM元素引用
        this.elements = {
            normalMode: document.getElementById('normal-mode'),
            magicMode: document.getElementById('magic-mode'),
            magicTitle: document.getElementById('magic-title'),
            magicStepText: document.getElementById('magic-step-text'),
            audienceAValue: document.getElementById('audience-a-value'),
            audienceBValue: document.getElementById('audience-b-value'),
            audienceCValue: document.getElementById('audience-c-value'),
            inputPrompt: document.getElementById('input-prompt'),
            promptText: document.getElementById('prompt-text'),
            magicInput: document.getElementById('magic-input'),
            submitBtn: document.getElementById('submit-btn'),
            blindTouchArea: document.getElementById('blind-touch-area'),
            touchCanvas: document.getElementById('touch-canvas'),
            touchPoints: document.getElementById('touch-points'),
            magicCalculation: document.getElementById('magic-calculation'),
            calcNumberA: document.getElementById('calc-number-a'),
            calcNumberB: document.getElementById('calc-number-b'),
            calcNumberC: document.getElementById('calc-number-c'),
            calcOp1: document.getElementById('calc-op-1'),
            calcOp2: document.getElementById('calc-op-2'),
            tempResult: document.getElementById('temp-result'),
            finalResult: document.getElementById('final-result'),
            timeReveal: document.getElementById('time-reveal'),
            timeDisplay: document.getElementById('time-display'),
            restartBtn: document.getElementById('restart-btn')
        };
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // 双击事件监听
        let lastClickTime = 0;
        document.addEventListener('click', (e) => {
            // 检查是否点击了空白区域（非按钮、非输入框）
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
                
                // 调试信息
                console.log('检测到空白区域点击，时间差:', timeDiff + 'ms');
                
                if (timeDiff < 300) {
                    console.log('双击检测成功！启动魔术模式');
                    this.startMagicMode();
                }
                lastClickTime = currentTime;
            }
        });
        
        // 提交按钮事件
        this.elements.submitBtn.addEventListener('click', () => {
            this.submitNumber();
        });
        
        // 输入框回车事件
        this.elements.magicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitNumber();
            }
        });
        
        // 重新开始按钮
        this.elements.restartBtn.addEventListener('click', () => {
            this.resetMagic();
        });
        
        // 添加备用触发方式：按键盘空格键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isMagicMode) {
                e.preventDefault();
                console.log('⌨️ 空格键触发魔术模式');
                this.startMagicMode();
            }
        });
        
        // 盲点触摸事件 - 移动端优化
        this.elements.touchCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.currentStep === 3) {
                this.handleBlindTouch(e.touches[0]);
                // 触摸反馈
                if (window.vibratePattern) {
                    window.vibratePattern(50);
                }
            }
        });
        
        this.elements.touchCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            // 防止页面滚动
        });
        
        // 鼠标点击事件 - 桌面端
        this.elements.touchCanvas.addEventListener('click', (e) => {
            if (this.currentStep === 3) {
                this.handleBlindTouch(e);
            }
        });
        
        // 阻止右键菜单
        this.elements.touchCanvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    // 开始魔术模式
    startMagicMode() {
        console.log('🎩 启动魔术模式...');
        
        if (this.isMagicMode) {
            console.log('⚠️ 魔术模式已经启动');
            return;
        }
        
        this.isMagicMode = true;
        this.currentStep = 1;
        this.startTime = Date.now();
        
        console.log('📦 切换界面元素...');
        
        // 切换到魔术模式
        this.elements.normalMode.classList.add('hidden');
        this.elements.magicMode.classList.remove('hidden');
        this.elements.magicMode.classList.add('magic-mode-start');
        
        console.log('✨ 添加视觉效果...');
        
        // 添加背景闪烁效果
        document.body.classList.add('background-flash');
        setTimeout(() => {
            document.body.classList.remove('background-flash');
        }, 300);
        
        console.log('🎯 开始魔术流程...');
        
        // 开始第一步
        this.step1_AudienceA();
    }
    
    // 步骤1：观众A输入
    step1_AudienceA() {
        this.elements.magicStepText.textContent = '请观众A说出一个6位数字...';
        this.showNumberInput('观众A的6位数字', () => {
            const number = this.elements.magicInput.value;
            if (this.validateSixDigit(number)) {
                this.audienceNumbers.A = number;
                this.hideNumberInput();
                this.displayNumber('A', number);
                setTimeout(() => this.step2_AudienceB(), 1500);
            } else {
                this.showError('请输入正确的6位数字！');
            }
        });
    }
    
    // 步骤2：观众B输入
    step2_AudienceB() {
        this.elements.magicStepText.textContent = '请观众B说出另一个6位数字...';
        this.showNumberInput('观众B的6位数字', () => {
            const number = this.elements.magicInput.value;
            if (this.validateSixDigit(number)) {
                this.audienceNumbers.B = number;
                this.hideNumberInput();
                this.displayNumber('B', number);
                setTimeout(() => this.step3_AudienceC(), 1500);
            } else {
                this.showError('请输入正确的6位数字！');
            }
        });
    }
    
    // 步骤3：观众C盲点输入
    step3_AudienceC() {
        this.elements.magicStepText.textContent = '现在请观众C闭上眼睛，在屏幕上随意点击...';
        
        // 计算校准数字
        this.calculateCalibrationNumber();
        
        // 显示盲点输入区域
        this.elements.inputPrompt.classList.add('hidden');
        this.elements.blindTouchArea.classList.remove('hidden');
        
        // 模拟盲点输入过程
        setTimeout(() => {
            this.simulateBlindInput();
        }, 2000);
    }
    
    // 计算校准数字
    calculateCalibrationNumber() {
        const currentTime = this.getCurrentTime();
        const numA = parseInt(this.audienceNumbers.A);
        const numB = parseInt(this.audienceNumbers.B);
        
        // 通过数学技巧确保结果为当前时间
        // 这里使用简化的版本：A + C - B = 当前时间
        // 所以 C = 当前时间 - A + B
        this.calibrationNumber = (currentTime - numA + numB).toString().padStart(6, '0');
        this.audienceNumbers.C = this.calibrationNumber;
    }
    
    // 模拟盲点输入
    simulateBlindInput() {
        let touchCount = 0;
        const targetTouches = 6; // 6位数字需要6次触摸
        
        const createTouch = () => {
            if (touchCount < targetTouches) {
                // 创建随机位置的触摸点
                const rect = this.elements.touchCanvas.getBoundingClientRect();
                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;
                
                this.createTouchEffect(x, y);
                
                // 显示随机的假数字
                const fakeDigit = Math.floor(Math.random() * 10);
                this.showFakeDigit(fakeDigit);
                
                touchCount++;
                
                // 继续下一次触摸
                setTimeout(createTouch, 600);
            } else {
                // 完成盲点输入
                setTimeout(() => {
                    this.elements.blindTouchArea.classList.add('hidden');
                    this.displayNumber('C', this.audienceNumbers.C);
                    setTimeout(() => this.showCalculation(), 1500);
                }, 1000);
            }
        };
        
        createTouch();
    }
    
    // 创建触摸效果
    createTouchEffect(x, y) {
        const touchPoint = document.createElement('div');
        touchPoint.className = 'touch-point';
        touchPoint.style.left = x + 'px';
        touchPoint.style.top = y + 'px';
        
        this.elements.touchPoints.appendChild(touchPoint);
        
        // 移除触摸点元素
        setTimeout(() => {
            touchPoint.remove();
        }, 1500);
    }
    
    // 显示假数字
    showFakeDigit(digit) {
        const tempDisplay = document.createElement('div');
        tempDisplay.className = 'blind-number-appear';
        tempDisplay.textContent = digit;
        tempDisplay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            font-weight: 700;
            color: white;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            z-index: 10;
        `;
        
        this.elements.touchCanvas.appendChild(tempDisplay);
        
        setTimeout(() => {
            tempDisplay.remove();
        }, 500);
    }
    
    // 显示计算过程
    showCalculation() {
        this.elements.magicStepText.textContent = '见证奇迹的时刻...';
        this.elements.magicCalculation.classList.remove('hidden');
        
        // 添加背景效果
        document.body.classList.add('background-flash');
        setTimeout(() => {
            document.body.classList.remove('background-flash');
        }, 300);
        
        // 播放音效
        if (window.playSound) {
            window.playSound(440, 0.2);
        }
        
        // 第一步：显示 A + C
        const step1 = document.getElementById('step-1');
        step1.classList.remove('hidden');
        
        // 使用特殊动画
        if (window.specialAnimations) {
            window.specialAnimations.rotateIn(step1);
        }
        
        this.elements.calcNumberA.textContent = this.audienceNumbers.A;
        this.elements.calcNumberC.textContent = this.audienceNumbers.C;
        this.elements.calcOp1.textContent = '+';
        this.elements.calcOp1.classList.add('operator-spin');
        
        // 震动反馈
        if (window.vibratePattern) {
            window.vibratePattern([100, 50, 100]);
        }
        
        setTimeout(() => {
            // 计算中间结果
            const tempResult = parseInt(this.audienceNumbers.A) + parseInt(this.audienceNumbers.C);
            
            // 第二步：显示 temp - B
            const step2 = document.getElementById('step-2');
            step2.classList.remove('hidden');
            
            if (window.specialAnimations) {
                window.specialAnimations.bounceIn(step2);
            }
            
            this.elements.tempResult.textContent = tempResult;
            this.elements.calcNumberB.textContent = this.audienceNumbers.B;
            this.elements.calcOp2.textContent = '-';
            this.elements.calcOp2.classList.add('operator-spin');
            
            // 播放音效
            if (window.playSound) {
                window.playSound(523, 0.2);
            }
            
            setTimeout(() => {
                // 第三步：显示最终结果
                const step3 = document.getElementById('step-3');
                step3.classList.remove('hidden');
                
                if (window.specialAnimations) {
                    window.specialAnimations.dramaticReveal(step3);
                }
                
                // 显示问号，然后揭示时间
                this.elements.finalResult.textContent = '????';
                this.elements.finalResult.classList.add('number-shake');
                
                // 增强背景效果
                document.querySelector('.magic-background').style.animation = 'backgroundFlash 1s ease-in-out';
                
                setTimeout(() => {
                    this.revealTime();
                }, 2000);
            }, 2000);
        }, 2000);
    }
    
    // 揭示时间
    revealTime() {
        const finalResult = this.getCurrentTime();
        
        // 播放震撼音效
        if (window.playSound) {
            window.playSound(262, 0.3);
            setTimeout(() => window.playSound(330, 0.3), 200);
            setTimeout(() => window.playSound(392, 0.3), 400);
            setTimeout(() => window.playSound(523, 0.5), 600);
        }
        
        // 震动反馈
        if (window.vibratePattern) {
            window.vibratePattern([200, 100, 200, 100, 200, 100, 500]);
        }
        
        // 显示最终数字
        this.elements.finalResult.textContent = finalResult.toString().padStart(4, '0');
        this.elements.finalResult.classList.remove('number-shake');
        this.elements.finalResult.classList.add('time-reveal-animation');
        
        // 创建闪光效果
        this.createRevealSparks();
        
        // 显示时间揭晓区域
        setTimeout(() => {
            this.elements.timeReveal.classList.remove('hidden');
            
            if (window.specialAnimations) {
                window.specialAnimations.dramaticReveal(this.elements.timeReveal);
            }
            
            const currentTime = new Date();
            const timeString = currentTime.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            this.elements.timeDisplay.textContent = timeString;
            this.elements.timeDisplay.classList.add('time-reveal-animation');
            
            // 创建闪光粒子
            this.createTimeParticles();
            
            // 显示重新开始按钮
            setTimeout(() => {
                this.elements.restartBtn.classList.remove('hidden');
                
                if (window.specialAnimations) {
                    window.specialAnimations.bounceIn(this.elements.restartBtn);
                }
            }, 1500);
        }, 1500);
    }
    
    // 创建揭晓时的火花效果
    createRevealSparks() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
        const sparkCount = 20;
        
        for (let i = 0; i < sparkCount; i++) {
            setTimeout(() => {
                const spark = document.createElement('div');
                spark.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    pointer-events: none;
                    z-index: 10000;
                    animation: sparkFly 1s ease-out forwards;
                    --random-x: ${(Math.random() - 0.5) * 400}px;
                    --random-y: ${(Math.random() - 0.5) * 400}px;
                `;
                
                document.body.appendChild(spark);
                
                setTimeout(() => {
                    spark.remove();
                }, 1000);
            }, i * 50);
        }
    }
    
    // 创建时间揭晓粒子效果
    createTimeParticles() {
        const particleCount = 30;
        const rect = this.elements.timeDisplay.getBoundingClientRect();
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #00b894;
                border-radius: 50%;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                pointer-events: none;
                z-index: 9999;
                animation: particleFloat 2s ease-out forwards;
                --random-x: ${(Math.random() - 0.5) * 200}px;
                --random-y: ${(Math.random() - 0.5) * 200}px;
                --delay: ${Math.random() * 0.5}s;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2500);
        }
    }
    
    // 获取当前时间
    getCurrentTime() {
        const now = new Date();
        return now.getHours() * 100 + now.getMinutes();
    }
    
    // 显示数字输入界面
    showNumberInput(prompt, callback) {
        this.elements.promptText.textContent = prompt;
        this.elements.inputPrompt.classList.remove('hidden');
        this.elements.magicInput.classList.remove('hidden');
        this.elements.submitBtn.classList.remove('hidden');
        this.elements.magicInput.value = '';
        this.elements.magicInput.focus();
        
        // 保存回调函数
        this.currentCallback = callback;
    }
    
    // 隐藏数字输入界面
    hideNumberInput() {
        this.elements.inputPrompt.classList.add('hidden');
        this.elements.magicInput.classList.add('hidden');
        this.elements.submitBtn.classList.add('hidden');
    }
    
    // 提交数字
    submitNumber() {
        if (this.currentCallback) {
            this.currentCallback();
        }
    }
    
    // 显示数字
    displayNumber(audience, number) {
        const elementId = `audience-${audience.toLowerCase()}-value`;
        const element = document.getElementById(elementId);
        element.textContent = number;
        element.parentElement.classList.add('fly-in');
        element.classList.add('number-roll');
    }
    
    // 验证6位数字
    validateSixDigit(input) {
        return /^\d{6}$/.test(input);
    }
    
    // 显示错误
    showError(message) {
        this.elements.magicInput.classList.add('error-shake');
        alert(message);
        setTimeout(() => {
            this.elements.magicInput.classList.remove('error-shake');
        }, 500);
    }
    
    // 重置魔术
    resetMagic() {
        this.isMagicMode = false;
        this.currentStep = 0;
        this.audienceNumbers = { A: '', B: '', C: '' };
        this.calibrationNumber = '';
        
        // 重置显示
        this.elements.normalMode.classList.remove('hidden');
        this.elements.magicMode.classList.add('hidden');
        this.elements.audienceAValue.textContent = '------';
        this.elements.baudienceBValue.textContent = '------';
        this.elements.audienceCValue.textContent = '------';
        this.elements.magicCalculation.classList.add('hidden');
        this.elements.timeReveal.classList.add('hidden');
        this.elements.restartBtn.classList.add('hidden');
        
        // 清空触摸点
        this.elements.touchPoints.innerHTML = '';
        
        // 移除所有动画类
        document.querySelectorAll('.fly-in, .operator-spin, .number-roll, .time-reveal-animation').forEach(el => {
            el.classList.remove('fly-in', 'operator-spin', 'number-roll', 'time-reveal-animation');
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检测是否支持触摸
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
    
    // 初始化魔术计算器
    window.magicCalculator = new MagicCalculator();
    
    // 添加一些全局动画效果
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });
    
    document.querySelectorAll('.audience-number').forEach(el => {
        observer.observe(el);
    });
});