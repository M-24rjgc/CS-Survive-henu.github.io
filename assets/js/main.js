// 河南大学计算机生存指北 - 主要交互脚本

document.addEventListener('DOMContentLoaded', function() {
    
    // 导航栏滚动效果
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // 移动端导航菜单切换
    function initMobileMenu() {
        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarMenu = document.querySelector('.navbar-menu');
        
        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener('click', function() {
                navbarToggle.classList.toggle('active');
                navbarMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // 点击菜单项关闭菜单
            const navbarItems = document.querySelectorAll('.navbar-item');
            navbarItems.forEach(item => {
                item.addEventListener('click', function() {
                    navbarToggle.classList.remove('active');
                    navbarMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });

            // 点击外部区域关闭菜单
            document.addEventListener('click', function(e) {
                if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
                    navbarToggle.classList.remove('active');
                    navbarMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }

    // 滚动显示动画
    function initScrollReveal() {
        const scrollElements = document.querySelectorAll('.scroll-reveal');
        
        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };

        const displayScrollElement = (element) => {
            element.classList.add('revealed');
        };

        const hideScrollElement = (element) => {
            element.classList.remove('revealed');
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                } else {
                    hideScrollElement(el);
                }
            });
        };

        window.addEventListener('scroll', () => {
            handleScrollAnimation();
        });

        // 初始检查
        handleScrollAnimation();
    }

    // 数字计数动画
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // 动画速度

        counters.forEach(counter => {
            const animate = () => {
                const value = +counter.getAttribute('data-target');
                const data = +counter.innerText;
                const time = value / speed;
                
                if (data < value) {
                    counter.innerText = Math.ceil(data + time);
                    setTimeout(animate, 1);
                } else {
                    counter.innerText = value;
                }
            };

            // 当元素进入视图时开始动画
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(counter);
        });
    }

    // 平滑滚动
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 70; // 70px for navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 卡片悬停效果增强
    function initCardEffects() {
        const cards = document.querySelectorAll('.feature-card, .guide-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // 按钮点击涟漪效果
    function initRippleEffect() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // 添加涟漪动画CSS
    function addRippleCSS() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 主题切换功能（预留）
    function initThemeToggle() {
        // 可以后续添加明暗主题切换功能
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // 页面加载进度条
    function initLoadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #6366f1);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 90) {
                clearInterval(interval);
                progress = 90;
            }
            progressBar.style.width = progress + '%';
        }, 100);

        window.addEventListener('load', () => {
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.remove();
            }, 300);
        });
    }

    // 错误处理
    function handleErrors() {
        window.addEventListener('error', function(e) {
            console.error('页面错误:', e.error);
        });
    }

    // 初始化所有功能
    function init() {
        try {
            initLoadingProgress();
            handleNavbarScroll();
            initMobileMenu();
            initScrollReveal();
            initCounters();
            initSmoothScroll();
            initCardEffects();
            initRippleEffect();
            addRippleCSS();
            initThemeToggle();
            handleErrors();

            // 绑定滚动事件
            window.addEventListener('scroll', handleNavbarScroll);

            // 页面加载完成后的动画
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);

            console.log('河南大学计算机生存指北 - 页面交互初始化完成 ✨');
        } catch (error) {
            console.error('初始化错误:', error);
        }
    }

    // 启动初始化
    init();
});

// 工具函数
const utils = {
    // 防抖函数
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // 节流函数
    throttle: function(func, limit) {
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
    },

    // 检查元素是否在视图中
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// 导出给全局使用
window.HENUCSUtils = utils;
