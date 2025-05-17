/**
 * Управление языками сайта
 */
class LanguageManager {
    static STORAGE_KEY = 'selected_language';
    static DEFAULT_LANGUAGE = 'ru';
    static SUPPORTED_LANGUAGES = ['ru', 'ka', 'en'];

    /**
     * Инициализация менеджера языков
     */
    static init() {
        this.setupLanguageLinks();
        this.setInitialLanguage();
    }

    /**
     * Настройка обработчиков событий для ссылок переключения языка
     */
    static setupLanguageLinks() {
        const links = document.querySelectorAll('.lang-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.currentTarget.dataset.lang;
                if (lang) {
                    this.setLanguage(lang);
                    // Редирект на соответствующий URL
                    window.location.href = `/${lang}/`;
                }
            });
        });
    }

    /**
     * Установка начального языка
     */
    static setInitialLanguage() {
        const savedLang = localStorage.getItem(this.STORAGE_KEY);
        if (savedLang && this.SUPPORTED_LANGUAGES.includes(savedLang)) {
            this.setLanguage(savedLang);
        } else {
            const browserLang = navigator.language.split('-')[0];
            const defaultLang = this.SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : this.DEFAULT_LANGUAGE;
            this.setLanguage(defaultLang);
        }
    }

    /**
     * Установка языка
     * @param {string} lang - код языка
     */
    static setLanguage(lang) {
        if (!this.SUPPORTED_LANGUAGES.includes(lang)) {
            return;
        }

        localStorage.setItem(this.STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        
        // Обновляем активную ссылку
        const links = document.querySelectorAll('.lang-link');
        links.forEach(link => {
            if (link.dataset.lang === lang) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Здесь можно добавить логику для загрузки переводов
        // и обновления текстов на странице
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();
}); 