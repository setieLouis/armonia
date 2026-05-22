/**
 * emoji_service.js: Service to map dish names/keywords to Unicode emojis.
 */

var emojiMap = {
    // Breakfast
    "caffè": { emoji: "☕", bg: "bg-sun" },
    "latte": { emoji: "🥛", bg: "bg-sun" },
    "yogurt": { emoji: "🍦", bg: "bg-sun" },
    "skyr": { emoji: "🍦", bg: "bg-sun" },
    "soia": { emoji: "🌱", bg: "bg-sun" },
    "muesli": { emoji: "🥣", bg: "bg-sun" },
    "cereali": { emoji: "🥣", bg: "bg-sun" },
    "fette biscottate": { emoji: "🍞", bg: "bg-sun" },
    "marmellata": { emoji: "🍓", bg: "bg-sun" },
    "miele": { emoji: "🍯", bg: "bg-sun" },
    "uova": { emoji: "🥚", bg: "bg-bowl" },
    "pancake": { emoji: "🥞", bg: "bg-sun" },
    
    // Fruit & Snacks
    "mela": { emoji: "🍎", bg: "bg-apple" },
    "pera": { emoji: "🍐", bg: "bg-apple" },
    "banana": { emoji: "🍌", bg: "bg-sun" },
    "mirtilli": { emoji: "🫐", bg: "bg-bowl" },
    "fragole": { emoji: "🍓", bg: "bg-apple" },
    "frutta": { emoji: "🍎", bg: "bg-apple" },
    "mandorle": { emoji: "🥜", bg: "bg-bowl" },
    "noci": { emoji: "🥜", bg: "bg-bowl" },
    "frutta secca": { emoji: "🥜", bg: "bg-bowl" },
    
    // Main dishes
    "riso": { emoji: "🍚", bg: "bg-bowl" },
    "pasta": { emoji: "🍝", bg: "bg-bowl" },
    "pane": { emoji: "🍞", bg: "bg-bowl" },
    "segale": { emoji: "🍞", bg: "bg-bowl" },
    "pollo": { emoji: "🍗", bg: "bg-bowl" },
    "tacchino": { emoji: "🍗", bg: "bg-bowl" },
    "salmone": { emoji: "🐟", bg: "bg-bowl" },
    "pesce": { emoji: "🐟", bg: "bg-bowl" },
    "carne": { emoji: "🥩", bg: "bg-bowl" },
    "manzo": { emoji: "🥩", bg: "bg-bowl" },
    "uovo": { emoji: "🥚", bg: "bg-bowl" },
    "frittata": { emoji: "🍳", bg: "bg-bowl" },
    
    // Vegetables
    "insalata": { emoji: "🥗", bg: "bg-bowl" },
    "verdura": { emoji: "🥦", bg: "bg-bowl" },
    "asparagi": { emoji: "🥦", bg: "bg-bowl" },
    "carote": { emoji: "🥕", bg: "bg-apple" },
    "pomodori": { emoji: "🍅", bg: "bg-apple" },
    "zucchine": { emoji: "🥒", bg: "bg-bowl" },
    "broccoli": { emoji: "🥦", bg: "bg-bowl" },
    "spinaci": { emoji: "🥬", bg: "bg-bowl" },
    
    // Extras
    "olio": { emoji: "🫒", bg: "bg-bowl" },
    "hummus": { emoji: "🧆", bg: "bg-bowl" },
    "burro": { emoji: "🧈", bg: "bg-bowl" },
    "arachidi": { emoji: "🥜", bg: "bg-bowl" },
    "cioccolato": { emoji: "🍫", bg: "bg-bowl" }
};

var defaultData = { emoji: "🥗", bg: "bg-bowl" };

/**
 * Returns an emoji and background class based on the dish name.
 * @param {string} dishName 
 * @returns {{emoji: string, bg: string}}
 */
function getDishIcon(dishName) {
    if (!dishName) return defaultData;
    
    const name = dishName.toLowerCase();
    
    for (const [keyword, data] of Object.entries(emojiMap)) {
        if (name.includes(keyword)) {
            return data;
        }
    }
    
    return defaultData;
}

// Backward compatibility for the simple emoji return if needed
function getEmojiForDish(dishName) {
    return getDishIcon(dishName).emoji;
}

// Expose to window for global access
window.getDishIcon = getDishIcon;
window.getEmojiForDish = getEmojiForDish;
