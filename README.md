# 👑 ApexFit — Luxury Performance Club Management System

A full-stack, enterprise-grade Gym Management System built with **React 19 + TypeScript + Vite + Tailwind CSS (`@tailwindcss/vite`) + Supabase Backend API + Express + Recharts**.

Designed with a high-end luxury dark aesthetic with obsidian glassmorphism panels, glowing amber/gold accents, dense readable telemetry, and responsive layouts.

---

## ⚡ Key Highlights & Architecture

- **Backend & Server API (`/api`)**: Complete REST API and Supabase integration handling members, memberships, automated renewals, payments, printable tax invoices & receipts, daily attendance desk, coaches, custom workout splits, and body measurement tracking.
- **Vite with Tailwind Package**: Fully configured with `@tailwindcss/vite` plugin according to strict Vite package standards.
- **Supabase Cloud Sync**: Configured with live Supabase credentials, dual-layer durability, and instant seed capabilities.
- **Executive Dashboard**: Realtime KPI cards, 7-Day Revenue Velocity (Recharts Area Chart), Hourly Floor Traffic Peak Load Bar Chart, Expiring Soon Alerts (<7 days), and live attendance feed.
- **Interactive Role Switcher**: Instant 1-click persona switching (Admin / Owner, Receptionist, Master Coach, VIP Member) for immediate assessment without logouts.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Full Application (Server + Frontend)
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`

---

## 🛠 Application Modules

1. **⚡ Executive Dashboard (`/`)**:
   - Total & Active member KPIs, revenue streams, and daily check-in counters.
   - Revenue & Hourly rush telemetry charts.
   - 1-click Fast Check-in modal & renewal action buttons.
2. **👥 Members Directory (`/members`, `/members/:id`)**:
   - Search & filtering by status (Active, Inactive, Blocked).
   - Full onboarding wizard modal with automated membership assignment & initial payment.
   - Deep Member Dossier: Virtual VIP Digital Membership Pass with barcode simulation, subscription logs, payments, attendance history, workout routines, and body composition graphs (Weight vs Body Fat %).
3. **💎 Memberships & Pricing (`/memberships`)**:
   - Pricing Tier Architect: Standard Monthly, Quarterly Pro, Half-Yearly Elite, and Annual Black Tier VIP.
   - Active Subscriptions monitor with expiration warnings and 1-click renewal with customizable discounts.
4. **⏱️ Attendance Access Desk (`/attendance`)**:
   - Realtime check-in desk with instant barcode / code scanner.
   - Live on-floor attendance roster with 1-click session checkout.
   - Historical attendance records archive.
5. **💳 Payments & Billing Ledger (`/payments`)**:
   - Financial transactions ledger with channel filters (UPI, Card, Cash, Bank Transfer).
   - Printable & Downloadable GST Tax Invoice & Official Receipt modal.
6. **🏆 Master Coaches & Trainers (`/trainers`)**:
   - Coaching roster with specializations, experience, compensation, and client assignments.
7. **🏋️ Workouts & Exercise Library (`/workouts`)**:
   - Custom workout split builder with sets, reps, target weights, and rest intervals.
   - 15+ built-in exercise database categorized by muscle groups.
8. **📈 Reports & Intelligence (`/reports`)**:
   - Payment method breakdown charts and attendance analytics with CSV export.
9. **⚙️ Club Settings (`/settings`)**:
   - Brand profile, operating hours, currency (₹), tax rate %, and 1-click demo database re-seeder.
