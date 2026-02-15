# Karnaval Cvetov (karnaval-cvetov.ru)

## О проекте
Сайт доставки цветов в Архангельске. Статический сайт + API для отправки заказов на email.

- **Стек:** Node.js 20, Express, Nodemailer
- **Домен:** karnaval-cvetov.ru
- **Репозиторий:** github.com/superwidetrack/karnaval-cvetov

## Структура
```
server.js          — Express сервер (порт 3000)
public/index.html  — Главная страница (каталог букетов, формы заказа)
public/oferta.html — Публичная оферта
Procfile           — web: node server.js
package.json       — express ^4.21.0, nodemailer ^8.0.1
```

## API эндпоинты
- `POST /api/order` — Заказ букета (name, phone, date, time, comment, product, price) → email
- `POST /api/callback` — Заявка на обратный звонок (name, phone, comment) → email
- Все заказы отправляются на buket.29roz@gmail.com через Gmail SMTP

## Env-переменные
| Переменная | Описание | Тип |
|-----------|----------|-----|
| GMAIL_USER | Email для отправки (buket.29roz@gmail.com) | plain |
| GMAIL_PASS | App password для Gmail | SECRET |
| PORT | Порт сервера (default: 3000) | plain |

---

## Хостинг и деплой

### ✅ ТЕКУЩИЙ: Timeweb Cloud (с 16.02.2026)

- **App ID:** `156285`
- **IP:** `5.42.220.31`
- **Timeweb URL:** https://superwidetrack-karnaval-cvetov-66a5.twc1.net
- **Локация:** ru-1 (Россия, Санкт-Петербург, spb-3)
- **Framework:** express (Node.js 20)
- **GitHub:** superwidetrack/karnaval-cvetov (branch: main)
- **Build cmd:** `npm install`
- **Run cmd:** `node server.js`
- **Auto-deploy:** ❌ Выключен (нужно включить в UI панели Timeweb)
- **Статус:** active
- **Стоимость:** 510 ₽/мес

**Ресурсы:**
- CPU: 1 core 3.3GHz
- RAM: 1024MB
- Disk: NVMe 15GB (используется ~3MB)
- Network: 1000 Mbit/s

**Управление через API:**
```bash
# Статус приложения
curl -s https://api.timeweb.cloud/api/v1/apps/156285 \
  -H "Authorization: Bearer $TIMEWEB_API_TOKEN" | python3 -m json.tool

# Деплой (ручной)
curl -s -X POST https://api.timeweb.cloud/api/v1/apps/156285/deploy \
  -H "Authorization: Bearer $TIMEWEB_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"commit_sha": "main"}'

# Обновить env-переменные
curl -s -X PATCH https://api.timeweb.cloud/api/v1/apps/156285 \
  -H "Authorization: Bearer $TIMEWEB_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"envs": {"GMAIL_USER": "buket.29roz@gmail.com", "GMAIL_PASS": "..."}}'
```

**API токены (хранятся в dev-hub/.env.local):**
- `TIMEWEB_API_TOKEN` — для управления приложением
- `CLOUDFLARE_API_TOKEN` — для управления DNS

### ❌ УДАЛЁН: DigitalOcean App Platform (удалён 16.02.2026)

- Бывший App ID: 2abf27ce-9f4d-4e0d-8b08-5c2ed3e5b5ad
- Причина миграции: переход на российский хостинг (дешевле, нет блокировок)

### ❌ УДАЛЁН: Heroku (удалён 15.02.2026)

Приложение karnaval-cvetov полностью удалено с Heroku.

---

## DNS и Cloudflare

DNS управляется через **Cloudflare** (не reg.ru).

- **Cloudflare Zone ID:** `ac3fb559cd8d8da6c611293f84bfcdea`
- **NS-серверы (прописаны в reg.ru):** eleanor.ns.cloudflare.com, jim.ns.cloudflare.com
- **Зона:** active

### DNS-записи (Cloudflare):
| Тип | Имя | Значение | Proxy | ID записи |
|-----|-----|----------|-------|-----------|
| A | @ | 5.42.220.31 | ⚪ DNS only | 4c23788ea060719282b4ba622c0ae822 |
| A | www | 5.42.220.31 | ⚪ DNS only | 47270424f169393209602e16c258a878 |

### Почему proxy выключен:
- Timeweb — российский хостинг, IP `5.42.220.31` не блокируется провайдерами
- Cloudflare proxy не нужен — только замедляет
- SSL управляется Timeweb (Let's Encrypt)

---

## История миграций

| Дата | Событие |
|------|---------|
| 15.02.2026 | Создано на Heroku, затем удалено. Мигрировано на DigitalOcean App Platform |
| 15.02.2026 | DNS перенесён с reg.ru на Cloudflare (для proxy) |
| 16.02.2026 | Мигрировано с DigitalOcean на Timeweb Cloud. DO удалён |
| 16.02.2026 | Cloudflare proxy отключён (не нужен для российского хостинга) |

---

## Запуск локально
```bash
npm install
GMAIL_USER=buket.29roz@gmail.com GMAIL_PASS=<app-password> node server.js
# → http://localhost:3000
```
