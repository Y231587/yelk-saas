# Yelk Finance — Installatiehandleiding

## Overzicht

Dit project is een productieklare Next.js 15 SaaS-applicatie voor Yelk Finance, gebouwd met:
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend/Database/Auth**: Supabase (`hiojwzvucapbiwlyycgs`)
- **Betalingen**: Mollie (iDEAL, SEPA-incasso, recurring)
- **Hosting**: Vercel

---

## 1. GitHub Repository aanmaken

```bash
# Ga naar de yelk-saas map
cd yelk-saas

# Init git
git init
git add .
git commit -m "feat: initial Yelk Finance SaaS codebase"

# Maak repo aan op GitHub en push
git remote add origin https://github.com/jouw-account/yelk-saas.git
git push -u origin main
```

---

## 2. Vercel deployment

### Via Vercel dashboard:
1. Ga naar [vercel.com](https://vercel.com) → **New Project**
2. Importeer uw GitHub repository
3. Framework preset: **Next.js** (wordt automatisch gedetecteerd)
4. Voeg onderstaande environment variables toe (zie sectie 4)
5. Klik **Deploy**

### Domeinen instellen:
- Ga naar **Settings → Domains**
- Voeg `yelkfinance.nl` toe → redir naar main deployment
- Voor subdomains: voeg `app.yelkfinance.nl` en `admin.yelkfinance.nl` toe
- Stel DNS in bij uw domeinprovider (A-record of CNAME naar Vercel)

---

## 3. Supabase configuratie

### Authenticatie instellingen:
1. Ga naar **Supabase Dashboard → Authentication → URL Configuration**
2. Stel in:
   - Site URL: `https://yelkfinance.nl`
   - Redirect URLs: 
     - `https://yelkfinance.nl/**`
     - `https://app.yelkfinance.nl/**`
     - `http://localhost:3000/**` (development)
3. Schakel **Email confirmations** in
4. Pas email templates aan naar uw huisstijl

### Admin account aanmaken:
```sql
-- Voer uit in Supabase SQL Editor na registratie
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@yelkfinance.nl';
```

### Storage bucket:
De `documents` bucket wordt automatisch aangemaakt via de SQL migratie.
Verifieer in **Storage** dat de bucket bestaat en private is.

---

## 4. Environment Variables

### Voor Vercel (Production):

| Variable | Waarde | Beschrijving |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hiojwzvucapbiwlyycgs.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase service role (SECRET!) |
| `MOLLIE_API_KEY` | `live_xxxx` | Mollie live API key |
| `NEXT_PUBLIC_MOLLIE_PROFILE_ID` | `pfl_xxxx` | Mollie profile ID |
| `NEXT_PUBLIC_APP_URL` | `https://yelkfinance.nl` | Hoofd URL |
| `NEXT_PUBLIC_PORTAL_URL` | `https://app.yelkfinance.nl` | Portaal URL |
| `MOLLIE_WEBHOOK_URL` | `https://yelkfinance.nl/api/webhook/mollie` | Webhook URL |

### Supabase keys ophalen:
1. Supabase Dashboard → **Project Settings → API**
2. Kopieer `anon` key en `service_role` key

---

## 5. Mollie configuratie

### Webhook instellen:
1. Log in op [mollie.com/dashboard](https://mollie.com/dashboard)
2. Ga naar **Developers → Webhooks**
3. Voeg toe: `https://yelkfinance.nl/api/webhook/mollie`

### Eerste betaling flow:
1. Klant registreert via `/register`
2. API maakt Mollie payment aan met iDEAL/SEPA opties
3. Klant wordt doorgestuurd naar Mollie checkout
4. Na betaling: webhook activeert automatisch het account
5. Klant krijgt email confirmatie + inloggegevens

### iDEAL activeren:
- In Mollie dashboard → **Settings → Website profiles**
- Activeer iDEAL, SEPA Direct Debit, Creditcard

---

## 6. Lokale ontwikkeling

```bash
# Clone de repo
git clone https://github.com/jouw-account/yelk-saas.git
cd yelk-saas

# Dependencies installeren
npm install

# Environment variabelen kopiëren
cp .env.example .env.local
# Vul uw waarden in .env.local

# Development server starten
npm run dev
# → http://localhost:3000
```

---

## 7. Domeinstructuur

| Domein | Route | Beschrijving |
|---|---|---|
| `yelkfinance.nl` | `/` (marketing) | Hoofdwebsite |
| `yelkfinance.nl/login` | `/login` | Inlogpagina |
| `yelkfinance.nl/register` | `/register` | Registratie |
| `yelkfinance.nl/dashboard` | `/dashboard` | Klantenportaal |
| `yelkfinance.nl/admin` | `/admin` | Adminportaal |

> **Tip**: Voor echte subdomain isolatie (app. en admin.) kunt u Vercel Projects voor elke subdomain aanmaken. In de huidige setup zijn alle routes in één Next.js app via route groups.

---

## 8. Admin account instellen

Na eerste deployment:

```bash
# 1. Registreer via /register met uw admin e-mailadres
# 2. Ga naar Supabase SQL Editor en voer uit:

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'uw-admin@email.nl';

# 3. Log opnieuw in — u heeft nu toegang tot /admin
```

---

## 9. PWA installatie voor klanten

Klanten kunnen de app installeren op hun telefoon:
1. Open `yelkfinance.nl/dashboard` in Chrome/Safari
2. Klik op "Delen" → "Toevoegen aan beginscherm"
3. De app start als native app op het scherm

---

## 10. Checklist vóór livegang

- [ ] Vercel environment variables ingevuld
- [ ] Supabase Auth redirect URLs geconfigureerd
- [ ] Admin account aangemaakt en rol ingesteld
- [ ] Mollie live API key ingevuld (niet test!)
- [ ] Mollie webhook URL geconfigureerd
- [ ] Domeinen gekoppeld in Vercel
- [ ] DNS ingesteld bij domeinregistrar
- [ ] SSL certificaten actief (Vercel doet dit automatisch)
- [ ] Test: registratie → betaling → webhook → login → dashboard
- [ ] Test: document uploaden
- [ ] Test: admin portaal zichtbaar met admin account
- [ ] Email templates aangepast in Supabase

---

## 11. Bekende limieten & uitbreidingen

### Uitbreidingen (roadmap):
- **Resend email API**: Voeg `RESEND_API_KEY` toe voor transactionele emails
- **iOS/Android via Capacitor**: Wrap de PWA in een native shell
- **Recurring Mollie subscriptions**: Uitbreiden webhook voor maandelijkse incasso
- **Boekhoudmodule**: Het `yelk-finance` Supabase project bevat al grootboek/BTW tabellen

### Support:
Voor vragen over de technische setup: info@yelkfinance.nl

---

*Gegenereerd voor Yelk Finance — Productie SaaS Codebase v1.0*
