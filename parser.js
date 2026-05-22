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
  const meals = ["COLAZIONE","SPUNTINO MATT.","PRANZO","MERENDA","CENA"];

  const result = {
    weekPlan: []
  };

  for (const day of days) {
    const dayIndex = text.indexOf(day);
    if (dayIndex === -1) continue;

    const nextDayIndex = getNextDayIndex(text, day, days);

    const dayText = text.substring(dayIndex, nextDayIndex);

    const mealsObj = {};

    for (const meal of meals) {
      const mealIndex = dayText.indexOf(meal);
      if (mealIndex === -1) continue;

      const nextMealIndex = getNextMealIndex(dayText, meal, meals);

      const mealText = dayText.substring(
        mealIndex + meal.length,
        nextMealIndex
      );

      mealsObj[meal.toLowerCase()] = parseItems(mealText);
    }

    result.weekPlan.push({
      day,
      meals: mealsObj
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

function getNextMealIndex(text, currentMeal, meals) {
  const start = text.indexOf(currentMeal);
  let end = text.length;

  for (const m of meals) {
    if (m === currentMeal) continue;
    const idx = text.indexOf(m, start + 1);
    if (idx !== -1 && idx < end) end = idx;
  }

  return end;
}

function parseItems(text) {
  const lines = text
    .split("\n")
    .map(l => cleanLine(l))
    //.map(l => l.trim())
    .filter(Boolean);

  const items = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // prodotto + quantità
    const match = line.match(/^(.+?)\s+(\d+\s*g|Quanto basta|A piacere|q\.b\.)$/i);

    if (match) {
      const name = match[1].trim();
      const quantity = match[2].trim();

      const item = {
        name,
        quantity,
        alternatives: []
      };

      // cerca "Alternative:" nelle righe successive
      if (lines[i + 1] && lines[i + 1].includes("Alternative")) {
        i++;

        while (i + 1 < lines.length && !lines[i + 1].match(/^\s*$/)) {
          i++;

          const altMatch = lines[i].match(/^(.+?)\s+(\d+\s*g)$/i);

          if (altMatch) {
            item.alternatives.push({
              name: altMatch[1].trim(),
              quantity: altMatch[2].trim()
            });
          }
        }
      }

      items.push(item);
    }
  }

  return items;
}

function cleanLine(line) {
  return line
    .replace(/\s+/g, " ")   // elimina spazi multipli
    .trim();
}
}

main();