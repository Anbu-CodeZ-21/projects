# SkillBridge – Freelancer Work Verification Platform

SkillBridge is a modern, responsive React.js web platform that connects Indian freelancers with clients, provides transparent milestone tracking, and enforces a strict **Work Verification Workflow** before project completion and payment settlement.

---

## 🎨 Unique Design System & Palette

- **Deep Forest Green:** `#123C32` (Primary Brand & Headers)
- **Emerald Green:** `#237A57` (Action Buttons, Success Badges & Verification Accents)
- **Warm Cream:** `#F7F5EF` (Background & Light Surfaces)
- **Terracotta:** `#C66A4A` (Client Accents, Revision Requests & Highlights)
- **Muted Gold:** `#D6B46A` (Star Ratings & Milestone Steppers)
- **Charcoal:** `#252A27` (Typography)
- **White:** `#FFFFFF` (Cards & Dialogs)

---

## 🚀 Key Features

1. **Strict Role Separation & Dedicated Portals:**
   - **Freelancers:** Browse jobs, filter by category/budget, submit bids with timeline estimates, update live milestone progress (0%–100%), submit verifiable deliverable links (GitHub, Figma, Live demo), and receive ratings.
   - **Clients:** Post projects with budgets in Indian Rupees (₹), review candidate bids, assign contractors with 1-click acceptance, inspect submitted deliverable URLs, and either approve completion or request revisions with targeted feedback.
   - **Protected Routes & Role Guards:** Freelancers cannot access client-only actions (like posting projects or approving work), and clients cannot access freelancer-only actions.

2. **Core 10-Step Work Verification Workflow:**
   1. Client creates and publishes a project (Status: `Open`).
   2. Freelancers explore the project and submit proposals with cover letters and bids in ₹.
   3. Client reviews bids and accepts one freelancer.
   4. The project becomes `In Progress` and other bids are closed.
   5. Freelancer updates progress slider milestones (e.g. 25%, 50%, 75%).
   6. Freelancer submits finished work with a live delivery URL and release notes (Status: `Submitted for Review`).
   7. Client receives notification and inspects the live deliverable link.
   8. Client can either:
      - **Approve Work & Release Payment:** Leaves star rating and testimonial (Status: `Completed`).
      - **Request Revisions:** Sends specific revision notes (Status: `Revision Requested`).
   9. Freelancer updates deliverables based on feedback and resubmits.
   10. Upon final approval, earnings in INR (₹) are credited to the freelancer's profile.

3. **Strict Indian Currency Standard (₹ INR):**
   - All budgets, hourly rates, bids, and earnings are displayed in Indian Rupees using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })`.
   - Examples: `₹5,000`, `₹12,500`, `₹45,000`, `₹1,00,000`.

4. **1-Click Instant Demo Logins:**
   - **Demo Freelancer:** Arjun Sharma (Senior Full-Stack MERN Developer) – `freelancer@skillbridge.in` / `password123`
   - **Demo Client:** TechNova Solutions India (Priya Nair) – `client@skillbridge.in` / `password123`
   - *Quick-switch button is directly accessible in the navbar dropdown and login page for easy demonstration.*

---

## 📁 Project Structure

```
skillbridge/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css                    # Comprehensive design system & variables
    ├── components/
    │   ├── Navbar.jsx               # Role-aware responsive navigation & drawer
    │   ├── Footer.jsx               # Footer with INR guarantee & sitemap
    │   ├── ProjectCard.jsx          # INR budget, skills tags, status badges
    │   ├── FreelancerCard.jsx       # Verified badge, hourly rate in ₹, rating
    │   ├── StatCard.jsx             # Metric card with color themes
    │   ├── StatusBadge.jsx          # Color-coded workflow badge
    │   ├── SearchBar.jsx            # Category & keyword search
    │   ├── EmptyState.jsx           # Reusable empty states with CTAs
    │   ├── ProtectedRoute.jsx       # Authentication guard
    │   ├── RoleRoute.jsx            # Freelancer vs Client role guard
    │   ├── Modal.jsx                # Accessible modal dialog
    │   └── Toast.jsx                # Notification alerts
    ├── context/
    │   └── AuthContext.jsx          # Authentication state & role management
    ├── data/
    │   └── mockData.js              # Realistic seed data for Indian ecosystem
    ├── layouts/
    │   ├── PublicLayout.jsx         # Public layout with Navbar & Footer
    │   ├── FreelancerLayout.jsx     # Freelancer workspace with role banner
    │   └── ClientLayout.jsx         # Client workspace with company banner
    ├── pages/
    │   ├── Home.jsx                 # Hero, search, workflow steps, categories
    │   ├── ChooseAccountType.jsx    # Role selection (Freelancer vs Client)
    │   ├── FreelancerRegister.jsx   # Freelancer signup with rate in ₹
    │   ├── ClientRegister.jsx       # Client signup with company details
    │   ├── Login.jsx                # Role toggle login & 1-click demo logins
    │   ├── FreelancerDashboard.jsx  # Earnings, active jobs, verification alerts
    │   ├── ClientDashboard.jsx      # Posted projects, review alerts, spending
    │   ├── ExploreProjects.jsx      # Multi-criteria filter & search in ₹
    │   ├── FindFreelancers.jsx      # Filter by skill, rate, and experience
    │   ├── FreelancerProfile.jsx    # Verified portfolio showcases & invite modal
    │   ├── ProjectDetails.jsx       # Milestone stepper, proposal management
    │   ├── PostProject.jsx          # Client project creation with INR budget
    │   ├── SubmitProposal.jsx       # Freelancer bid form with milestone days
    │   ├── MyProposals.jsx          # Proposal tracking (Pending/Accepted/Declined)
    │   ├── MyProjects.jsx           # Role-aware project management
    │   ├── WorkVerification.jsx     # Core deliverable inspection & approval hub
    │   ├── Notifications.jsx        # Notification center with read tracking
    │   ├── ProfileSettings.jsx      # Profile editor & demo data reset
    │   ├── About.jsx                # Vision, INR standard, verification pillars
    │   ├── Contact.jsx              # Support inquiry form & Bangalore HQ info
    │   └── NotFound.jsx             # 404 recovery page
    └── utils/
        ├── currency.js              # Indian Rupee (INR ₹) formatter
        ├── storage.js               # Safe localStorage persistence layer
        └── validators.js            # Form and URL validation helpers
```

---

## 🛠️ Installation & Running the Project

1. Clone or navigate to the project directory:
   ```bash
   cd d:\PROJECTS\skillbridge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL (typically `http://localhost:5173/`).

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Demo Data Notice

This project is a frontend single-page application that uses the browser's `localStorage` for demo persistence across page reloads. In a production environment:
- Plaintext passwords must be replaced with server-side bcrypt/argon2 hashing.
- Role authorization must be verified on an API server using JWT or secure session cookies.
- Real payment disbursements must integrate with compliant Indian payment gateways (such as Razorpay or Cashfree).
