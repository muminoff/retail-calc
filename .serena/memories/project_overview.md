# Project Overview

## Project Name
Savdo Kalkulyatori - Telegram Mini App for trade calculations

## Purpose
A Telegram Mini App designed for calculating retail prices for products with features including:
- Weight-based shipping calculation (15,000 KRW/kg)
- Adjustable profit margin (0-80%)
- Real-time KRW to UZS exchange rate conversion
- Automatic price rounding to nearest 1,000 UZS
- Barcode generation for products
- Dark/Light theme support (follows Telegram theme)

## Tech Stack
- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI based)
- **Styling**: Tailwind CSS
- **Telegram Integration**: @telegram-apps/sdk-react
- **Barcode Generation**: bwip-js
- **Deployment**: Vercel (previously Cloudflare Pages)
- **Bot Backend**: Node.js serverless functions on Vercel

## Project Type
This is a Telegram Mini App that runs inside Telegram messenger as a web application.