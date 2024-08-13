
// 展示普通键盘的命令
// bot.command('show_keyboard', (ctx) => {
//     ctx.reply('Here is your keyboard', Markup.keyboard([
//         ['Button 1', 'Button 2'],
//         ['Button 3', 'Button 4']
//     ]).resize());
// });

// bot.command('show_keyboard', (ctx) => {
//     ctx.reply('Here is your keyboard', Markup.inlineKeyboard([
//         [Markup.button.webApp('Open bilibili', 'https://www.bilibili.com/')]
//     ]));
// });

// // 删除普通键盘并展示内联键盘的命令
// bot.command('remove_keyboard', (ctx) => {
//     // 删除普通键盘
//     ctx.reply('Removing keyboard...', Markup.removeKeyboard())
//         .then(() => {
//             // 添加内联键盘
//             return ctx.reply('Here is your inline keyboard', Markup.inlineKeyboard([
//                 [Markup.button.callback('Inline Button 1', 'btn1')],
//                 [Markup.button.callback('Inline Button 2', 'btn2')]
//             ]));
//         });
// });
