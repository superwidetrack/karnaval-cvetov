const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Отправка сообщения в Telegram
function sendTelegram(text) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'HTML'
        });

        const req = https.request({
            hostname: 'api.telegram.org',
            path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                const result = JSON.parse(body);
                if (result.ok) resolve(result);
                else reject(new Error(result.description || 'Telegram API error'));
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// API: принять заказ и отправить в Telegram
app.post('/api/order', async (req, res) => {
    try {
        const { name, phone, date, time, comment, product, price } = req.body;
        const orderDate = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

        const text = `🌸 <b>Новый заказ с сайта</b>\n\n`
            + `<b>Букет:</b> ${product || 'Не указан'}\n`
            + `<b>Цена:</b> ${price || 'Не указана'}\n`
            + `<b>Имя:</b> ${name || 'Не указано'}\n`
            + `<b>Телефон:</b> ${phone || 'Не указан'}\n`
            + `<b>Дата доставки:</b> ${date || 'Не указана'}\n`
            + `<b>Время:</b> ${time || 'Не указано'}\n`
            + `<b>Комментарий:</b> ${comment || '—'}\n\n`
            + `🕐 ${orderDate}`;

        await sendTelegram(text);
        res.json({ success: true, message: 'Заказ отправлен!' });
    } catch (error) {
        console.error('Ошибка отправки:', error);
        res.status(500).json({ success: false, message: 'Ошибка при отправке заказа' });
    }
});

// CTA-форма (без выбора букета)
app.post('/api/callback', async (req, res) => {
    try {
        const { name, phone, comment } = req.body;
        const orderDate = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

        const text = `📞 <b>Заявка на обратный звонок</b>\n\n`
            + `<b>Имя:</b> ${name || 'Не указано'}\n`
            + `<b>Телефон:</b> ${phone || 'Не указан'}\n`
            + `<b>Комментарий:</b> ${comment || '—'}\n\n`
            + `🕐 ${orderDate}`;

        await sendTelegram(text);
        res.json({ success: true, message: 'Заявка отправлена!' });
    } catch (error) {
        console.error('Ошибка отправки:', error);
        res.status(500).json({ success: false, message: 'Ошибка при отправке заявки' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Karnaval Cvetov running on port ${PORT}`);
});
