# 🏛️ IdleSpaces — Public Asset & Equipment Sharing Platform

> **Build a trusted platform that helps institutions and communities safely share underused spaces, equipment and technical resources.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase_RLS-336791?logo=postgresql)](https://supabase.com/)
[![Security](https://img.shields.io/badge/Security-ISO%2FIEC_27001_Aligned-emerald)](#security--governance)

---

## 📌 Problem Statement

### **Problem: Unlock Underused Equipment and Spaces**
Colleges, laboratories, makerspaces, community organisations, and small businesses often own valuable resources that remain unused for long periods. These include:
- High-capacity auditoriums and cultural halls
- Advanced computing and artificial intelligence laboratories
- Sports pavilions, grounds, and multi-sport complexes
- Specialized testing tools, workshop machinery, and fabrication facilities

At the same time, nearby students, grassroots NGOs, independent researchers, creators, and early-stage social impact teams are priced out of renting commercial venues or purchasing specialized equipment.

### **The Trust, Safety & Governance Gap**
Ordinary consumer booking systems merely display calendar availability. They fail to solve the real operational, legal, and trust challenges of sharing public institutional property:
1. **Lack of Qualification & Eligibility Checks:** Technical spaces and valuable equipment require verified credentials (e.g., 80G tax registration for non-profits, CSR compliance for corporates, certified machine operators).
2. **Absence of Condition Auditing:** Owners risk equipment vandalism, property damage, and dispute deadlocks without verifiable proof of how an asset was handled before and after an event.
3. **Monopolization & Corruption Risks:** Unchecked reservation systems enable well-funded entities or insiders to repeatedly monopolize community assets, crowding out public good initiatives.
4. **Arbitrary Bureaucracy:** Legitimate applicants frequently face unexplained rejections without any statutory justification or paper trail.

---

## 💡 The Solution: IdleSpaces

**IdleSpaces** is an auditable, trust-first public asset stewardship platform that balances community access with institutional protection, strict transparency, and human oversight.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            IDLESPACES ARCHITECTURE                          │
├────────────────────┬────────────────────┬───────────────────────────────────┤
│  1. DISCOVER       │  2. VERIFY & QUOTA │  3. DEAN OVERSIGHT & PROOF        │
│  - Spaces & Labs   │  - 70% NGO Quota   │  - Mandatory Rejection Reason     │
│  - Capacity & Specs│  - Tier 1: NGO     │  - Immutable Audit Ledger         │
│  - Availability    │  - Tier 2: Corp    │  - Check-in/Out Photo Proof       │
└────────────────────┴────────────────────┴───────────────────────────────────┘
```

### Core Pillars:

* **Fair Allocation & Anti-Hoarding Quotas:** Enforces a **70% statutory reserved quota** for Tier 1 non-profit NGOs, grassroots community trusts, and educational youth groups. Commercial/corporate entities operate on Tier 2 allocation.
* **Anti-Corruption Audit Trail:** Every single state transition (Request ➔ Review ➔ Approval ➔ Rejection ➔ Check-In ➔ Return) is immutably committed to an audit log. Database-level constraints (**`chk_rejection_reason_mandatory`**) make it impossible for college administrators to reject an applicant without recording a legally valid written reason.
* **Condition Reports (Check-In & Check-Out Proof):** Pre-usage and post-usage photographic condition reports capture asset state, preventing dispute deadlocks and holding organizers accountable.
* **Owner Sovereignty with Human Oversight:** Verified college authorities (Deans of Administration) retain full control over bookings, scheduling conflicts, and maintenance exceptions.

---

## 🧭 Platform Features & Application Routes

| Route | Feature | Target User | Description |
|---|---|---|---|
| `/` | **Landing Portal** | Public | Bento Neo-Brutalist dashboard featuring live KPI metrics, 70% quota progress bars, and platform roadmap. |
| `/discover` | **Resource Discovery** | Public / Applicants | Filter by space type (Auditoriums, Computing Labs, Sports Grounds), search capacity, and launch reservation requests. |
| `/user/login` | **User & NGO Portal** | NGOs / Corporates | Dedicated authentication and instant self-service account registration with password strength meter. |
| `/login` | **Dean Authority SSO** | College Deans / Admins | Secure statutory login gateway with brute-force rate-limiting (5 attempts / 15-min lockout). |
| `/admin` | **Dean Review Ledger** | College Administrators | Institutional review workspace to review eligibility docs, inspect applicant priority, and record approvals/rejections. |
| `/bookings` | **Condition & Proof** | Verified Organizers | Check-in and check-out photo submission interface with real-time inspection records. |
| `/how-it-works`| **Lifecycle Guide** | All | Comprehensive 4-step walkthrough of the transparent allocation process. |
| `/about` | **Public Charter** | All | Statutory framework, anti-monopoly policies, and asset preservation standards. |

---

## 👥 Pre-Configured Demo Accounts for Evaluation

The platform includes pre-configured verified credentials for instant judging and testing without setting up external mail providers. 

> **Tip:** The login pages feature **1-Click Quick Fill** buttons at the bottom of the form for immediate authentication.

| Role | Classification | Name & Title | Email | Demo Password |
|---|---|---|---|---|
| **Institutional Admin** | College Authority | Dr. Rameshwar Sharma *(Dean of Admin)* | `dean.admin@college.gov.in` | `Admin@GovSecure2026!` |
| **NGO Applicant** | Tier 1 (70% Quota) | Ananya Deshmukh *(Secretary)* | `nodal.officer@prathamyouth.org` | `Ngo@Community2026!` |
| **Corporate Applicant**| Tier 2 (Commercial) | Vikramaditya Roy *(CSR Director)* | `csr.lead@apexinfo.com` | `Corp@Innovate2026!` |

---

## 🛠️ Technology Stack

* **Framework:** [Next.js 16.4.3](https://nextjs.org/) (App Router, Turbopack, React Server Actions)
* **UI & Rendering:** [React 19.3.0](https://react.dev/)
* **Type System:** [TypeScript 5](https://www.typescriptlang.org/)
* **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com/) with a curated **Frozen Mist Neo-Memphis Bento aesthetic** (`#FCF8D8` Canvas, `#1C1D1A` Charcoal Ink, `#DD700B` Cinnamon, `#7C7D75` Deep Slate).
* **Icons:** [Lucide React](https://lucide.dev/)
* **Date Utilities:** [date-fns v4](https://date-fns.org/)
* **Database & RLS:** [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs) + [PostgreSQL](https://www.postgresql.org/)
* **Security & Sessions:** In-memory fallback authentication store, SHA-256 salted hashing, and HttpOnly session cookies.

---

## 🗄️ Database Architecture (`schema.sql`)

IdleSpaces runs on a PostgreSQL schema designed for strict auditability and anti-corruption compliance:

```sql
-- 1. User Profiles & Tier Validation
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'ngo',     -- 'admin' | 'ngo' | 'corporate'
    name TEXT NOT NULL,
    tier INTEGER NOT NULL CHECK (tier IN (1, 2)),
    CONSTRAINT chk_user_tier_role CHECK (
        (role = 'ngo' AND tier = 1) OR
        (role = 'corporate' AND tier = 2) OR
        (role = 'admin')
    )
);

-- 2. Institutional Spaces & Labs
CREATE TABLE public.spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type space_type NOT NULL,                  -- 'auditorium' | 'computer_lab' | 'ground'
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 3. Reservations & Quota Tracking
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    space_id UUID NOT NULL REFERENCES public.spaces(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    eligibility_doc_url TEXT,
    CONSTRAINT chk_booking_dates CHECK (end_date >= start_date)
);

-- 4. Immutable Audit Ledger (Anti-Corruption Engine)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id),
    action TEXT NOT NULL,
    reason TEXT,
    performed_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Statutory Rule: Rejections require mandatory written justification
    CONSTRAINT chk_rejection_reason_mandatory CHECK (
        action != 'REJECTED' OR (reason IS NOT NULL AND length(trim(reason)) > 0)
    )
);

-- 5. Condition Reports (Check-In & Check-Out Proof)
CREATE TABLE public.condition_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id),
    phase report_phase NOT NULL,               -- 'check-in' | 'check-out'
    photo_url TEXT NOT NULL,
    notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 🔒 Security & Anti-Abuse Measures

1. **Brute Force Defense & Rate Limiting:**
   Tracks IP/email attempts in a sliding 15-minute window. If 5 consecutive failures occur, the account is automatically locked for 15 minutes, and a `SECURITY_EVENT` is logged.
2. **Mandatory Explainable Rejections:**
   Admins cannot reject a booking with a single click. A modal forces the officer to select from statutory grounds (e.g., date clash, insufficient eligibility documentation, scheduled college maintenance) with written notes.
3. **Tamper-Evident Session Tokens:**
   Encrypted base64 payloads serialized into `HttpOnly`, `SameSite=Lax`, secure cookies.
4. **Next.js 16 Proxy Convention (`proxy.ts`):**
   Automatic route-level guards protect `/admin` (requiring `role === 'admin'`) and `/bookings` while injecting strict headers (`X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/nithin-praveen/IdleSpaces.git
cd IdleSpaces
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The platform has built-in offline mock fallbacks for all demo accounts and catalog listings, so it works completely out of the box even without active Supabase cloud keys).*

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📄 License & Attribution
Developed for the **Public Asset & Equipment Sharing Initiative** to ensure equitable, transparent, and auditable allocation of state college infrastructure. Distributed under the MIT License.
