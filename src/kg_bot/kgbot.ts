import { Telegraf, Markup, Scenes, session } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { SceneContext } from "telegraf/typings/scenes";

dotenv.config();
const token = process.env.KGTOLB_BOT_TOKEN;
if (!token) throw new Error("Bot token is required");
const bot = new Telegraf<SceneContext>(token);

let barWeight = 20; // Default bar weight in kg

// Utility function to create continue/exit keyboard
const getContinueKeyboard = () => {
  return Markup.keyboard([["继续", "退出"]]).resize();
};

// Scene for kg to lb conversion
const kgToLbsScene = new Scenes.BaseScene<SceneContext>("kgToLbs");
kgToLbsScene.enter((ctx) => ctx.reply("请输入一个以 Kg 为单位的重量："));
kgToLbsScene.hears("退出", (ctx) => {
  ctx.reply("已退出当前回话", Markup.removeKeyboard());
  return ctx.scene.leave();
});
kgToLbsScene.hears("继续", (ctx) => {
  return ctx.reply("请输入一个以 Kg 为单位的重量：");
});
kgToLbsScene.on(message("text"), (ctx) => {
  const kg = parseFloat(ctx.message.text);
  if (isNaN(kg)) {
    return ctx.reply("请输入一个有效数字");
  }
  const lb = kg * 2.20462;
  const plateWeightLb = (lb - barWeight * 2.20462) / 2;
  const totalPlateWeightLb = lb / 2;
  ctx.reply(
    `${kg} kg = ${lb.toFixed(2)} lb\n` +
      `单边加 (不减杠铃重量): ${totalPlateWeightLb.toFixed(2)} lbs\n` +
      `单边加 (减去杠铃重量): ${plateWeightLb.toFixed(2)} lbs\n` +
      `您可以选择继续还是退出:`,
    getContinueKeyboard()
  );
});

// Scene for lb to kg conversion
const lbsToKgScene = new Scenes.BaseScene<SceneContext>("lbsToKg");
lbsToKgScene.enter((ctx) => ctx.reply("请输入一个以 Lb 为单位的重量:"));
lbsToKgScene.hears("退出", (ctx) => {
  ctx.reply("已退出当前回话", Markup.removeKeyboard());
  return ctx.scene.leave();
});
lbsToKgScene.hears("继续", (ctx) => {
  return ctx.reply("请输入一个以 Lb 为单位的重量:");
});
lbsToKgScene.on(message("text"), (ctx) => {
  const lb = parseFloat(ctx.message.text);
  if (isNaN(lb)) {
    return ctx.reply("请输入一个有效数字");
  }
  const kg = lb / 2.20462;
  ctx.reply(
    `${lb} lbs = ${kg.toFixed(2)} kg\n\n` + `您可以选择继续还是退出:`,
    getContinueKeyboard()
  );
});

// Scene for setting bar weight
const settingScene = new Scenes.BaseScene<SceneContext>("setting");
settingScene.enter((ctx) => ctx.reply("请输入一个以 kg 为单位的杠铃重量:"));
lbsToKgScene.on(message("text"), (ctx) => {
  const weight = parseFloat(ctx.message.text);
  if (isNaN(weight)) {
    return ctx.reply("请输入一个有效数字");
  }
  barWeight = weight;
  ctx.reply(`杠铃重量已设置为 ${weight}kg.`);
  ctx.scene.leave();
});

// 将场景管理功能集成到 Telegraf 机器人中
const stage = new Scenes.Stage<SceneContext>([
  kgToLbsScene,
  lbsToKgScene,
  settingScene,
]);

bot.use(session()); // 一个中间件，用于在用户与机器人之间的对话中维护状态
bot.use(stage.middleware());

bot.command("start", (ctx) => {
  ctx.reply(
    "你好! 欢迎使用杠铃重量转换器!",
    Markup.keyboard([["Kg ➡️ Lbs", "Lbs ➡️ Kg"], ["Setting"]]).resize()
  );
});

bot.hears("Kg ➡️ Lbs", (ctx) => ctx.scene.enter("kgToLbs"));
bot.hears("Lbs ➡️ Kg", (ctx) => ctx.scene.enter("lbsToKg"));
bot.hears("Setting", (ctx) => ctx.scene.enter("setting"));

// Set bot commands for the command menu
bot.telegram.setMyCommands([
  { command: "start", description: "Start the bot and show main menu" },
  { command: "kgtolbs", description: "Convert kg to lbs" },
  { command: "lbstokg", description: "Convert lbs to kg" },
  { command: "setting", description: "Set default bar weight" },
]);

// Handle command menu actions
bot.command("kgtolbs", (ctx) => ctx.scene.enter("kgToLbs"));
bot.command("lbstokg", (ctx) => ctx.scene.enter("lbsToKg"));
bot.command("setting", (ctx) => ctx.scene.enter("setting"));

export default bot;
