# Karnaval Cvetov (karnaval-cvetov.ru)

## О проекте
Сайт доставки цветов в Архангельске. Статический сайт + API для отправки заказов в Telegram.

- **Стек:** Node.js 20, Express
- **Домен:** karnaval-cvetov.ru
- **Репозиторий:** github.com/superwidetrack/karnaval-cvetov

## Структура
```
server.js          — Express сервер (порт 3000)
public/index.html  — Главная страница (каталог букетов, формы заказа)
public/oferta.html — Публичная оферта
Procfile           — web: node server.js
package.json       — express ^4.21.0
```

## API эндпоинты
- `POST /api/order` — Заказ букета (name, phone, date, time, comment, product, price) → Telegram
- `POST /api/callback` — Заявка на обратный звонок (name, phone, comment) → Telegram
- Все заказы отправляются в Telegram группу «Интернет Магазин» через бота @feedback_29roz_bot

## Telegram бот
- **Бот:** @feedback_29roz_bot
- **Chat ID группы:** -4230269918
- **Группа:** «Интернет Магазин»
- Используется Telegram Bot API (HTTPS), не SMTP — Timeweb блокирует исходящие SMTP-порты

## Почта домена 29roz.ru
- **Яндекс Бизнес-почта:** info@29roz.ru
- **MX:** mx.yandex.net
- **Админка:** admin.yandex.ru
- Пароль приложения создан для info@29roz.ru

## Env-переменные
| Переменная | Описание | Тип |
|-----------|----------|-----|
| TELEGRAM_BOT_TOKEN | Токен бота @feedback_29roz_bot | SECRET |
| TELEGRAM_CHAT_ID | ID группы (-4230269918) | plain |
| PORT | Порт сервера (default: 3000) | plain |

---

## Хостинг и деплой

### Timeweb Cloud

- **App ID:** `156303`
- **IP:** `176.57.214.199`
- **Project ID:** `2166325`
- **Timeweb URL:** https://superwidetrack-karnaval-cvetov-439d.twc1.net
- **Локация:** ru-1 (Россия, Санкт-Петербург)
- **Framework:** express (Node.js 20)
- **GitHub:** superwidetrack/karnaval-cvetov (branch: main)
- **VCS тип:** `github` (через classic PAT)
- **Build cmd:** `npm install`
- **Run cmd:** `node server.js`
- **Auto-deploy:** ON (webhook — автодеплой при push в main)
- **Статус:** active
- **Стоимость:** 510 ₽/мес

**Ресурсы:**
- CPU: 1 core 3.3GHz
- RAM: 1024MB
- Disk: NVMe 15GB
- Network: 1000 Mbit/s

### Управление через API

**ВАЖНО:** Timeweb API токен содержит символ `#` — использовать **Python urllib**, не curl!

```python
# Шаблон для вызова Timeweb API
import urllib.request, urllib.parse, json, os

token = os.environ.get("TIMEWEB_API_TOKEN")  # из dev-hub/.env.local
app_id = "156303"

req = urllib.request.Request(
    f"https://api.timeweb.cloud/api/v1/apps/{app_id}",
    headers={"Authorization": f"Bearer {token}"}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())
print(json.dumps(data, indent=2, ensure_ascii=False))
```

```python
# Ручной деплой (обычно не нужен — auto-deploy включён)
import urllib.request, json, os

token = os.environ.get("TIMEWEB_API_TOKEN")
req = urllib.request.Request(
    "https://api.timeweb.cloud/api/v1/apps/156303/deploy",
    data=json.dumps({"commit_sha": "main"}).encode(),
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    },
    method="POST"
)
resp = urllib.request.urlopen(req)
print(resp.status, resp.read().decode())
```

### MCP-сервер timeweb-cloud

Глобально настроен в `~/.claude.json`. Доступен в любой сессии Claude Code.

**Доступные инструменты:**
- `get_apps_list` — список приложений
- `get_app` — информация о приложении (app_id: 156303)
- `create_app` — создание нового приложения
- `update_app` — обновление настроек
- `deploy_app` — деплой
- `get_app_logs` — логи приложения
- `delete_app` — удаление

