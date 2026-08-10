# Product Requirements Document — Expense Tracker

## 1. Product Definition

### Product Name

Working name: Expense Tracker

### Product Type

Local-first personal expense tracking web application.

### Primary Goal

Allow a user to record personal expenses quickly and provide simple visual analytics that help them understand their spending over time.

## 2. Core User Stories

### Expense Recording

As a user, I want to quickly enter an expense so that I can keep my spending history up to date.

### Expense History

As a user, I want to see my previous expenses so that I can understand where my money went.

### Expense Editing

As a user, I want to correct an expense if I entered the wrong amount, description, category, or date.

### Expense Deletion

As a user, I want to remove an expense that was entered incorrectly.

### Dashboard

As a user, I want to see my spending totals immediately so that I know how much I have spent.

### Time-Based Analysis

As a user, I want to switch between daily, weekly, monthly, and custom periods so that I can analyze spending at different levels.

### Category Analysis

As a user, I want to see how much I spend in different categories so that I can identify where most of my money goes.

## 3. Functional Requirements

## 3.1 Add Expense

The application must provide an Add Expense interaction.

### Fields

#### Amount

Required.

Rules:

* Must contain a valid numeric value.
* Must be greater than zero.
* Decimal values should be supported.
* Negative values are not allowed.
* Empty values are not allowed.

Example:

```text
₹100
₹250.50
```

#### Description

Optional.

Examples:

```text
Lunch
Uber to office
New headphones
Electricity bill
```

The application should not require a description.

#### Category

Optional.

Suggested default categories:

```text
Food
Travel
Shopping
Bills
Health
Entertainment
Education
Work
Other
```

#### Date

Required.

Default value:

> Current date

The user must be able to select another date.

Future dates may be restricted unless explicitly supported by the product requirements.

### Save Behavior

When the user saves:

1. Validate the form.
2. Create a unique expense ID.
3. Store the expense locally.
4. Update application state.
5. Recalculate affected dashboard values.
6. Update expense history.
7. Close the entry interface or return to the appropriate previous view.
8. Provide lightweight confirmation.

No full-page refresh should occur.

## 3.2 Expense History

The application must display saved expenses in chronological order.

Each expense should communicate:

* Amount
* Description/category
* Date

Example:

```text
₹250    Fuel
        Travel
        Today
```

Expenses should be grouped by date where appropriate.

Example:

```text
August 9

₹250   Fuel
₹100   Lunch
₹40    Chai

Total: ₹390
```

## 3.3 Edit Expense

Users must be able to edit an existing expense.

Editable fields:

* Amount
* Description
* Category
* Date

After editing:

* Validate the updated values.
* Persist the changes.
* Recalculate affected totals.
* Update charts.
* Update the history immediately.

If an expense's date changes from August 1 to August 9, both August 1 and August 9 calculations must be updated correctly.

## 3.4 Delete Expense

Users must be able to delete an expense.

Deletion should not happen accidentally.

A confirmation mechanism should be used where appropriate.

After deletion:

* Remove the record from local storage.
* Update totals.
* Update charts.
* Update history.
* Update category calculations.

## 3.5 Dashboard

The dashboard is the main analytical screen.

### Primary Spending Metric

Display the total spending for the currently selected period.

Example:

```text
₹4,280

Spent this month
```

The label must dynamically reflect the selected period.

### Quick Summary

The dashboard should provide useful summary values such as:

* Today
* This week
* This month

These can be presented as compact cards or similar visual elements.

### Spending Trend

Display spending over time using Recharts.

The chart must reflect the selected period.

For example:

Monthly view:

```text
Aug 1 → Aug 31
```

should display daily spending values.

Weekly view:

```text
Mon → Sun
```

should display spending by day.

Daily view can display the day's expense distribution or an appropriate summary when a time-of-day field is not available.

The implementation must not fabricate hourly data when the underlying expense model does not contain timestamps suitable for that analysis.

### Category Breakdown

Display spending grouped by category.

A donut/pie chart may be used when the number of categories is small enough to remain readable.

A list alongside the visualization should show:

```text
Food          ₹2,140
Travel        ₹1,280
Shopping      ₹860
Bills         ₹500
Other         ₹220
```

The values must be calculated from actual stored expenses.

### Recent Expenses

