// Nasvodili Wrapped 2025 - Interactive JavaScript

class WrappedPresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.stats = null;
        this.fullSummary = null;
        this.charts = {};
        this.isTransitioning = false;
        this.WING_PRICE = 240000;
        this.currentLeaderboardType = 'messages';

        this.init();
    }

    async init() {
        await this.loadStats();
        await this.loadFullSummary();
        this.setupNavigation();
        this.setupLeaderboardSwitchers();
        this.populateData();
        this.createCharts();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
    }

    async loadStats() {
        // Завжди намагаємось взяти свіжі дані з API/файлу; якщо недоступні — fallback на вбудовані
        try {
            const response = await fetch('wrapped_stats.json', { cache: 'no-cache' });
            if (!response.ok) throw new Error('wrapped_stats.json not ok');
            this.stats = await response.json();
            return;
        } catch (error) {
            console.warn('Не вдалося завантажити wrapped_stats.json, fallback на window.WRAPPED_STATS або тестові дані', error);
        }

        if (window.WRAPPED_STATS) {
            this.stats = window.WRAPPED_STATS;
            return;
        }

        this.stats = this.getTestData();
    }

    async loadFullSummary() {
        if (window.FULL_CHAT_SUMMARY) {
            this.fullSummary = window.FULL_CHAT_SUMMARY;
            return;
        }
        try {
            const response = await fetch('full_chat_summary.json', { cache: 'no-cache' });
            this.fullSummary = await response.json();
        } catch (error) {
            console.warn('Не вдалося завантажити full_chat_summary.json', error);
            this.fullSummary = [];
        }
    }

    addMonthInsights() {
        const insightsEl = document.getElementById('month-insights');
        if (!insightsEl || !this.stats.messages_by_month) return;

        const months = this.stats.messages_by_month;
        const monthNames = {
            '01': 'Січень', '02': 'Лютий', '03': 'Березень', '04': 'Квітень',
            '05': 'Травень', '06': 'Червень', '07': 'Липень', '08': 'Серпень',
            '09': 'Вересень', '10': 'Жовтень', '11': 'Листопад', '12': 'Грудень'
        };

        let minMonth = null, minCount = Infinity;
        let maxMonth = null, maxCount = 0;

        for (const [month, count] of Object.entries(months)) {
            if (count < minCount) {
                minCount = count;
                minMonth = month;
            }
            if (count > maxCount) {
                maxCount = count;
                maxMonth = month;
            }
        }

        if (minMonth && maxMonth) {
            const minMonthName = monthNames[minMonth.split('-')[1]];
            const maxMonthName = monthNames[maxMonth.split('-')[1]];

            insightsEl.innerHTML = `
                <div class="insight-item insight-quiet">
                    <span class="insight-icon">🤫</span>
                    <div class="insight-text">
                        <div class="insight-label">Найтихіший місяць</div>
                        <div class="insight-value">${minMonthName} — ${minCount.toLocaleString('uk-UA')} повідомлень</div>
                    </div>
                </div>
                <div class="insight-item insight-active">
                    <span class="insight-icon">🔥</span>
                    <div class="insight-text">
                        <div class="insight-label">Найактивніший місяць</div>
                        <div class="insight-value">${maxMonthName} — ${maxCount.toLocaleString('uk-UA')} повідомлень</div>
                    </div>
                </div>
            `;
        }
    }

    plural(n, one, few, many) {
        const mod10 = n % 10;
        const mod100 = n % 100;
        if (mod10 === 1 && mod100 !== 11) return one;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
        return many;
    }

    getInitials(name) {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    getUserColor(name) {
        if (!name) return '#1db954';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
        ];
        return colors[Math.abs(hash) % colors.length];
    }

    getTestData() {
        return {
            total_messages: 25634,
            total_words: 279080,
            total_chars: 1500000,
            users: {},
            top_users: [
                { name: 'Unknown', messages: 6974, words: 50000, reactions: 1200 },
                { name: 'danyl vindiuk', messages: 2285, words: 35000, reactions: 850 },
                { name: 'Vladimir', messages: 2097, words: 28000, reactions: 720 }
            ],
            most_active_day: { date: '2025-01-15', count: 342 },
            most_active_hour: { hour: 22, count: 2450 },
            media_count: 352,
            top_emojis: [
                ['🔥', 245], ['😂', 198], ['❤️', 167],
                ['👍', 145], ['🎵', 132], ['💪', 98],
                ['😎', 87], ['🎧', 76], ['✨', 65]
            ],
            top_reactions: [
                ['❤', 1250], ['🔥', 890], ['👍', 567],
                ['😂', 445], ['👏', 334], ['💯', 278]
            ],
            longest_message: {
                text: 'Це було найдовше повідомлення в чаті...',
                author: 'danyl vindiuk',
                length: 1234
            },
            most_reacted_message: {
                text: 'Найбільш реаговане повідомлення...',
                author: 'Vladimir',
                reactions: 45
            },
            messages_by_month: {
                '2025-01': 3200,
                '2025-02': 2800,
                '2025-03': 3100,
                '2025-04': 2950,
                '2025-05': 3300,
                '2025-06': 2700,
                '2025-07': 2600,
                '2025-08': 2900,
                '2025-09': 3050,
                '2025-10': 2850,
                '2025-11': 2950,
                '2025-12': 3234
            },
            messages_by_hour: {}
        };
    }

    getTotalChars() {
        if (this.stats?.total_chars) return this.stats.total_chars;
        if (this.stats?.users) {
            return Object.values(this.stats.users).reduce((sum, user) => sum + (user.total_chars || 0), 0);
        }
        return 0;
    }

    calculateWingCount(totalChars) {
        if (!this.WING_PRICE) return 0;
        return totalChars / this.WING_PRICE;
    }

    formatWingCount(wings) {
        if (wings >= 100) return wings.toFixed(0);
        if (wings >= 10) return wings.toFixed(1);
        return wings.toFixed(2);
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressDots = document.getElementById('progress-dots');

        if (!progressDots) return;

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === 0) dot.classList.add('active');
            // Click + touch for mobile reliability
            const go = () => this.goToSlide(i);
            dot.addEventListener('click', go);
            dot.addEventListener('touchend', go, { passive: true });
            progressDots.appendChild(dot);
        }

        const prevHandler = () => this.previousSlide();
        const nextHandler = () => this.nextSlide();

        if (prevBtn) {
            prevBtn.addEventListener('click', prevHandler);
            prevBtn.addEventListener('touchend', prevHandler, { passive: true });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', nextHandler);
            nextBtn.addEventListener('touchend', nextHandler, { passive: true });
        }

        this.updateNavigationButtons();
    }

    setupLeaderboardSwitchers() {
        const buttons = document.querySelectorAll('.switch-btn');

        const applyIndex = (idx) => {
            const btn = buttons[idx];
            if (!btn) return;
            const type = btn.dataset.type;
            if (!type || type === this.currentLeaderboardType) return;

            this.currentLeaderboardType = type;
            buttons.forEach(b => b.classList.toggle('active', b === btn));
            this.populateTopUsersUnified();
        };

        buttons.forEach((btn, idx) => {
            btn.addEventListener('click', () => applyIndex(idx));
        });
    }

    getTopUsersByType(type = 'messages') {
        const resolveMetric = (user) => {
            if (type === 'words') return user.words || user.total_words || 0;
            return user.messages || user.message_count || 0;
        };

        let list = [];
        if (this.stats?.top_users?.length) {
            list = [...this.stats.top_users].map(u => ({
                name: u.name,
                messages: u.messages || u.message_count || 0,
                words: u.words || u.total_words || 0
            }));
        } else if (this.stats?.users) {
            list = Object.entries(this.stats.users).map(([name, data]) => ({
                name,
                messages: data.message_count || 0,
                words: data.total_words || 0
            }));
        }

        return list.sort((a, b) => resolveMetric(b) - resolveMetric(a));
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            }
        });
    }

    setupTouchNavigation() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isSwiping = false;

        const wrapper = document.querySelector('.wrapper');

        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
            touchStartTime = Date.now();
            isSwiping = true;
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            
            const touchX = e.changedTouches[0].clientX;
            const touchY = e.changedTouches[0].clientY;
            const diffX = Math.abs(touchX - touchStartX);
            const diffY = Math.abs(touchY - touchStartY);
            
            // If vertical movement is dominant, cancel swipe detection
            if (diffY > diffX && diffY > 10) {
                isSwiping = false;
            }
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            
            this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY, touchEndTime - touchStartTime);
            isSwiping = false;
        }, { passive: true });
    }

    handleSwipe(startX, endX, startY, endY, duration) {
        const diffX = startX - endX;
        const diffY = startY - endY;
        const absDiffX = Math.abs(diffX);
        const absDiffY = Math.abs(diffY);

        // Require: horizontal movement > 60px, more horizontal than vertical (ratio 1.5:1),
        // and duration < 500ms for a deliberate swipe
        if (absDiffX > 60 && absDiffX > absDiffY * 1.5 && duration < 500) {
            if (diffX > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        if (this.isTransitioning) return;
        if (index === this.currentSlide) return;

        this.isTransitioning = true;

        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.progress-dot');
        const currentSlideEl = slides[this.currentSlide];
        const nextSlideEl = slides[index];

        if (!currentSlideEl || !nextSlideEl) {
            this.isTransitioning = false;
            return;
        }

        // Update dots immediately for better responsiveness
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        if (index > this.currentSlide) {
            currentSlideEl.classList.add('exit-left');
            nextSlideEl.classList.add('enter-right');
        } else {
            currentSlideEl.classList.add('exit-right');
            nextSlideEl.classList.add('enter-left');
        }

        const previousSlide = this.currentSlide;
        this.currentSlide = index;
        this.updateNavigationButtons();
        this.updateProgressBar();

        setTimeout(() => {
            slides[previousSlide].classList.remove('active', 'exit-left', 'exit-right');
            nextSlideEl.classList.remove('enter-left', 'enter-right');
            nextSlideEl.classList.add('active');
            
            this.isTransitioning = false;
        }, 600);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
        if (nextBtn) nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        if (!progressFill) return;
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
    }

    populateData() {
        const totalChars = this.getTotalChars();
        const wingCount = this.calculateWingCount(totalChars);

        this.decorateIntroSlide(); // Premium decorations enabled
        this.addFloatingMessages(); // New: Add floating messages to slide 3
        this.addFloatingWords(); // New: Add floating words to slide 4
        this.addChernivtsiSlideshow(); // New: Add Chernivtsi slideshow to slide 5
        this.addMostActiveDayMessages(); // New: Add floating messages to most active day slide
        this.populateSrachsAnalysis(); // New: Add srachs analysis
        this.populateFullSummary(); // New: GPT monthly summaries
        this.animateNumber('total-messages', 0, this.stats.total_messages || 0, 2000);
        this.animateNumber('total-words', 0, this.stats.total_words || 0, 2000);
        this.animateNumber('total-chars', 0, totalChars, 2000);
        this.animateNumber('media-count', 0, this.stats.media_count || 0, 2000);

        const wingEquivalentEl = document.getElementById('wing-equivalent');
        if (wingEquivalentEl) {
            const formattedWingCount = this.formatWingCount(wingCount);
            const wingPrice = this.WING_PRICE.toLocaleString('uk-UA');
            wingEquivalentEl.textContent = `≈ ${formattedWingCount} пультів Behringer Wing, якби кожен символ був гривнею (орієнтовно ${wingPrice}₴ за пульт)`;
        }

        this.populateTopUsersUnified();
        this.populateTopStickers();

        if (this.stats.most_active_day && this.stats.most_active_day.date) {
            const date = new Date(this.stats.most_active_day.date);
            const formatted = date.toLocaleDateString('uk-UA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            const dayEl = document.getElementById('most-active-day');
            const countEl = document.getElementById('most-active-day-count');
            if (dayEl) dayEl.textContent = formatted;
            if (countEl) countEl.textContent = `${this.stats.most_active_day.count} повідомлень`;
        }

        if (this.stats.most_active_hour) {
            const hourEl = document.getElementById('most-active-hour');
            if (hourEl) hourEl.textContent = `${this.stats.most_active_hour.hour}:00`;
        }

        this.populateTopEmojis();
        this.populateTopReactions();

        if (this.stats.longest_message) {
            const msgEl = document.getElementById('longest-message');
            const authorEl = document.getElementById('longest-author');
            const statsEl = document.getElementById('longest-message-stats');
            const avatarEl = document.getElementById('longest-avatar');
            
            if (msgEl) {
                const html = this.stats.longest_message.html;
                const text = this.stats.longest_message.text;
                msgEl.innerHTML = html || (text || '').replace(/\n/g, '<br>');
            }
            
            if (statsEl && this.stats.longest_message.text) {
                const text = this.stats.longest_message.text;
                const words = text.split(/\s+/).filter(w => w.length > 0).length;
                const chars = text.length;
                statsEl.textContent = `${words.toLocaleString('uk-UA')} слів, ${chars.toLocaleString('uk-UA')} символів`;
            }
            
            if (avatarEl && this.stats.longest_message.author) {
                const author = this.stats.longest_message.author;
                const initials = this.getInitials(author);
                avatarEl.textContent = initials;
                avatarEl.style.background = this.getUserColor(author);
            }
            
            if (authorEl) authorEl.textContent = `— ${this.stats.longest_message.author}`;
        }

        if (this.stats.most_reacted_message) {
            const msgEl = document.getElementById('most-reacted-message');
            const authorEl = document.getElementById('reacted-author');
            const avatarEl = document.getElementById('reacted-avatar');
            const reactionsEl = document.getElementById('reactions-display');
            
            if (msgEl) msgEl.textContent = this.stats.most_reacted_message.text;
            
            if (avatarEl && this.stats.most_reacted_message.author) {
                const author = this.stats.most_reacted_message.author;
                const initials = this.getInitials(author);
                avatarEl.textContent = initials;
                avatarEl.style.background = this.getUserColor(author);
            }
            
            if (authorEl) authorEl.textContent = `— ${this.stats.most_reacted_message.author}`;
            
            if (reactionsEl && this.stats.most_reacted_message.reactions_details) {
                const reactions = this.stats.most_reacted_message.reactions_details;
                const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);
                
                reactionsEl.innerHTML = `
                    <div class="reactions-header">
                        <span class="reactions-total">${totalReactions} ${this.plural(totalReactions, 'реакція', 'реакції', 'реакцій')}</span>
                    </div>
                    <div class="reactions-list">
                        ${reactions.map(r => `
                            <div class="reaction-badge">
                                <span class="reaction-emoji">${r.emoji}</span>
                                <span class="reaction-count">${r.count}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
    }

    animateNumber(elementId, start, end, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString('uk-UA');
        }, 16);
    }

    populateTopUsersUnified() {
        const container = document.getElementById('top-users-unified');
        if (!container) return;

        const list = this.getTopUsersByType(this.currentLeaderboardType).slice(0, 30);
        container.innerHTML = '';

        list.forEach((user, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.style.setProperty('--delay', index);

            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            const metricValue = this.currentLeaderboardType === 'words' ? (user.words || 0) : (user.messages || 0);

            item.innerHTML = `
                <div class="leaderboard-rank">${medal}</div>
                <div class="leaderboard-name">${user.name}</div>
                <div class="leaderboard-count">${metricValue.toLocaleString('uk-UA')}</div>
            `;

            container.appendChild(item);
        });
    }
    addChernivtsiSlideshow() {
        const container = document.getElementById('chernivtsi-slideshow');
        if (!container) return;

        container.innerHTML = '';
        const img = document.createElement('img');
        img.src = 'wing.png';
        img.alt = 'Wing';
        container.appendChild(img);
    }

    addFloatingWords() {
        const container = document.getElementById('words-floating');
        if (!container) return;

        // Music and life related words from the chat (Ukrainian)
        const words = [
            'звук', 'мікс', 'басс', 'вокал', 'барабани', 'гітара',
            'музика', 'трек', 'мастерінг', 'запис', 'студія', 'монітор',
            'компресор', 'еквалайзер', 'реверб', 'дилей', 'плагін',
            'частота', 'децибел', 'динаміка', 'панорама', 'стерео',
            'мікрофон', 'консоль', 'DAW', 'синтезатор', 'семпл',
            'луп', 'драм', 'бас', 'снейр', 'кік', 'хет',
            'мелодія', 'ритм', 'темп', 'метроном', 'біт',
            'акустика', 'кабель', 'інтерфейс', 'монітори', 'наушники',
            'концерт', 'живий', 'звучання', 'баланс', 'громкість'
        ];

        // Create 20-25 floating words
        const wordCount = 20 + Math.floor(Math.random() * 6);
        
        for (let i = 0; i < wordCount; i++) {
            const word = words[Math.floor(Math.random() * words.length)];
            
            const element = document.createElement('div');
            element.className = 'floating-word';
            element.textContent = word;
            
            // Random positioning and animation
            const left = 5 + Math.random() * 85; // 5% to 90%
            const delay = Math.random() * 10;
            const duration = 10 + Math.random() * 6; // 10-16s
            const driftX = -40 + Math.random() * 80; // -40px to 40px
            const rotate = -15 + Math.random() * 30; // -15deg to 15deg
            const opacity = 0.4 + Math.random() * 0.4; // 0.4 to 0.8
            
            element.style.left = left + '%';
            element.style.animationDelay = delay + 's';
            element.style.animationDuration = duration + 's';
            element.style.setProperty('--drift-x', driftX + 'px');
            element.style.setProperty('--rotate', rotate + 'deg');
            element.style.opacity = opacity;
            
            container.appendChild(element);
        }
    }

    addMostActiveDayMessages() {
        const container = document.getElementById('most-day-messages');
        if (!container) return;

        // Real messages sampled from 28 August 2025 (most active day)
        const sampleMessages = [
            { author: 'Sergi', text: 'Хлопці це що таке?' },
            { author: 'Sergi', text: 'Де їхні треки? Раз вони так шарять?🧐' },
            { author: 'Vladimir', text: 'Дізнаєшся скоро 😉' },
            { author: 'danyl vindiuk', text: 'Харьків' },
            { author: 'Taras', text: '5 трек добре звучить) там стерео бас' },
            { author: 'Taras', text: '1 теж добрий так? @danyvin' },
            { author: 'danyl vindiuk', text: 'непоганий' },
            { author: 'Vladimir', text: 'Буде битва стилів 💁🏼‍♂️' },
            { author: 'Igor', text: 'Голосую за 4 за мощний перегруз на початку' },
            { author: 'Taras', text: 'просто зʼявилася партія клавіш якої не було' },
            { author: 'Taras', text: 'а ще переможців не судять ж )' },
            { author: 'Taras', text: 'жартуєш? )' },
            { author: 'Taras', text: 'тут клавіші ці послухай )' },
            { author: 'Taras', text: 'а куди пропало повідомлення ) ахаха' },
            { author: 'Taras', text: 'швидко качай і слухай)' },
            { author: 'Taras', text: '@danyvin добре то я жартую )' },
            { author: 'Taras', text: 'але погодься підловив добре )' },
            { author: 'Vladimir', text: 'Тут більшість класно вийшли, складно зіпсувати' },
            { author: 'Vladimir', text: 'Скоро буде оновлення, тримайтесь' },
            { author: 'Vladimir', text: 'Чекаю відгуків' }
        ];

        const count = 14 + Math.floor(Math.random() * 5); // 14-18 bubbles
        for (let i = 0; i < count; i++) {
            const msg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

            const el = document.createElement('div');
            el.className = 'day-floating-message';

            const authorEl = document.createElement('div');
            authorEl.className = 'floating-message-author';
            authorEl.textContent = msg.author;

            const textEl = document.createElement('div');
            textEl.textContent = msg.text;

            el.appendChild(authorEl);
            el.appendChild(textEl);

            const left = 5 + Math.random() * 85;
            const delay = Math.random() * 8;
            const duration = 9 + Math.random() * 5; // 9-14s
            const driftX = -30 + Math.random() * 60;
            const rotate = -8 + Math.random() * 16;
            const opacity = 0.45 + Math.random() * 0.35;

            el.style.left = left + '%';
            el.style.animationDelay = delay + 's';
            el.style.animationDuration = duration + 's';
            el.style.setProperty('--drift-x', driftX + 'px');
            el.style.setProperty('--rotate', rotate + 'deg');
            el.style.opacity = opacity;

            container.appendChild(el);
        }
    }
    addFloatingMessages() {
        const container = document.getElementById('messages-floating');
        if (!container) return;

        // Sample messages from different users (in real scenario, would extract from HTML)
        const sampleMessages = [
            { author: 'danyl vindiuk', text: 'Звучить круто!' },
            { author: 'Vladimir', text: 'Треба послухати' },
            { author: 'Max Jabotinskiy', text: 'Це точно працює?' },
            { author: 'Kostya Savitskiy', text: 'Гарна ідея' },
            { author: 'Serhii Pronin', text: 'Погоджуюсь' },
            { author: 'Igor', text: 'Дякую!' },
            { author: 'Taras', text: 'Коли зустрічаємось?' },
            { author: 'R M', text: 'Підтримую' },
            { author: 'David Butryk', text: 'Класно звучить' },
            { author: 'Дмитро Джуган', text: 'Зробив' },
            { author: 'Vitaliy', text: 'Чудово!' },
            { author: 'Sergij', text: 'А можна інакше?' },
            { author: '♫ Володимир', text: 'Спробую' },
            { author: 'Олександр Дубовик', text: 'Точно так' },
            { author: 'Tim Stepanyuk', text: 'Цікаво' }
        ];

        // Create 12-15 floating messages
        const messageCount = 12 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < messageCount; i++) {
            const message = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
            
            const element = document.createElement('div');
            element.className = 'floating-message';
            
            const author = document.createElement('div');
            author.className = 'floating-message-author';
            author.textContent = message.author;
            
            const text = document.createTextNode(message.text);
            
            element.appendChild(author);
            element.appendChild(text);
            
            // Random positioning and animation
            const left = 5 + Math.random() * 85; // 5% to 90%
            const delay = Math.random() * 8;
            const duration = 8 + Math.random() * 4; // 8-12s
            const driftX = -30 + Math.random() * 60; // -30px to 30px
            const rotate = -10 + Math.random() * 20; // -10deg to 10deg
            
            element.style.left = left + '%';
            element.style.animationDelay = delay + 's';
            element.style.animationDuration = duration + 's';
            element.style.setProperty('--drift-x', driftX + 'px');
            element.style.setProperty('--rotate', rotate + 'deg');
            
            container.appendChild(element);
        }
    }

    decorateIntroSlide() {
        const container = document.getElementById('intro-decorations');
        if (!container) return;

        // Get data for decorations
        const stickers = this.stats.top_stickers || [];
        const emojis = this.stats.top_emojis || [];
        const users = this.getTopUsersByType('messages').slice(0, 10);

        // Create spectacular decorative elements
        const decorations = [];
        
        // Add random stickers (15 - rich coverage)
        const stickerCount = Math.min(15, stickers.length);
        for (let i = 0; i < stickerCount; i++) {
            const randomIndex = Math.floor(Math.random() * stickers.length);
            const sticker = stickers[randomIndex];
            decorations.push({
                type: 'sticker',
                src: sticker.path
            });
        }

        // Add vibrant emojis (5-7)
        for (let i = 0; i < Math.min(6, emojis.length); i++) {
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            decorations.push({
                type: 'emoji',
                content: emoji[0]
            });
        }

        // Add random emojis (8-10)
        for (let i = 0; i < Math.min(10, emojis.length); i++) {
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            decorations.push({
                type: 'emoji',
                content: emoji[0]
            });
        }

        // Add user avatars (5) - use emoji as placeholders since we don't have real avatars
        const avatarEmojis = ['👤', '👨', '👩', '🧑', '👥', '👨‍💻', '👩‍💻', '🧑‍💻'];
        for (let i = 0; i < Math.min(5, users.length); i++) {
            decorations.push({
                type: 'avatar',
                content: avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)]
            });
        }

        // Shuffle and place decorations
        decorations.sort(() => Math.random() - 0.5);

        decorations.forEach((decoration, index) => {
            const element = document.createElement('div');
            element.className = `intro-decoration ${decoration.type}`;
            
            // Spectacular positioning and timing
            const left = -5 + Math.random() * 110; // Allow slight overflow
            const size = 0.6 + Math.random() * 0.6; // 0.6 to 1.2 - varied sizes
            const delay = Math.random() * 5; // 0-5s dynamic spacing
            const duration = 10 + Math.random() * 6; // 10-16s - varied speeds
            const driftX = -40 + Math.random() * 80; // -40 to 40px - more drift
            const rotate = -15 + Math.random() * 30; // -15 to 15deg - subtle rotation
            
            element.style.left = left + '%';
            element.style.top = Math.random() * 100 + '%';
            element.style.animationDelay = delay + 's';
            element.style.animationDuration = duration + 's';
            element.style.setProperty('--drift-x', driftX + 'px');
            element.style.setProperty('--rotate-deg', rotate + 'deg');
            element.style.transform = `scale(${size})`;
            
            if (decoration.type === 'sticker') {
                const img = document.createElement('img');
                img.src = decoration.src;
                img.alt = 'sticker';
                img.loading = 'lazy';
                img.onerror = () => {
                    element.style.display = 'none'; // Hide if sticker fails to load
                };
                element.appendChild(img);
            } else if (decoration.type === 'avatar') {
                // For avatars, create a circular emoji container
                const avatar = document.createElement('div');
                avatar.style.width = '100%';
                avatar.style.height = '100%';
                avatar.style.display = 'flex';
                avatar.style.alignItems = 'center';
                avatar.style.justifyContent = 'center';
                avatar.style.fontSize = 'clamp(1.2rem, 3vw, 2rem)';
                avatar.style.background = 'rgba(30, 215, 96, 0.15)';
                avatar.style.borderRadius = '50%';
                avatar.textContent = decoration.content;
                element.appendChild(avatar);
            } else {
                element.textContent = decoration.content;
            }
            
            container.appendChild(element);
        });
    }

    async populateTopStickers() {
        const champion = document.getElementById('stickers-champion');
        const runners = document.getElementById('stickers-runners');
        const grid = document.getElementById('stickers-grid');
        const particles = document.getElementById('stickers-particles');

        if (!champion || !runners || !grid) return;

        const stickers = (this.stats.top_stickers || []).filter(s => 
            s.path && !s.path.endsWith('.tgs')
        );
        
        if (stickers.length === 0) {
            champion.innerHTML = '<p style="color: rgba(255,255,255,0.5); font-size: 0.9rem;">Немає даних про стікери</p>';
            return;
        }

        // Create floating particles
        if (particles) {
            const particleEmojis = ['✨', '⭐', '💫', '🌟', '⚡'];
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'sticker-particle';
                particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (10 + Math.random() * 4) + 's';
                particle.style.setProperty('--drift-x', `${-30 + Math.random() * 60}px`);
                particles.appendChild(particle);
            }
        }

        // Sticker zoom modal functionality
        const createStickerZoomModal = () => {
            let modal = document.getElementById('sticker-zoom-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'sticker-zoom-modal';
                modal.className = 'sticker-zoom-modal';
                modal.innerHTML = '<img src="" alt="zoomed sticker" class="zoomed-sticker">';
                document.body.appendChild(modal);
                
                modal.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
            }
            return modal;
        };

        const zoomSticker = (imgSrc) => {
            const modal = createStickerZoomModal();
            const zoomedImg = modal.querySelector('.zoomed-sticker');
            zoomedImg.src = imgSrc;
            modal.classList.add('active');
        };

        // Helper to create sticker image with proper error handling
        const createStickerImg = (path, className, size) => {
            const wrapper = document.createElement('div');
            wrapper.className = className + '-wrapper';
            wrapper.style.cssText = 'display: flex; align-items: center; justify-content: center;';
            
            const img = document.createElement('img');
            // Properly encode path for URL (spaces and special characters)
            const encodedPath = encodeURI(path);
            img.src = encodedPath;
            img.alt = 'sticker';
            img.className = className;
            img.loading = 'eager'; // Load immediately for visible stickers
            img.decoding = 'async';
            if (size) {
                img.style.width = size + 'px';
                img.style.height = size + 'px';
            }
            
            // Add click to zoom
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                zoomSticker(encodedPath);
            });
            
            img.onload = () => {
                img.style.opacity = '1';
            };
            
            img.onerror = () => {
                console.warn('Failed to load sticker:', path);
                // Show placeholder emoji
                const placeholder = document.createElement('div');
                placeholder.className = className;
                placeholder.textContent = '🎵';
                placeholder.style.cssText = `
                    display: flex; align-items: center; justify-content: center;
                    font-size: ${size ? size * 0.6 + 'px' : '3rem'};
                    opacity: 0.5;
                `;
                img.replaceWith(placeholder);
            };
            
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            return img;
        };

        // Champion (#1)
        if (stickers[0]) {
            const card = document.createElement('div');
            card.className = 'champion-card';
            
            const crown = document.createElement('div');
            crown.className = 'champion-crown';
            crown.textContent = '👑';
            
            const stickerImg = createStickerImg(stickers[0].path, 'champion-sticker');
            
            const count = document.createElement('div');
            count.className = 'champion-count';
            count.textContent = stickers[0].count + '×';
            
            const label = document.createElement('div');
            label.className = 'champion-label';
            label.textContent = 'Використань';
            
            card.appendChild(crown);
            card.appendChild(stickerImg);
            card.appendChild(count);
            card.appendChild(label);
            champion.appendChild(card);
        }

        // Runners-up (#2 and #3)
        runners.innerHTML = '';
        const medals = ['🥈', '🥉'];
        stickers.slice(1, 3).forEach((sticker, idx) => {
            const card = document.createElement('div');
            card.className = 'runner-card';
            card.style.setProperty('--delay', idx + 1);
            
            const medal = document.createElement('div');
            medal.className = 'runner-medal';
            medal.textContent = medals[idx];
            
            const stickerImg = createStickerImg(sticker.path, 'runner-sticker');
            
            const count = document.createElement('div');
            count.className = 'runner-count';
            count.textContent = sticker.count + '×';
            
            const label = document.createElement('div');
            label.className = 'runner-label';
            label.textContent = 'Використань';
            
            card.appendChild(medal);
            card.appendChild(stickerImg);
            card.appendChild(count);
            card.appendChild(label);
            runners.appendChild(card);
        });

        // Grid (rest of stickers)
        grid.innerHTML = '';
        stickers.slice(3, 13).forEach((sticker, idx) => {
            const card = document.createElement('div');
            card.className = 'grid-card';
            card.style.setProperty('--delay', idx);
            
            const rank = document.createElement('div');
            rank.className = 'grid-rank';
            rank.textContent = '#' + (idx + 4);
            
            const stickerImg = createStickerImg(sticker.path, 'grid-sticker');
            
            const count = document.createElement('div');
            count.className = 'grid-count';
            count.textContent = sticker.count + '×';
            
            card.appendChild(rank);
            card.appendChild(stickerImg);
            card.appendChild(count);
            grid.appendChild(card);
        });
    }

    populateTopEmojis() {
        const container = document.getElementById('top-emojis');
        if (!container || !this.stats.top_emojis) return;

        container.innerHTML = '';
        this.stats.top_emojis.slice(0, 10).forEach(([emoji, count], index) => {
            const item = document.createElement('div');
            item.className = 'emoji-item';
            item.style.setProperty('--delay', index);
            item.innerHTML = `
                <div class="emoji">${emoji}</div>
                <div class="count">${count}</div>
            `;
            container.appendChild(item);
        });
    }

    populateTopReactions() {
        const container = document.getElementById('top-reactions');
        if (!container || !this.stats.top_reactions) return;

        container.innerHTML = '';
        this.stats.top_reactions.slice(0, 6).forEach(([emoji, count], index) => {
            const item = document.createElement('div');
            item.className = 'reaction-item';
            item.style.setProperty('--delay', index);
            item.innerHTML = `
                <div class="emoji">${emoji}</div>
                <div class="count">${count.toLocaleString('uk-UA')}</div>
            `;
            container.appendChild(item);
        });
    }

    createCharts() {
        this.createActivityChart();
        this.createHourChart();
        this.addMonthInsights();
    }

    createActivityChart() {
        const canvas = document.getElementById('activity-chart');
        if (!canvas || !this.stats.messages_by_month) return;

        const ctx = canvas.getContext('2d');
        const months = Object.keys(this.stats.messages_by_month).sort();
        const data = months.map(m => this.stats.messages_by_month[m]);

        const labels = months.map(m => {
            const [year, month] = m.split('-');
            const date = new Date(year, month - 1);
            return date.toLocaleDateString('uk-UA', { month: 'short' });
        });

        this.charts.activity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Повідомлення',
                    data: data,
                    backgroundColor: 'rgba(29, 185, 84, 0.8)',
                    borderColor: '#1DB954',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14 },
                        bodyFont: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fff', font: { size: 12 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#fff', font: { size: 12 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    createHourChart() {
        const canvas = document.getElementById('hour-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        let hourData = [];
        if (this.stats.messages_by_hour && Object.keys(this.stats.messages_by_hour).length > 0) {
            for (let i = 0; i < 24; i++) {
                hourData.push(this.stats.messages_by_hour[i] || 0);
            }
        } else {
            hourData = [
                120, 80, 45, 20, 15, 25, 60, 180, 350, 480, 620, 750,
                680, 590, 520, 480, 550, 720, 890, 1050, 980, 820, 650, 420
            ];
        }

        const labels = Array.from({length: 24}, (_, i) => `${i}:00`);

        this.charts.hour = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Активність',
                    data: hourData,
                    borderColor: '#1DB954',
                    backgroundColor: 'rgba(29, 185, 84, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1DB954',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14 },
                        bodyFont: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fff', font: { size: 12 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { 
                            color: '#fff', 
                            font: { size: 10 },
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    populateSrachsAnalysis() {
        const statsEl = document.getElementById('srachs-stats');
        const topEl = document.getElementById('top-srach');
        const guruEl = document.getElementById('guru-grid');
        
        if (!this.stats.srachs || this.stats.srachs.length === 0) {
            if (statsEl) statsEl.innerHTML = '<p style="color: rgba(255,255,255,0.5)">Немає даних про срачі</p>';
            if (guruEl) guruEl.innerHTML = '<p style="color: rgba(255,255,255,0.5)">Немає рейтингу</p>';
            return;
        }
        
        const srachs = this.stats.srachs;
        const totalSrachs = srachs.length;
        const totalMessages = srachs.reduce((sum, s) => sum + s.message_count, 0);
        const avgIntensity = (srachs.reduce((sum, s) => sum + (s.intensity || 5), 0) / totalSrachs).toFixed(1);
        
        if (statsEl) {
            statsEl.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-value">${totalSrachs}</div>
                        <div class="stat-label">Срачів за рік</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💬</div>
                        <div class="stat-value">${totalMessages.toLocaleString('uk-UA')}</div>
                        <div class="stat-label">Повідомлень</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-value">${avgIntensity}/10</div>
                        <div class="stat-label">Середня інтенсивність</div>
                    </div>
                </div>
            `;
        }

        if (guruEl) {
            const fighters = Array.isArray(this.stats.top_srach_fighters) ? this.stats.top_srach_fighters.slice(0, 5) : [];
            if (fighters.length === 0) {
                guruEl.innerHTML = '<p style="color: rgba(255,255,255,0.5)">Немає рейтингу</p>';
            } else {
                // Hero #1
                const hero = fighters[0];
                const heroColor = this.getUserColor(hero.name);
                const heroInitials = this.getInitials(hero.name);
                guruEl.innerHTML = `
                    <div class="guru-card">
                        <div class="guru-rank">#1</div>
                        <div class="guru-avatar" style="background: ${heroColor}">${heroInitials}</div>
                        <div>
                            <div class="guru-name">${hero.name}</div>
                            <div class="guru-messages">${hero.total_srach_messages.toLocaleString('uk-UA')} повід.</div>
                        </div>
                    </div>
                `;
                
                // Rest #2-5 in grid
                const guruRestEl = document.getElementById('guru-rest-grid');
                if (guruRestEl && fighters.length > 1) {
                    guruRestEl.innerHTML = fighters.slice(1, 5).map((fighter, idx) => {
                        const color = this.getUserColor(fighter.name);
                        const initials = this.getInitials(fighter.name);
                        return `
                            <div class="guru-card" style="animation-delay: ${(idx + 1) * 0.05}s">
                                <div class="guru-rank">#${idx + 2}</div>
                                <div class="guru-avatar" style="background: ${color}">${initials}</div>
                                <div class="guru-name">${fighter.name}</div>
                                <div class="guru-messages">${fighter.total_srach_messages.toLocaleString('uk-UA')} повід.</div>
                            </div>
                        `;
                    }).join('');
                }
            }
        }
        
        if (topEl && srachs.length > 0) {
            const top10 = srachs.slice(0, 10);
            
            topEl.innerHTML = '<div class="top-list">' + top10.map((srach, idx) => {
                const duration = Math.floor(srach.duration_minutes);
                const hours = Math.floor(duration / 60);
                const minutes = duration % 60;
                const durationText = hours > 0 ? `${hours}г ${minutes}хв` : `${minutes}хв`;
                
                return `
                    <div class="top-item" style="animation-delay: ${idx * 0.1}s">
                        <div class="top-rank">#${idx + 1}</div>
                        <div class="top-content">
                            <div class="top-header">
                                <div class="top-topic">${srach.topic}</div>
                                <div class="top-score">${srach.srach_score.toFixed(0)} 🔥</div>
                            </div>
                            ${srach.description ? `<div class="top-description">${srach.description}</div>` : ''}
                            <div class="top-participants-mini">
                                <div class="mini-participant">
                                    <span class="mini-avatar">${this.getInitials(srach.person1)}</span>
                                    <span class="mini-name">${srach.person1}</span>
                                </div>
                                <span class="mini-vs">VS</span>
                                <div class="mini-participant">
                                    <span class="mini-avatar">${this.getInitials(srach.person2)}</span>
                                    <span class="mini-name">${srach.person2}</span>
                                </div>
                            </div>
                            <div class="top-meta">
                                <span>⏱️ ${durationText}</span>
                                <span>💬 ${srach.message_count}</span>
                                <span>⚡ ${srach.intensity || 5}/10</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('') + '</div>';
        }
    }

    populateFullSummary() {
        const grid = document.getElementById('full-summary-grid');
        if (!grid || !Array.isArray(this.fullSummary) || this.fullSummary.length === 0) return;

        const monthNames = {
            '01': 'Січень', '02': 'Лютий', '03': 'Березень', '04': 'Квітень',
            '05': 'Травень', '06': 'Червень', '07': 'Липень', '08': 'Серпень',
            '09': 'Вересень', '10': 'Жовтень', '11': 'Листопад', '12': 'Грудень'
        };

        const grouped = {};

        for (const entry of this.fullSummary) {
            const match = (entry.period || '').match(/^(\d{4}-\d{2})/);
            if (!match) continue;
            const monthKey = match[1];
            if (!grouped[monthKey]) {
                grouped[monthKey] = {
                    summaries: [],
                    topics: new Set(),
                    conflicts: new Set(),
                    friendship: new Set(),
                    links: new Set(),
                    topUsers: new Map(),
                    vibe: null
                };
            }

            if (entry.summary) grouped[monthKey].summaries.push(entry.summary);
            (entry.topics || []).forEach(t => grouped[monthKey].topics.add(t));
            (entry.conflicts || []).forEach(c => grouped[monthKey].conflicts.add(c));
            (entry.friendship || []).forEach(f => grouped[monthKey].friendship.add(f));
            (entry.notable_links || []).forEach(l => grouped[monthKey].links.add(l));
            if (!grouped[monthKey].vibe && entry.vibe) grouped[monthKey].vibe = entry.vibe;

            if (Array.isArray(entry.top_users)) {
                entry.top_users.forEach(u => {
                    if (!u?.name) return;
                    const current = grouped[monthKey].topUsers.get(u.name) || 0;
                    grouped[monthKey].topUsers.set(u.name, current + (u.messages || 0));
                });
            }
        }

        const sortedMonths = Object.keys(grouped).sort();

        grid.innerHTML = sortedMonths.map((month, idx) => {
            const data = grouped[month];
            const [year, monthNum] = month.split('-');
            const monthLabel = `${monthNames[monthNum] || monthNum} ${year}`;
            const summaryTextFull = data.summaries.join(' ').trim();
            const summaryText = summaryTextFull.length > 420 ? `${summaryTextFull.slice(0, 420)}…` : summaryTextFull || 'Немає даних для цього місяця';
            const topics = Array.from(data.topics).slice(0, 6);
            const conflicts = Array.from(data.conflicts).slice(0, 2);
            const friendships = Array.from(data.friendship).slice(0, 2);
            const links = Array.from(data.links).slice(0, 2);
            const topUsers = Array.from(data.topUsers.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);

            const topicsHtml = topics.length ? `<div class="summary-topics">${topics.map(t => `<span class="summary-chip">${t}</span>`).join('')}</div>` : '';
            const topUsersText = topUsers.length ? `👥 ${topUsers.map(([name, count]) => `${name} (${count})`).join(', ')}` : '';
            const conflictsText = conflicts.length ? `⚡ ${conflicts.join('; ')}` : '';
            const friendshipText = friendships.length ? `💚 ${friendships.join('; ')}` : '';
            const linksText = links.length ? `🔗 ${links.map(l => `<a href="${l}" target="_blank" rel="noopener">посилання</a>`).join(' ')}` : '';
            const vibeText = data.vibe ? `🌡️ ${data.vibe}` : '';

            const meta = [vibeText, topUsersText, conflictsText, friendshipText, linksText]
                .filter(Boolean)
                .map(line => `<div>${line}</div>`)
                .join('');

            return `
                <div class="summary-card" style="animation-delay: ${idx * 0.05}s">
                    <h3>${monthLabel}</h3>
                    <p class="summary-text">${summaryText}</p>
                    ${topicsHtml}
                    <div class="summary-meta">${meta}</div>
                </div>
            `;
        }).join('');
    }
}

// Ініціалізація при завантаженні сторінки
// eslint-disable-next-line no-unused-vars
document.addEventListener('DOMContentLoaded', () => {
    new WrappedPresentation();
});

// ============ SLOT MACHINE GAME ============
class SlotMachine {
    constructor(stats) {
        this.stats = stats;
        this.symbols = [];
        this.isSpinning = false;
        this.reelItemCount = 20; // Number of items per reel for smoother spinning
        this.init();
    }

    init() {
        this.buildSymbols();
        this.populateReels();
        this.setupListeners();
    }

    buildSymbols() {
        // Combine stickers and emojis
        const stickers = (this.stats?.top_stickers || []).slice(0, 10);
        const emojis = (this.stats?.top_emojis || []).slice(0, 8);
        
        // Add stickers as images
        stickers.forEach(s => {
            if (s.path) {
                this.symbols.push({ type: 'sticker', path: s.path, id: s.path });
            }
        });
        
        // Add emojis
        emojis.forEach(e => {
            if (e.emoji) {
                this.symbols.push({ type: 'emoji', emoji: e.emoji, id: e.emoji });
            }
        });

        // Fallback if not enough symbols
        const fallbackEmojis = ['🔥', '💀', '😂', '❤️', '👀', '🤡', '💩', '🎉', '🤔', '😎'];
        if (this.symbols.length < 6) {
            fallbackEmojis.forEach(e => {
                this.symbols.push({ type: 'emoji', emoji: e, id: e });
            });
        }
    }

    populateReels() {
        const reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];

        reels.forEach((reel, reelIdx) => {
            if (!reel) return;
            const items = reel.querySelector('.slot-items');
            if (!items) return;
            
            items.innerHTML = '';
            
            // Create enough items for smooth spinning
            for (let i = 0; i < this.reelItemCount; i++) {
                const symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                const itemDiv = document.createElement('div');
                itemDiv.className = 'slot-item';
                itemDiv.dataset.symbolId = symbol.id;
                
                if (symbol.type === 'sticker') {
                    const img = document.createElement('img');
                    img.src = symbol.path;
                    img.alt = 'sticker';
                    img.onerror = () => { img.outerHTML = '🎰'; };
                    itemDiv.appendChild(img);
                } else {
                    itemDiv.textContent = symbol.emoji;
                }
                
                items.appendChild(itemDiv);
            }
            
            // Store reference for animation
            reel._items = items;
            reel._currentPos = 0;
        });
    }

    setupListeners() {
        const spinBtn = document.getElementById('spin-btn');
        const modal = document.getElementById('slot-modal');
        const closeBtn = modal?.querySelector('.slot-modal-close');

        if (spinBtn) {
            spinBtn.addEventListener('click', () => this.spin());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    }

    async spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;

        const spinBtn = document.getElementById('spin-btn');
        if (spinBtn) {
            spinBtn.disabled = true;
            spinBtn.classList.add('spinning');
        }

        const reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];

        // Shuffle and pick final symbols
        const finalSymbols = [];
        
        // 20% chance to win (all 3 match)
        const isWin = Math.random() < 0.2;
        
        if (isWin) {
            const winSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            finalSymbols.push(winSymbol, winSymbol, winSymbol);
        } else {
            // Make sure they don't all match
            for (let i = 0; i < 3; i++) {
                finalSymbols.push(this.symbols[Math.floor(Math.random() * this.symbols.length)]);
            }
            // Ensure at least one is different
            if (finalSymbols[0].id === finalSymbols[1].id && finalSymbols[1].id === finalSymbols[2].id) {
                const differentSymbol = this.symbols.find(s => s.id !== finalSymbols[0].id) || this.symbols[0];
                finalSymbols[2] = differentSymbol;
            }
        }

        // Animate each reel with staggered timing
        const spinDurations = [1500, 2000, 2500];
        const spinPromises = reels.map((reel, idx) => {
            return this.animateReel(reel, finalSymbols[idx], spinDurations[idx]);
        });

        await Promise.all(spinPromises);

        // Check for win
        if (isWin) {
            setTimeout(() => this.showPrize(), 300);
        }

        this.isSpinning = false;
        if (spinBtn) {
            spinBtn.disabled = false;
            spinBtn.classList.remove('spinning');
        }
    }

    animateReel(reel, finalSymbol, duration) {
        return new Promise(resolve => {
            const items = reel._items;
            if (!items) { resolve(); return; }

            const itemHeight = items.firstElementChild?.offsetHeight || 100;
            const totalHeight = itemHeight * this.reelItemCount;
            
            // Set the final item in the middle
            const middleIndex = Math.floor(this.reelItemCount / 2);
            const middleItem = items.children[middleIndex];
            
            if (middleItem) {
                middleItem.dataset.symbolId = finalSymbol.id;
                if (finalSymbol.type === 'sticker') {
                    middleItem.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = finalSymbol.path;
                    img.alt = 'sticker';
                    img.onerror = () => { img.outerHTML = '🎰'; };
                    middleItem.appendChild(img);
                } else {
                    middleItem.innerHTML = finalSymbol.emoji;
                }
            }

            // Animation
            let startTime = null;
            const finalOffset = -middleIndex * itemHeight;
            const spins = 3 + Math.random() * 2; // 3-5 full rotations
            const totalDistance = spins * totalHeight + Math.abs(finalOffset);

            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-out cubic for natural deceleration
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentDistance = totalDistance * eased;
                const currentOffset = -(currentDistance % totalHeight);

                items.style.transform = `translateY(${currentOffset}px)`;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    items.style.transform = `translateY(${finalOffset}px)`;
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    showPrize() {
        const modal = document.getElementById('slot-modal');
        if (!modal) return;

        // Get random Max quote from srach dates
        const maxQuotes = window.MAX_SRACH_QUOTES || [];
        let quote = null;

        if (maxQuotes.length > 0) {
            quote = maxQuotes[Math.floor(Math.random() * maxQuotes.length)];
        }

        const topicEl = modal.querySelector('.slot-prize-topic');
        const quoteEl = modal.querySelector('.slot-prize-quote');
        const metaEl = modal.querySelector('.slot-prize-meta');

        if (quote && quote.text) {
            if (topicEl) {
                topicEl.textContent = '🎤 Max Jabotinskiy каже:';
            }
            if (quoteEl) {
                quoteEl.textContent = `"${quote.text}"`;
            }
            if (metaEl) {
                metaEl.innerHTML = '';
                if (quote.date) {
                    const span = document.createElement('span');
                    // Format date nicely
                    const dateObj = new Date(quote.date);
                    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 
                                    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
                    const formatted = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
                    span.textContent = `📅 ${formatted}`;
                    metaEl.appendChild(span);
                }
                const srachSpan = document.createElement('span');
                srachSpan.textContent = '🔥 День срачу';
                metaEl.appendChild(srachSpan);
            }
        } else {
            if (topicEl) topicEl.textContent = 'Джекпот! 🎰';
            if (quoteEl) quoteEl.textContent = '"Макс мовчить... Це рідкість! 😅"';
            if (metaEl) metaEl.innerHTML = '';
        }

        modal.classList.add('active');
    }
}

// Initialize slot machine after stats are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for stats to be available
    const checkStats = setInterval(() => {
        if (window.WRAPPED_STATS || document.querySelector('.slot-machine')) {
            clearInterval(checkStats);
            // Small delay to ensure WrappedPresentation has loaded stats
            setTimeout(() => {
                const stats = window.WRAPPED_STATS || {};
                new SlotMachine(stats);
            }, 500);
        }
    }, 100);
});