**Использование:**
```
# Статус приложения
"Покажи статус приложения 156303 на Timeweb"

# Логи
"Покажи логи приложения 156303"

# Деплой
"Задеплой приложение 156303"
```

### API токены

Токены хранятся в **dev-hub** проекте (`/Users/alexandervoronin/My_programs/dev-hub/.env.local`):
- `TIMEWEB_API_TOKEN` — управление Timeweb Cloud
- `CLOUDFLARE_API_TOKEN` — управление DNS
- `GITHUB_TOKEN` — classic PAT (`ghp_...`) для VCS подключения

---

## DNS и Cloudflare

DNS управляется через **Cloudflare** (NS прописаны в reg.ru).

- **Cloudflare Zone ID:** `ac3fb559cd8d8da6c611293f84bfcdea`
- **NS-серверы (в reg.ru):** eleanor.ns.cloudflare.com, jim.ns.cloudflare.com

### DNS-записи:
| Тип | Имя | Значение | Proxy | ID записи |
|-----|-----|----------|-------|-----------|
| A | @ | 176.57.214.199 | DNS only | 4c23788ea060719282b4ba622c0ae822 |
| A | www | 176.57.214.199 | DNS only | 47270424f169393209602e16c258a878 |

### Timeweb DNS-записи (привязка домена к приложению):
| Домен | Record ID | app_id |
|-------|-----------|--------|
| karnaval-cvetov.ru | 80517843 | 156303 |
| www.karnaval-cvetov.ru | 80517845 | 156303 |

### Почему Cloudflare proxy выключен:
- Timeweb — российский хостинг, IP не блокируется провайдерами
- Proxy только замедляет (трафик через зарубежные серверы)
- SSL управляется Timeweb (Let's Encrypt через Caddy, автоматически)

### Управление DNS через API:
```python
# Обновить DNS-запись в Cloudflare
import urllib.request, json, os

cf_token = os.environ.get("CLOUDFLARE_API_TOKEN")
zone_id = "ac3fb559cd8d8da6c611293f84bfcdea"
record_id = "4c23788ea060719282b4ba622c0ae822"  # root A-record

req = urllib.request.Request(
    f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{record_id}",
    data=json.dumps({
        "type": "A",
        "name": "karnaval-cvetov.ru",
        "content": "176.57.214.199",
        "proxied": False
    }).encode(),
    headers={
        "Authorization": f"Bearer {cf_token}",
        "Content-Type": "application/json"
    },
    method="PUT"
)
resp = urllib.request.urlopen(req)
print(json.loads(resp.read()))
```

---

## Глобальные MCP-серверы

Настроены в `~/.claude.json`, доступны в любой сессии Claude Code:

| MCP Server | Назначение |
|------------|-----------|
| `timeweb-cloud` | Управление Timeweb Cloud (деплой, логи, статус) |
| `google-workspace` | Gmail, Google Drive, Calendar (superwidetrack@gmail.com) |
| `supabase` | База данных (проект vpsqylpzonpkjbylrwsa) |
| `digitalocean-mcp` | Legacy — DigitalOcean App Platform |

### Отправка email (google-workspace MCP):
```
# Отправить письмо от superwidetrack@gmail.com
send_gmail_message:
  user_google_email: "superwidetrack@gmail.com"
  to: "recipient@example.com"
  subject: "Тема"
  body: "Текст"
```

---

## История миграций

| Дата | Событие |
|------|---------|
| 15.02.2026 | Создано на Heroku, затем удалено |
| 15.02.2026 | DNS перенесён с reg.ru на Cloudflare |
| 15.02.2026 | Мигрировано на DigitalOcean App Platform |
| 16.02.2026 | Мигрировано с DO на Timeweb Cloud (App ID: 156303) |
| 16.02.2026 | Cloudflare proxy отключён (не нужен для российского хостинга) |
| 16.02.2026 | Auto-deploy включён (VCS тип github с webhook) |
| 16.02.2026 | Уведомления: Gmail SMTP → Yandex SMTP → Telegram Bot API (SMTP порты заблокированы на Timeweb) |

---

## Запуск локально
```bash
npm install
TELEGRAM_BOT_TOKEN=<bot-token> TELEGRAM_CHAT_ID=-4230269918 node server.js
# → http://localhost:3000
```