The dashboard should provide a compact view of recent expenses.

A "View all" interaction should lead to the complete expense history.

## 3.6 Date Filtering

The dashboard must support four modes:

```text
Daily
Weekly
Monthly
Custom
```

### Daily

User selects a specific date.

Display:

* Total for that day
* Relevant expenses
* Category distribution
* Appropriate trend/detail visualization

### Weekly

User selects a week.

Display daily totals across that week.

### Monthly

User selects a month.

Display daily totals across that month.

### Custom

User selects:

```text
Start date
End date
```

The application must include expenses where:

```text
startDate <= expenseDate <= endDate
```

The selected date range must be consistently applied across:

* Total spending
* Trend chart
* Category breakdown
* Relevant expense lists

## 3.7 Search and Filtering

A basic expense search/filter system may be included in V1 if it does not complicate the primary experience.

Potential filters:

* Category
* Date
* Search text

Search should match fields such as:

* Description
* Category

Do not introduce an overly complex filtering system.

## 3.8 Empty States

The application must have meaningful empty states.

For a new user:

```text
No expenses yet

Start tracking your spending by adding
your first expense.

[ Add Expense ]
```

For a period with no spending:

```text
Nothing spent

There are no expenses for this period.
```

Empty states must not look like application errors.

## 3.9 Error States

Errors should be understandable to a normal user.

Avoid technical messages such as:

```text
IndexedDB transaction failed
```

Instead communicate:

```text
We couldn't save that expense.
Please try again.
```

Technical details may be logged for development but should not unnecessarily appear in the user interface.

## 3.10 Loading States

Core local operations should normally be fast enough that extensive loading screens are unnecessary.

Where asynchronous storage operations create visible delays, use subtle loading indicators rather than blocking the entire interface.

## 3.11 Responsive Requirements

The application is mobile-first.

Primary target:

* Mobile web
* Mobile browser
* Narrow screens

It must also work on:

* Tablets
* Desktop browsers

The desktop layout should expand naturally rather than simply stretching the mobile interface.

## 3.12 Accessibility

The application should:

* Use semantic HTML where practical.
* Provide accessible labels for form controls.
* Maintain sufficient text/background contrast.
* Provide visible focus states.
* Support keyboard navigation.
* Use touch targets large enough for mobile interaction.
* Avoid relying solely on color to communicate meaning.
* Respect reduced-motion preferences where applicable.

## 3.13 Theme

Support:

* Light mode
* Dark mode
* System preference

Theme changes must not affect the underlying expense data.

## 4. Non-Functional Requirements

### Performance

Primary interactions should feel immediate.

No network request should be necessary for:

* Adding expenses
* Editing expenses
* Deleting expenses
* Viewing history
* Calculating analytics

### Reliability

Expense data should persist across:

* Page refresh
* Browser restart
* Normal application updates

### Privacy

Expense records should remain local to the device in V1.

### Maintainability

Business logic must not be tightly coupled to UI components.

Storage, calculations, validation, and presentation should have clear separation.

## 5. V1 Acceptance Criteria

### Add Expense

* User can enter an amount.
* Invalid amounts are rejected.
* User can optionally enter a description.
* User can optionally select a category.
* Date defaults to today.
* User can change the date.
* Expense persists after refresh.

### Dashboard

* Total is mathematically correct.
* Daily filter works.
* Weekly filter works.
* Monthly filter works.
* Custom date range works.
* Charts reflect actual expense data.
* Category totals are accurate.

### CRUD

* Existing expenses can be edited.
* Existing expenses can be deleted.
* Changes immediately affect analytics.

### Persistence

* Data remains after refresh.
* Data remains after browser restart under normal browser storage behavior.

### UI

* Mobile experience is polished.
* Desktop experience is usable.
* Light mode works.
* Dark mode works.
* Empty/error states exist.
* No unnecessary authentication flow exists.

## 6. Out-of-Scope

The following are explicitly outside V1:

* Accounts
* Login
* Registration
* Passwords
* Cloud synchronization
* Backend
* Banking APIs
* Bank transaction imports
* Shared accounts
* Recurring expenses
* Budgets
* Notifications
* AI
* Receipt scanning
* Subscription tracking
* Investment tracking
* Financial advice

Future versions may add these only through an explicit product decision.
