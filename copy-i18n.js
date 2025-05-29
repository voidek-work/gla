const fs = require('fs');
const path = require('path');

/**
 * Копирует файлы из директории i18n в src с префиксами языков
 * @param {string} sourceDir - Исходная директория
 * @param {string} targetDir - Целевая директория
 */
function copyFilesWithLanguagePrefix(sourceDir, targetDir) {
    // Получаем список языковых директорий
    const languageDirs = fs.readdirSync(sourceDir).filter(file => 
        fs.statSync(path.join(sourceDir, file)).isDirectory()
    );

    // Для каждого языка
    languageDirs.forEach(lang => {
        const langDir = path.join(sourceDir, lang);
        
        // Получаем список файлов в языковой директории
        const files = fs.readdirSync(langDir);
        
        // Копируем каждый файл с префиксом языка
        files.forEach(file => {
            const sourcePath = path.join(langDir, file);
            const targetPath = path.join(targetDir, `${lang}.${file}`);
            
            // Копируем файл
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Скопирован файл: ${sourcePath} -> ${targetPath}`);
        });
    });
}

/**
 * Рекурсивно удаляет директорию
 * @param {string} dirPath - Путь к директории для удаления
 */
function removeDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(file => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                removeDirectory(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
        console.log(`Удалена директория: ${dirPath}`);
    }
}

// Основная функция
function main() {
    const sourceDir = path.join(__dirname, 'i18n');
    const targetDir = path.join(__dirname, 'src');

    try {
        // Копируем файлы
        copyFilesWithLanguagePrefix(sourceDir, targetDir);
        
        // Удаляем исходную директорию
        removeDirectory(sourceDir);
        
        console.log('Операция успешно завершена');
    } catch (error) {
        console.error('Произошла ошибка:', error);
        process.exit(1);
    }
}

// Запускаем скрипт
main(); 