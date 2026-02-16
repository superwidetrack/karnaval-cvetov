const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Nodemailer transporter (Yandex SMTP)
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.YANDEX_USER,
        pass: process.env.YANDEX_PASS
    }
});

// API: принять заказ и отправить на почту
app.post('/api/order', async (req, res) => {
    try {
        const { name, phone, date, time, comment, product, price } = req.body;

        const orderDate = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

        const html = `
            <h2>🌸 Новый заказ с сайта Карнавал Цветов</h2>
            <table style="border-collapse:collapse;width:100%;max-width:500px;">
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Букет</td><td style="padding:8px;border:1px solid #ddd;">${product || 'Не указан'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Цена</td><td style="padding:8px;border:1px solid #ddd;">${price || 'Не указана'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Имя</td><td style="padding:8px;border:1px solid #ddd;">${name || 'Не указано'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Телефон</td><td style="padding:8px;border:1px solid #ddd;">${phone || 'Не указан'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Дата доставки</td><td style="padding:8px;border:1px solid #ddd;">${date || 'Не указана'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Время</td><td style="padding:8px;border:1px solid #ddd;">${time || 'Не указано'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Комментарий</td><td style="padding:8px;border:1px solid #ddd;">${comment || '—'}</td></tr>
            </table>
            <p style="color:#888;margin-top:16px;">Заказ получен: ${orderDate}</p>
        `;

        await transporter.sendMail({
            from: `"Карнавал Цветов" <${process.env.YANDEX_USER}>`,
            to: 'info@29roz.ru',
            subject: `Заказ: ${product || 'Букет'} — ${name || 'Клиент'}`,
            html: html
        });

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

        const html = `
            <h2>📞 Заявка на обратный звонок</h2>
            <table style="border-collapse:collapse;width:100%;max-width:500px;">
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Имя</td><td style="padding:8px;border:1px solid #ddd;">${name || 'Не указано'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Телефон</td><td style="padding:8px;border:1px solid #ddd;">${phone || 'Не указан'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Комментарий</td><td style="padding:8px;border:1px solid #ddd;">${comment || '—'}</td></tr>
            </table>
            <p style="color:#888;margin-top:16px;">Заявка получена: ${orderDate}</p>
        `;

        await transporter.sendMail({
            from: `"Карнавал Цветов" <${process.env.YANDEX_USER}>`,
            to: 'info@29roz.ru',
            subject: `Заявка: ${name || 'Клиент'} — ${phone || 'нет телефона'}`,
            html: html
        });

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
