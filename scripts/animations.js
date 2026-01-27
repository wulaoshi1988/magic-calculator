// 魔术计算器动画效果管理器
class AnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.addGlobalAnimations();
        this.addIntersectionObserver();
        this.addPerformanceOptimizations();
    }
    
    // 添加全局动画效果
    addGlobalAnimations() {
        // 按钮悬停效果增强
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.addRippleEffect(e.target, e);
            });
        });
        
        // 页面加载动画
        this.addPageLoadAnimation();
        
        // 滚动动画
        this.addScrollAnimations();
    }
    
    // 添加涟漪效果 - 移动端优化
    addRippleEffect(button, event) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        // 支持触摸和鼠标事件
        let clientX, clientY;
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        const x = clientX - rect.left - size / 2;
        const y = clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // 页面加载动画
    addPageLoadAnimation() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // 标题动画
            const header = document.querySelector('#header');
            if (header) {
                header.style.opacity = '0';
                header.style.transform = 'translateY(-30px)';
                setTimeout(() => {
                    header.style.transition = 'all 0.8s ease-out';
                    header.style.opacity = '1';
                    header.style.transform = 'translateY(0)';
                }, 100);
            }
            
            // 计算器动画
            const calculator = document.querySelector('.calculator');
            if (calculator) {
                calculator.style.opacity = '0';
                calculator.style.transform = 'scale(0.8) translateY(20px)';
                setTimeout(() => {
                    calculator.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    calculator.style.opacity = '1';
                    calculator.style.transform = 'scale(1) translateY(0)';
                }, 300);
            }
        });
    }
    
    // 滚动动画
    addScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimation = () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.stars');
            
            if (parallax) {
                const speed = 0.5;
                parallax.style.transform = `translateY(${scrolled * speed}px)`;
            }
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimation);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
    }
    
    // 交叉观察器动画
    addIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // 为不同元素添加不同动画
                    if (entry.target.classList.contains('audience-number')) {
                        entry.target.style.animation = 'flyIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    } else if (entry.target.classList.contains('step')) {
                        entry.target.style.animation = 'stepFadeIn 1s ease-out';
                    }
                    
                    // 动画完成后移除观察
                    setTimeout(() => {
                        observer.unobserve(entry.target);
                    }, 1000);
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        document.querySelectorAll('.audience-number, .step, .magic-result').forEach(el => {
            observer.observe(el);
        });
    }
    
    // 性能优化
    addPerformanceOptimizations() {
        // 防抖函数
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        
        // 节流函数
        const throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
        
        // 优化滚动事件
        window.addEventListener('scroll', throttle(() => {
            // 滚动相关的优化处理
        }, 16)); // 约60fps
        
        // 优化窗口大小改变事件
        window.addEventListener('resize', debounce(() => {
            // 窗口大小改变的处理
        }, 250));
    }
    
    // 魔术特效增强
    addMagicEffects() {
        // 闪光效果
        this.createSparkleEffect();
        
        // 音效触发器（可选）
        this.addSoundEffects();
        
        // 震动反馈（移动端）
        this.addVibrationFeedback();
    }
    
    // 创建闪光效果
    createSparkleEffect() {
        const createSparkle = () => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: sparkle 2s ease-out forwards;
            `;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 2000);
        };
        
        // 在魔术模式期间随机创建闪光
        const sparkleInterval = setInterval(() => {
            if (window.magicCalculator && window.magicCalculator.isMagicMode) {
                createSparkle();
            } else {
                clearInterval(sparkleInterval);
            }
        }, 300);
    }
    
    // 音效支持
    addSoundEffects() {
        // 创建音效上下文（如果需要）
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // 播放音效的方法
        window.playSound = (frequency, duration) => {
            if (!window.audioContext) return;
            
            const oscillator = window.audioContext.createOscillator();
            const gainNode = window.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(window.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, window.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + duration);
            
            oscillator.start(window.audioContext.currentTime);
            oscillator.stop(window.audioContext.currentTime + duration);
        };
    }
    
    // 震动反馈
    addVibrationFeedback() {
        if ('vibrate' in navigator) {
            // 在关键动作时提供震动反馈
            window.vibratePattern = (pattern) => {
                navigator.vibrate(pattern);
            };
        }
    }
}

// 特殊动画CSS类
const specialAnimations = {
    // 震撼效果
    dramaticReveal: (element) => {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'dramaticReveal 2s ease-out forwards';
        }, 10);
    },
    
    // 旋转进入
    rotateIn: (element) => {
        element.style.animation = 'rotateIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    },
    
    // 弹跳进入
    bounceIn: (element) => {
        element.style.animation = 'bounceIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    },
    
    // 渐变消失
    fadeScaleOut: (element) => {
        element.style.animation = 'fadeScaleOut 0.8s ease-out forwards';
    }
};

// 添加特殊的CSS动画到页面
const specialAnimationCSS = `
@keyframes dramaticReveal {
    0% {
        transform: scale(0) rotate(720deg);
        opacity: 0;
    }
    50% {
        transform: scale(1.2) rotate(360deg);
        opacity: 1;
    }
    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

@keyframes rotateIn {
    0% {
        transform: rotate(-360deg) scale(0);
        opacity: 0;
    }
    100% {
        transform: rotate(0) scale(1);
        opacity: 1;
    }
}

@keyframes bounceIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes fadeScaleOut {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(1.5);
        opacity: 0;
    }
}

@keyframes sparkle {
    0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
    }
    50% {
        transform: scale(1.5) rotate(180deg);
        opacity: 1;
    }
    100% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
    }
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.loaded {
    overflow-x: hidden;
}

.animate-in {
    opacity: 1;
    transform: translate3d(0, 0, 0);
}
`;

// 添加CSS到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = specialAnimationCSS;
document.head.appendChild(styleSheet);

// 页面加载完成后初始化动画管理器
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
    
    // 暴露特殊动画方法
    window.specialAnimations = specialAnimations;
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationManager, specialAnimations };
}