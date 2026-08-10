# Project Context — Expense Tracker

## 1. Project Overview

This project is a personal expense-tracking web application designed to make recording daily spending extremely quick and reviewing spending patterns easy.

The user can record an expense by entering an amount, what they spent it on, an optional category, and a date. Expenses are stored locally on the user's device and accumulated automatically into daily, weekly, monthly, and custom date-range analytics.

The application is intentionally simple:

* No account creation
* No login
* No authentication
* No backend
* No cloud database
* No server-side storage of expenses
* No unnecessary onboarding
* Local-first data storage
* Mobile-first experience
* Apple-inspired visual design
* Fast expense entry
* Useful spending analytics

The application should feel like a polished native personal finance utility rather than an enterprise finance dashboard.

## 2. Core Product Philosophy

The primary principle is:

> Recording an expense should take only a few seconds.

The user should not have to navigate through multiple pages or fill out a complicated form just to record ₹100 spent on lunch.

The secondary principle is:

> Analytics should help the user understand their spending without overwhelming them.

The dashboard should answer simple questions:

* How much have I spent today?
* How much have I spent this week?
* How much have I spent this month?
* Where is my money going?
* How has my spending changed over time?
* Which days had unusually high spending?

## 3. Example User Journey

A typical user opens the application after spending ₹100 on lunch.

They tap the Add Expense button.

They enter:

Amount: ₹100
Description: Lunch
Category: Food
Date: Today

They save the expense.

The application immediately:

1. Validates the input.
2. Stores the expense locally.
3. Updates the current day's total.
4. Updates the current week's total.
5. Updates the current month's total.
6. Updates relevant charts.
7. Updates the expense history.
8. Shows a lightweight confirmation.
9. Returns the user to the previous context.

No page reload should be required.

## 4. Target User

The primary user is an individual who wants a lightweight way to track personal spending.

The application is not initially intended for:

* Businesses
* Teams
* Accountants
* Shared household finances
* Multi-user financial management
* Banking integrations

## 5. Product Scope

### V1 Must Have

* Add expense
* Edit expense
* Delete expense
* Expense history
* Expense details
* Expense categories
* Dashboard
* Daily spending total
* Weekly spending total
* Monthly spending total
* Spending-over-time chart
* Category spending breakdown
* Date-range filtering
* Daily filter
* Weekly filter
* Monthly filter
* Custom date range
* Local persistence
* Responsive mobile-first UI
* Light mode
* Dark mode
* Empty states
* Basic validation

### V1 Should Not Have

Do not introduce these unless explicitly requested:

* Authentication
* User accounts
* Backend APIs
* Cloud database
* Payment systems
* Banking integrations
* AI spending analysis
* Social features
* Multi-user support
* Shared expenses
* Investment tracking
* Cryptocurrency tracking
* Receipt OCR
* Push notifications
* Email notifications

## 6. Data Ownership

The application follows a local-first privacy model.

Expense data belongs to the user and remains on their device.

The application should not transmit expense records to an external server because the V1 architecture does not require a backend.

The lack of authentication is intentional and is part of the product design.

## 7. Currency

The initial/default currency is Indian Rupees (₹ / INR).

The application should represent monetary values consistently.

Examples:

* ₹100
* ₹1,250
* ₹12,500

Avoid inconsistent formatting such as mixing `Rs.`, `INR`, and `₹` throughout the UI.

Currency selection can be considered for a future version but is not required for V1.

## 8. Expense Model

An expense represents one spending event.

Conceptually:

```text
Expense
├── id
├── amount
├── description
├── category
├── date
├── createdAt
└── updatedAt
```

### Required

* `id`
* `amount`
* `date`
* `createdAt`

### Optional

* `description`
* `category`

The user should be able to save a minimal expense without entering unnecessary information.

For example:

```text
₹50
```

should be a valid expense.

## 9. Categories

V1 should provide a small predefined category set.

Suggested categories:

* Food
* Travel
* Shopping
* Bills
* Health
* Entertainment
* Education
* Work
* Other

Categories should not become a complicated taxonomy.

The user should be able to record an expense quickly.

Custom categories can be considered later.

## 10. Dashboard Philosophy

The dashboard should prioritize information over decoration.

The first visual area should communicate the user's current spending clearly.

Recommended hierarchy:

1. Current period spending
2. Quick period summaries
3. Spending trend
4. Category breakdown
5. Recent expenses

The dashboard should not contain charts simply because charts are available.

Every visualization must answer a useful spending question.

## 11. Date Filters

The dashboard must support:

### Daily

Show spending for the selected day.

### Weekly

Show spending across the selected week.

### Monthly

Show spending across the selected month.

### Custom

Allow the user to select a start date and end date.

The selected range must affect all relevant dashboard metrics and visualizations consistently.

The application must not accidentally mix data from outside the selected period.

## 12. UI Direction

The visual direction is inspired by Apple's mobile design language.

This does not mean copying Apple's proprietary interfaces.

The desired characteristics are:

* Minimal
* Clean
* Spacious
* Mobile-first
* Content-focused
* Soft rounded surfaces
* Restrained use of shadows
* Strong typography hierarchy
* Subtle borders
* Smooth transitions
* Native-feeling controls
* High-quality empty states
* Clear touch targets
* Light and dark appearance support

The interface should feel calm rather than like a traditional financial dashboard.

## 13. Primary Navigation

The exact navigation structure can be refined during implementation, but the initial conceptual areas are:

* Dashboard
* Expenses
* Add Expense

The Add Expense action should remain easily accessible, preferably through a prominent floating or persistent action.

## 14. Performance Expectations

The application should feel instant for normal personal usage.

Adding an expense should not require:

* Network requests
* Loading screens
* Page refreshes
* Server round trips

Dashboard calculations should be performed locally.

The architecture should remain responsive even as the user's local expense history grows substantially beyond a few hundred records.

## 15. Offline Behavior

The application should work without an internet connection after the application has been loaded/installed.

Expense creation, editing, deletion, history, and analytics should not depend on network availability.

A future PWA implementation can improve offline installation and reliability, but V1 should already avoid network dependencies for core data operations.

## 16. Out-of-Scope Architectural Changes

The agent must not introduce:

* Firebase
* Supabase
* MongoDB
* PostgreSQL
* FastAPI
* Express
* Next.js backend APIs
* Authentication providers
* External analytics services

unless the user explicitly changes the product requirements.

The absence of a backend is an intentional architectural decision.

## 17. Success Criteria

The V1 is successful when a user can:

1. Open the application.
2. Add an expense in a few seconds.
3. Close/reopen the application.
4. Still see the expense.
5. View total spending for a selected period.
6. Change between daily, weekly, monthly, and custom views.
7. Understand spending trends from the charts.
8. See category-level spending.
9. Edit an incorrect expense.
10. Delete an expense.
11. Use the application comfortably on a mobile screen.

The application should feel finished and coherent rather than like a collection of CRUD screens.
