import { Telegraf, Markup, Scenes, session } from 'telegraf';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';

dotenv.config();
const token = process.env.KGTOLB_BOT_TOKEN;
const bot = new Telegraf(token);

let barWeight = 20; // Default bar weight in kg

// Utility function to create continue/exit keyboard
const getContinueKeyboard = () => {
    return Markup.keyboard([['Continue', 'Exit']]).resize();
};

// Scene for kg to lb conversion
const kgToLbScene = new Scenes.BaseScene('kgToLb');
kgToLbScene.enter((ctx) => ctx.reply('Please enter a weight in kg:'));
kgToLbScene.hears('Exit', (ctx) => {
    ctx.reply('Exiting kg to lb conversion.', Markup.removeKeyboard());
    return ctx.scene.leave();
});
kgToLbScene.hears('Continue', (ctx) => {
    return ctx.reply('Please enter a weight in kg:');
});
kgToLbScene.on(message('text'), (ctx) => {
    const kg = parseFloat(ctx.message.text);
    if (isNaN(kg)) {
        return ctx.reply('请输入一个有效数字');
    }
    const lb = kg * 2.20462;
    const plateWeightLb = (lb - barWeight * 2.20462) / 2;
    const totalPlateWeightLb = (lb) / 2;
    ctx.reply(`${kg} kg = ${lb.toFixed(2)} lb\n` +
        `单边加 (不减杠铃重量): ${totalPlateWeightLb.toFixed(2)} lb\n` +
        `单边加 (减去杠铃重量): ${plateWeightLb.toFixed(2)} lb\n` +
        `您可以选择继续还是退出:`, getContinueKeyboard());
});

// Scene for lb to kg conversion
const lbToKgScene = new Scenes.BaseScene('lbToKg');
lbToKgScene.enter((ctx) => ctx.reply('Please enter a weight in lb:'));
lbToKgScene.hears('Exit', (ctx) => {
    ctx.reply('Exiting lb to kg conversion.', Markup.removeKeyboard());
    return ctx.scene.leave();
});
lbToKgScene.hears('Continue', (ctx) => {
    return ctx.reply('Please enter a weight in lb:');
});
lbToKgScene.on(message('text'), (ctx) => {
    const lb = parseFloat(ctx.message.text);
    if (isNaN(lb)) {
        return ctx.reply('请输入一个有效数字');
    }
    const kg = lb / 2.20462;
    ctx.reply(`${lb} lb = ${kg.toFixed(2)} kg\n\n` +
        `您可以选择继续还是退出:`, getContinueKeyboard());
});

// Scene for setting bar weight
const settingScene = new Scenes.BaseScene('setting');
settingScene.enter((ctx) => ctx.reply('Please enter the default bar weight in kg:'));
lbToKgScene.on(message('text'), (ctx) => {
    const weight = parseFloat(ctx.message.text);
    if (isNaN(weight)) {
        return ctx.reply('请输入一个有效数字');
    }
    barWeight = weight;
    ctx.reply(`Bar weight set to ${weight} kg.`);
    ctx.scene.leave();
});

const stage = new Scenes.Stage([kgToLbScene, lbToKgScene, settingScene]);

bot.use(session());
bot.use(stage.middleware());

bot.command('start', (ctx) => {
    ctx.reply('Welcome to the Weight Converter Bot!', Markup.keyboard([
        ['Kg ➡️ Lb', 'Lb ➡️ Kg'],
        ['Setting']
    ]).resize());
});

bot.hears('Kg ➡️ Lb', (ctx) => ctx.scene.enter('kgToLb'));
bot.hears('Lb ➡️ Kg', (ctx) => ctx.scene.enter('lbToKg'));
bot.hears('Setting', (ctx) => ctx.scene.enter('setting'));

// Set bot commands for the command menu
bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot and show main menu' },
    { command: 'kgtolb', description: 'Convert kg to lb' },
    { command: 'lbtokg', description: 'Convert lb to kg' },
    { command: 'setting', description: 'Set default bar weight' }
]);

// Handle command menu actions
bot.command('kgtolb', (ctx) => ctx.scene.enter('kgToLb'));
bot.command('lbtokg', (ctx) => ctx.scene.enter('lbToKg'));
bot.command('setting', (ctx) => ctx.scene.enter('setting'));

// bot.launch();
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot