/*
  Загрузка и отрисовка акций из публичного API /api/promotions
  - Учитывает текущий язык из URL (/ru, /en, /ka) или data-lang на <html>
  - Рендерит список элементов в контейнере #promotions-list
*/

/**
 * Определяет текущий язык интерфейса.
 * @returns {"ru"|"en"|"ka"}
 */
function getCurrentLanguage() {
    var defaultLang = "ru";
    var path = window.location.pathname || "/";
    if (path.startsWith("/en/")) return "en";
    if (path.startsWith("/ka/")) return "ka";
    var htmlEl = document.documentElement;
    var attrLang = htmlEl && htmlEl.getAttribute("lang");
    if (attrLang === "en" || attrLang === "ka" || attrLang === "ru") return attrLang;
    return defaultLang;
}

/**
 * Возвращает локализованные поля из записи акции.
 * @param {any} promo
 * @param {"ru"|"en"|"ka"} lang
 */
function pickLocalizedFields(promo, lang) {
    var titleKey = lang === "en" ? "title_en" : lang === "ka" ? "title_ka" : "title_ru";
    var descriptionKey = lang === "en" ? "description_en" : lang === "ka" ? "description_ka" : "description_ru";
    return {
        title: promo[titleKey] || promo["title_ru"] || "",
        description: promo[descriptionKey] || promo["description_ru"] || "",
        imageSrc: promo["image_src"] || ""
    };
}

/**
 * Создаёт DOM-элемент карточки акции.
 * @param {any} promo
 * @param {"ru"|"en"|"ka"} lang
 * @returns {HTMLElement}
 */
function createPromotionItem(promo, lang) {
    var data = pickLocalizedFields(promo, lang);
    var li = document.createElement("li");
    li.className = "list_item list_item_sale";

    if (data.imageSrc) {
        var img = document.createElement("img");
        img.className = "list_item__img";
        img.src = data.imageSrc;
        img.alt = data.title || "promotion";
        li.appendChild(img);
    }

    var titleSpan = document.createElement("span");
    titleSpan.textContent = data.title || "";
    li.appendChild(titleSpan);

    if (data.description) {
        var descDiv = document.createElement("div");
        descDiv.className = "process_text__small";
        var descSpan = document.createElement("span");
        // В описании допускаем HTML из админки (жирный текст, ссылки и т.п.)
        descSpan.innerHTML = data.description;
        descDiv.appendChild(descSpan);
        li.appendChild(descDiv);
    }

    return li;
}

/**
 * Рендерит состояние пустого списка/ошибки.
 * @param {HTMLElement} container
 * @param {string} message
 */
function renderInfo(container, message) {
    container.innerHTML = "";
    var li = document.createElement("li");
    li.className = "list_item";
    var span = document.createElement("span");
    span.textContent = message;
    li.appendChild(span);
    container.appendChild(li);
}

/**
 * Загружает и рендерит акции.
 */
function loadPromotions() {
    var container = document.getElementById("promotions-list");
    if (!container) return;

    var lang = getCurrentLanguage();
    renderInfo(container, lang === "en" ? "Loading..." : lang === "ka" ? "იტვირთება..." : "Загрузка...");

    var apiBase = (function resolveApiBase() {
        try {
            var isDevFrontend = window.location && (window.location.port === "1234");
            if (isDevFrontend) return "https://sto-batumi.ge";
        } catch (_) {}
        return "";
    })();

    fetch(apiBase + "/api/promotions", { credentials: "same-origin" })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!Array.isArray(data) || data.length === 0) {
                renderInfo(container, lang === "en" ? "No promotions yet" : lang === "ka" ? "აქციები ჯერ არაა" : "Акций пока нет");
                return;
            }
            container.innerHTML = "";
            data.forEach(function (promo) {
                container.appendChild(createPromotionItem(promo, lang));
            });
        })
        .catch(function () {
            renderInfo(container, lang === "en" ? "Failed to load promotions" : lang === "ka" ? "აქციათა ჩატვირთვა ვერ მოხერხდა" : "Не удалось загрузить акции");
        });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPromotions);
} else {
    loadPromotions();
}


