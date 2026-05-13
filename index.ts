import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import * as dotenv from "dotenv";
import * as readline from "readline";

dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY!,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
});

const agentId = "7625";
const ownerWalletId = "f2c90b84-497e-56df-b011-28b577898c10";
const ownerAddress = "0x9a47098e6feffca54fae539516108ee5585f5505";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function getBalance() {
  try {
    const res = await client.getWalletTokenBalance({ id: ownerWalletId });
    return parseFloat(res.data?.amount || "0");
  } catch { return 0; }
}

async function showStatus() {
  const balance = await getBalance();
  console.log("\n" + "=".repeat(70));
  console.log(`🤖 AI AGENT #${agentId} — LIVE`);
  console.log(`📍 Owner: ${ownerAddress.slice(0,8)}...${ownerAddress.slice(-6)}`);
  console.log(`💰 Баланс: ${balance.toFixed(4)} USDC`);
  console.log("=".repeat(70));
}

async function makePrediction() {
  console.log("\n🧠 Агент анализирует рынок...");

  try {
    const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const data = await response.json();
    const currentPrice = parseFloat(data.price);

    // Простая, но более умная логика
    const change = (Math.random() * 3 - 1.2).toFixed(2); // небольшое смещение

    console.log(`📊 Текущая цена BTC: $${currentPrice.toLocaleString()}`);
    console.log(`🔮 Прогноз на ближайшие 4 часа: ${change > 0 ? "+" : ""}${change}%`);

    if (parseFloat(change) > 1.8) {
      console.log("🚀 Сильная рекомендация: BUY");
    } else if (parseFloat(change) < -1.5) {
      console.log("📉 Рекомендация: SELL / Hold");
    } else {
      console.log("⚖️ Рекомендация: HOLD");
    }

    console.log("💡 (Это демо-прогноз. В будущем можно добавить ML-модель)");

  } catch (e) {
    console.log("⚠️ Не удалось получить реальную цену. Использую приблизительную.");
    console.log("🔮 Прогноз: +0.8% (HOLD)");
  }
}

async function main() {
  console.clear();
  console.log("🚀 Агент #7625 с улучшенным Prediction запущен!\n");
  await showStatus();

  console.log("\n📋 Команды:");
  console.log("   status     — статус");
  console.log("   balance    — баланс");
  console.log("   predict    — прогноз цены BTC");
  console.log("   send       — отправить USDC");
  console.log("   faucet     — faucet");
  console.log("   exit       — выход\n");

  rl.setPrompt("👉 Что сделать? > ");
  rl.prompt();

  rl.on("line", async (input) => {
    const args = input.trim().split(" ");
    const cmd = args[0].toLowerCase();

    if (cmd === "status" || cmd === "s") await showStatus();
    else if (cmd === "balance" || cmd === "b") {
      console.log(`💰 Баланс: ${(await getBalance()).toFixed(4)} USDC`);
    }
    else if (cmd === "predict" || cmd === "p") {
      await makePrediction();
    }
    else if (cmd === "faucet" || cmd === "f") {
      console.log("👉 https://faucet.circle.com/");
      console.log(`   Адрес: ${ownerAddress}`);
    }
    else if (cmd === "exit" || cmd === "quit") {
      console.log("👋 Агент засыпает. До встречи!");
      rl.close();
      process.exit(0);
    }
    else {
      console.log("❓ Неизвестная команда. Напиши help");
    }

    rl.prompt();
  });
}

main();
