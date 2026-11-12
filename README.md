
# FinTrack — Personal Finance Tracker

FinTrack is a responsive personal finance tracking application built with HTML, CSS, and vanilla JavaScript. It helps users record income and expenses, monitor their balance, and understand their spending habits through a simple dashboard.

## Live Demo

**[Open FinTrack](https://fintrack-ruby-phi.vercel.app)**

## Features

- Add income and expense transactions.
- View total balance, income, and expenses.
- Categorise transactions.
- View monthly spending by category.
- Search transactions.
- Delete transactions.
- Automatically save data using browser LocalStorage.
- Responsive interface for desktop and mobile devices.

## Tech Stack

- **HTML5** — Application structure.
- **CSS3** — Styling and responsive layout.
- **JavaScript (ES6+)** — Application logic and DOM manipulation.
- **LocalStorage API** — Client-side data persistence.
- **Vercel** — Deployment and hosting.
- **Git & GitHub** — Version control.

## Project Structure

```text
fintrack/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

To run FinTrack locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/krishtarwey/fintrack.git
   ```

2. Open the project folder:

   ```bash
   cd fintrack
   ```

3. Open `index.html` in your browser.

No additional dependencies or build tools are required.

## Data Storage

FinTrack uses the browser's LocalStorage API to save transactions. Data remains available in the same browser on the same device after refreshing the page.

Transactions are not synchronised across devices or users.

## Future Improvements

- Edit existing transactions.
- Interactive spending charts.
- Monthly budget management.
- Export transactions to CSV.
- Backend integration and cloud database.
- User authentication.

## Author

**Krish Tarwey**

- GitHub: [@krishtarwey](https://github.com/krishtarwey)
- Project Repository: [FinTrack](https://github.com/krishtarwey/fintrack)
- Live Application: [fintrack-ruby-phi.vercel.app](https://fintrack-ruby-phi.vercel.app)

---

If you find this project useful, feel free to explore the repository!
