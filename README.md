# Municipal Reporting Portal

# Coverage
![Lines](https://raw.githubusercontent.com/sudoers1/municipal-reporting-portal/badges/badges/badge-lines.svg)
![Statements](https://raw.githubusercontent.com/sudoers1/municipal-reporting-portal/badges/badges/badge-statements.svg)
![Functions](https://raw.githubusercontent.com/sudoers1/municipal-reporting-portal/badges/badges/badge-functions.svg)
![Branches](https://raw.githubusercontent.com/sudoers1/municipal-reporting-portal/badges/badges/badge-branches.svg)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Public Link](#public-link)

## Features

- **Geo-tagged issue submission** — pin-point problem locations on an interactive map
- **Photo uploads** — attach images to reports for better context
- **Status tracking** — citizens receive updates as their report moves through the workflow (Pending → In Progress → Resolved)
- **Issue categories** — potholes, water/drainage, streetlights, waste, and more
- **Admin dashboard** — municipal staff can view, filter, assign, and update reports

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | [Next.js](https://nextjs.org/) (React) |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) |
| Auth | better-auth |
| Maps | Leaflet |
| File Storage | Cloudinary |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sudoers1/municipal-reporting-portal.git
cd municipal-reporting-portal
```

2. Install dependencies:

```bash
npm install
```

### Environment Variables

Will be provided elsewhere.


### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To build for production:

```bash
npm run build
npm start
```

---
# Public Link
Click [here](https://municipal-reporting-portal-aja5cscdapgregar.brazilsouth-01.azurewebsites.net/) to see the deployed site