// --- 1. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ С ЛОКАЛЬНЫМ ХРАНИЛИЩЕМ ---
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);

if (themeToggleBtn) {
    themeToggleBtn.textContent = currentTheme === 'dark' ? '🌙 Тема' : '☀️ Тема';
}

themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (themeToggleBtn) {
        themeToggleBtn.textContent = newTheme === 'dark' ? '🌙 Тема' : '☀️ Тема';
    }
});


// --- 2. ДИНАМИЧЕСКАЯ ПОДГРУЗКА КАРТОЧЕК ---
const gamesContainer = document.getElementById('games-container');
const loadMoreBtn = document.getElementById('load-more');

// БЕЗ ДУБЛИКАТА ВЕДЬМАКА (только новые игры)
const extraGames = [
    {
        title: "Elden Ring",
        genre: "RPG / Action",
        desc: "Шедевр от FromSoftware, заставивший страдать миллионы игроков.",
        rating: "9.8",
        img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg"
    },
    {
        title: "S.T.A.L.K.E.R. 2",
        genre: "FPS / Survival",
        desc: "Долгожданное возвращение в аномальную Зону Отчуждения.",
        rating: "8.9",
        img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1643320/header.jpg"
    },
    {
        title: "God of War Ragnarök",
        genre: "Action",
        desc: "Эпическое завершение скандинавской саги Кратоса.",
        rating: "9.4",
        img: "data:image/webp;base64,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"
    },
    {
        title: "Starfield",
        genre: "Sci-fi RPG",
        desc: "Космическая эпопея от Bethesda Game Studios.",
        rating: "8.5",
        img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg"
    }
];

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        extraGames.forEach(game => {
            const card = document.createElement('article');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="game-rating">⭐ ${game.rating}</div>
                <img src="${game.img}" alt="${game.title}" onerror="this.src='https://via.placeholder.com/400x200?text=🎮+${encodeURIComponent(game.title)}'">
                <div class="game-info">
                    <span class="game-genre">${game.genre}</span>
                    <h3>${game.title}</h3>
                    <p>${game.desc}</p>
                </div>
            `;
            gamesContainer.appendChild(card);
        });
        loadMoreBtn.style.display = 'none';
    });
}


// --- 3. ВАЛИДАЦИЯ ФОРМЫ ---
const form = document.getElementById('feedback-form');
const emailInput = document.getElementById('email');
const errorMsg = document.getElementById('email-error');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!emailPattern.test(emailValue)) {
            errorMsg.style.display = 'block';
            emailInput.style.borderColor = '#ef4444';
        } else {
            errorMsg.style.display = 'none';
            emailInput.style.borderColor = 'initial';
            
            console.log('--- Форма успешно отправлена ---');
            console.log('Email подписчика:', emailValue);
            
            alert('Спасибо за подписку!');
            form.reset();
        }
    });
}