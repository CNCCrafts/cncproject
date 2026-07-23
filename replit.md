# CNCCrafts E-Commerce

A full-stack CNC art & custom designs e-commerce platform.

## Stack
- **Frontend**: React + Vite (in `/client`)
- **Backend**: Express.js + better-sqlite3 (in `/server`)
- **Database**: SQLite — auto-created at `server/cnc_ecom.db`

## Running the Project

Two workflows run in parallel:
- **Backend**: `cd server && node index.js` — serves the API on port 5000
- **Frontend**: `cd client && npm run dev` — Vite dev server on port 5173, proxies `/api` to port 5000

For production, build the client with `cd client && npm run build` — the Express server serves the static files.

## Features
- Modern navbar with cart count badge
- Home page with hero, category grid, and features section
- Categories page with 5 sections: Acrylic Art, MDF Art, ACP, PVC, 3D Designs
- 15 sample products pre-seeded into SQLite
- Functional cart with checkout (places orders via API)
- Admin dashboard at `/admin` — manage products, inventory, and orders
- Orders decrement stock automatically on placement

## Admin Panel (`/admin`)
- **Dashboard**: Revenue, order counts, low-stock alerts
- **Products**: Add/edit/delete products, toggle active/hidden
- **Inventory**: Update stock quantities for each product
- **Orders**: View order details, update status (pending → confirmed → shipped → delivered)

## User preferences
- Keep project structure as `/client` (frontend) and `/server` (backend)
- Indian Rupee (₹) for prices
- Professional, fluid design with gold accent color
