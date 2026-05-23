const fs = require("fs");
const pdf = require("pdf-parse");

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log("Uso: node parser.js file.pdf");
    process.exit(1);
  }

  const buffer = fs.readFileSync(filePath);

  const data = await pdf(buffer);

 const structured = parseToJson(data.text);

console.log(JSON.stringify(structured, null, 2));


function parseToJson(text) {
  const days = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];

  const mealMap = {
    "COLAZIONE": "Colazione",
    "SPUNTINO MATT.": "Spuntino",
    "PRANZO": "Pranzo",
    "MERENDA": "Merenda",
    "CENA": "Cena"
  };

  const result = {
    weekPlan: []
  };

  for (const day of days) {
    const dayStart = text.indexOf(day);
    if (dayStart === -1) continue;

    const dayEnd = getNextDayIndex(text, day, days);
    const dayText = text.substring(dayStart, dayEnd);

    const meals = [];

    for (const [mealKey, label] of Object.entries(mealMap)) {
      const mealStart = dayText.indexOf(mealKey);
      if (mealStart === -1) continue;

      const mealEnd = getNextMealIndex(dayText, mealKey);
      const mealText = dayText.substring(
        mealStart + mealKey.length,
        mealEnd
      );

      meals.push({
        label,
        dishes: parseDishes(mealText)
      });
    }

    result.weekPlan.push({
      day,
      meals
    });
  }

  return result;
}

function getNextDayIndex(text, currentDay, days) {
  const start = text.indexOf(currentDay);
  let end = text.length;

  for (const d of days) {
    if (d === currentDay) continue;
    const idx = text.indexOf(d, start + 1);
    if (idx !== -1 && idx < end) end = idx;
  }

  return end;
}

function getNextMealIndex(text, meal) {
  const meals = ["COLAZIONE","SPUNTINO MATT.","PRANZO","MERENDA","CENA"];

  const start = text.indexOf(meal);
  let end = text.length;

  for (const m of meals) {
    if (m === meal) continue;
    const idx = text.indexOf(m, start + 1);
    if (idx !== -1 && idx < end) end = idx;
  }

  return end;
}

function parseDishes(text) {
  const lines = text
    .split("\n")
    .map(l => cleanLine(l))
    .filter(Boolean);

  const dishes = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const match = line.match(
      /^(.+?)\s+(Quanto basta|A piacere|q\.b\.|\d+\s*g)$/i
    );

    if (!match) continue;

    const dish = {
      name: cleanLine(match[1]),
      quantity: match[2],
      alternatives: []
    };

    // 🔥 alternative
    if (lines[i + 1]?.includes("Alternative")) {
      i++;

      while (i + 1 < lines.length) {
        const next = lines[i + 1];

        if (!next || next.includes("CENA") || next.includes("PRANZO")) break;

        const alt = next.match(/^(.+?)\s+(\d+\s*g)$/i);

        if (alt) {
          dish.alternatives.push({
            name: cleanLine(alt[1]),
            quantity: alt[2]
          });
        }

        i++;
      }
    }

    dishes.push(dish);
  }

  return dishes;
}

function cleanLine(line) {
  return line
    .replace(/\s+/g, " ")   // elimina spazi multipli
    .trim();
}
}

main();