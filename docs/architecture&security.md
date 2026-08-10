# Architecture — Expense Tracker

## 1. Architecture Overview

The Expense Tracker is a client-side, local-first web application.

The initial architecture intentionally has no backend.

```text
┌──────────────────────────────┐
│         User Interface       │
│       React + TypeScript     │
├──────────────────────────────┤
│        Application Layer     │
│ State + Business Logic       │
│ Validation + Calculations    │
├──────────────────────────────┤
│         Data Layer           │
│      IndexedDB Storage       │
└──────────────────────────────┘
```

There should be no network dependency for core application functionality.

## 2. Technology Stack

Recommended V1 stack:

```text
Frontend
├── React
├── TypeScript
├── Vite
├── Tailwind CSS
├── Recharts
└── IndexedDB
```

A small IndexedDB wrapper/library may be used if it provides a clear improvement in reliability and developer experience.

Do not introduce large state-management or backend frameworks without a demonstrated need.

## 3. Architectural Principles

### Local First

The user's expense data lives locally.

The application should work without a backend.

### Separation of Concerns

Keep these concerns separate:

```text
UI
↓
Application logic
↓
Domain calculations
↓
Storage
```

React components should not contain large amounts of database logic.

### Single Source of Truth

Expense records should be the source of truth.

Dashboard metrics should be derived from expense records rather than stored independently.

For example:

Do not store:

```text
monthlyTotal = 4280
```

as a second permanent source of truth if it can be calculated from:

```text
expenses[]
```

This prevents stale analytics after edits or deletions.

## 4. Suggested Project Structure

```text
src/
├── components/
│   ├── ui/
│   ├── expenses/
│   ├── dashboard/
│   └── charts/
│
├── pages/
│   ├── Dashboard/
│   └── Expenses/
│
├── features/
│   └── expenses/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── calculations/
│       └── validation/
│
├── lib/
│   ├── db/
│   ├── dates/
│   └── formatting/
│
├── types/
│   └── expense.ts
│
├── app/
│   └── ...
│
└── main.tsx
```

The exact structure can be adjusted during implementation, but responsibilities should remain separated.

## 5. Data Flow

### Creating an Expense

```text
User
 ↓
Add Expense UI
 ↓
Form Validation
 ↓
Expense Service
 ↓
IndexedDB
 ↓
Application State Update
 ↓
Dashboard Recalculation
 ↓
UI Update
```

### Editing an Expense

```text
User
 ↓
Edit Expense UI
 ↓
Validation
 ↓
Expense Service
 ↓
IndexedDB Update
 ↓
State Update
 ↓
Recalculate Analytics
 ↓
UI Update
```

### Deleting an Expense

```text
User
 ↓
Delete Action
 ↓
Confirmation
 ↓
Expense Service
 ↓
IndexedDB Delete
 ↓
State Update
 ↓
Recalculate Analytics
 ↓
UI Update
```

## 6. Storage

IndexedDB should be used for persistent expense storage.

Reasoning:

* Structured data storage
* Asynchronous API
* Better suited to growing datasets than a single localStorage JSON object
* Persistent browser storage
* Supports indexes
* Keeps the architecture local-first

The application should use a small data-access abstraction rather than directly accessing IndexedDB throughout the UI.

Conceptually:

```text
ExpenseRepository
├── create()
├── getById()
├── getAll()
├── update()
└── delete()
```

The rest of the application should not need to know IndexedDB implementation details.

## 7. Expense Entity

Conceptual TypeScript model:

```text
Expense
├── id: string
├── amount: number
├── description?: string
├── category?: ExpenseCategory
├── date: string
├── createdAt: string
└── updatedAt: string
```

### ID

Must be unique.

UUID or another collision-resistant identifier is appropriate.

### Amount

Store the amount as a number representing the user's currency amount.

Avoid storing formatted strings such as:

```text
"₹1,250"
```

The currency symbol belongs to the presentation layer.

### Date

Use a consistent representation.

The implementation must be careful with timezone conversion so that an expense recorded for a local calendar date does not unexpectedly move to the previous/next day because of UTC conversion.

For date-only expense records, the application should treat the expense date primarily as a calendar date rather than a timestamp.

### createdAt / updatedAt

These are useful for auditing and future functionality.

They should not determine the expense's calendar date.

## 8. Domain Calculations

Analytics should be implemented as reusable functions/services.

Examples:

```text
calculateTotal(expenses)
calculateDailyTotal(expenses, date)
calculateWeeklyTotal(expenses, range)
calculateMonthlyTotal(expenses, month)
calculateCustomRangeTotal(expenses, startDate, endDate)
groupByCategory(expenses)
groupByDate(expenses)
```

These functions should be deterministic.

Given the same expense records and date range, they should always produce the same result.

## 9. Chart Data

Charts should consume derived data rather than directly manipulating raw expenses.

Example:

```text
Raw expenses
     ↓
Date aggregation
     ↓
Chart-ready data
     ↓
Recharts
```

For a monthly chart:

```text
[
  { date: "Aug 1", total: 250 },
  { date: "Aug 2", total: 0 },
  { date: "Aug 3", total: 420 }
]
```

Whether zero-spending dates are displayed should be determined by the chart design, but the underlying aggregation must correctly account for the complete selected period.

## 10. Date Handling

Date handling is a critical part of the application.

The implementation must distinguish between:

* Calendar dates
* Timestamps
* Date ranges

Expense dates should represent the user's local calendar date.

The application should not accidentally shift dates due to UTC serialization.

Date-range calculations must be inclusive unless the product explicitly defines otherwise.

Example:

```text
Start: Aug 1
End: Aug 5
```

includes:

```text
Aug 1
Aug 2
Aug 3
Aug 4
Aug 5
```

## 11. State Management

Use the simplest state-management solution that remains maintainable.

React state/context/hooks may be sufficient for V1.

Do not introduce Redux or another global state framework merely because the application has multiple screens.

The important separation is:

```text
Persistent data
+
Derived application state
+
UI state
```

For example:

Persistent:

```text
expenses
```

Derived:

```text
monthlyTotal
categoryTotals
dailyTotals
```

UI state:

```text
selectedDateRange
isAddExpenseOpen
editingExpenseId
selectedCategory
```

## 12. Reusable Components

Components should be created around meaningful UI responsibilities.

Potential components:

```text
Dashboard
SummaryCard
DateRangeSelector
SpendingChart
CategoryBreakdown
RecentExpenses
ExpenseList
ExpenseListItem
ExpenseForm
ExpenseAmountInput
CategorySelector
DeleteConfirmation
EmptyState
```

Avoid creating dozens of components that provide no meaningful abstraction.

## 13. Navigation

The application can use client-side routing if multiple logical screens require it.

A simple V1 may contain:

```text
/
  Dashboard

/expenses
  Expense History
```

The Add Expense interaction can be a modal/bottom sheet rather than a separate route.

The final decision should prioritize mobile usability.

## 14. Charting

Use Recharts for analytical visualizations.

Recommended initial charts:

### Spending Trend

Line or area-style visualization showing spending across the selected date range.

### Category Breakdown

Pie/donut-style visualization for category proportions where appropriate.

Avoid adding charts that do not communicate meaningful information.

## 15. Styling

Tailwind CSS should be used for the design system and responsive styling.

The UI should follow `UI_UX_SPEC.md` once that document is created.

Do not allow individual components to invent unrelated:

* Border radii
* Shadows
* Font sizes
* Spacing values
* Colors

Use a consistent design system.

## 16. Persistence Lifecycle

On application startup:

```text
Application starts
 ↓
Initialize database
 ↓
Load expenses
 ↓
Populate application state
 ↓
Calculate derived values
 ↓
Render dashboard
```

If storage initialization fails, the application should show a user-friendly error state rather than silently pretending data was loaded.

## 17. Error Handling

Storage and application errors should be handled at appropriate boundaries.

User-facing errors should be human-readable.

Development logging may include technical details.

Do not expose stack traces or database implementation details to normal users.

## 18. Future Extension Points

The architecture should leave reasonable room for future features without implementing them now.

Potential future additions:

* Budgets
* Recurring expenses
* Export/import
* PWA installation
* Cloud backup
* Authentication
* Cross-device synchronization

However, V1 must not prematurely implement these systems.

If cloud synchronization is eventually introduced, the local repository abstraction should make it possible to add a remote data source without rewriting the entire UI.

---

# Security & Privacy — Expense Tracker

## 1. Security Philosophy

This application does not have user accounts or a backend.

Therefore, traditional authentication and server-side authorization are not applicable to V1.

The primary security goals are:

1. Keep expense data local.
2. Prevent malicious input from becoming executable content.
3. Validate all user-controlled values.
4. Avoid unnecessary external data transmission.
5. Avoid exposing secrets.
6. Protect data integrity within the limits of browser storage.

## 2. Data Privacy

Expense records may contain sensitive personal information.

Examples:

```text
Salary-related spending
Medical purchases
Travel
Shopping
Bills
Personal activities
```

The application should therefore follow a privacy-first approach.

V1 must not send expense records to:

* Analytics platforms
* Advertising platforms
* External APIs
* Backend servers

unless explicitly introduced later as a product requirement.

## 3. No Authentication

There is intentionally no:

* Login
* Registration
* Password
* Session management
* OAuth
* User account

Do not add authentication as a "security improvement."

Authentication would conflict with the current product requirements.

## 4. Local Storage Security

IndexedDB provides browser-level local persistence, but it should not be described as encryption.

The application must not claim:

> "Your data is encrypted."

unless actual encryption is implemented and verified.

Similarly, local storage should not be described as completely secure.

Other software, browser extensions, malicious scripts, or a compromised device can potentially affect locally stored data.

The product should simply state that expense data is stored locally and is not intentionally uploaded to a server.

## 5. Input Validation

All user input must be validated before storage.

### Amount

Reject:

* Empty values
* Negative values
* Zero
* NaN
* Infinity
* Invalid numeric strings
* Unreasonably large values

Accept:

* Positive integers
* Positive decimal amounts

### Description

Description is user-controlled content.

It must be rendered safely.

Never inject description text directly into HTML.

React's normal escaped rendering should be preferred.

Avoid:

```text
dangerouslySetInnerHTML
```

unless there is a specific and reviewed requirement.

### Category

Only recognized category values should be accepted when using predefined categories.

Do not trust arbitrary category values simply because they came from the UI.

### Date

Validate that the date is valid and conforms to the expected representation.

## 6. XSS Prevention

Expense descriptions are untrusted input.

For example, a malicious user could attempt to enter HTML/JavaScript into the description field.

The application must render it as plain text.

React's default escaping behavior should be retained.

Do not:

* Execute user-provided HTML
* Insert user input into raw HTML
* Use unsafe HTML rendering
* Construct executable JavaScript from expense data

## 7. CSV Export Security

If CSV export is implemented later, exported values must be handled carefully.

Spreadsheet formula injection can occur when cells begin with characters such as:

```text
=
+
-
@
```

If a description or other user-controlled field is exported, the export implementation should protect against spreadsheet formula interpretation.

CSV export is not required for V1, but the architecture should account for this if added.

## 8. Dependencies

Only necessary dependencies should be installed.

Before adding a package, determine:

* Why it is needed
* Whether the functionality can be implemented with existing dependencies
* Whether the package is maintained
* Whether it introduces unnecessary security risk

Avoid installing large libraries for trivial functionality.

## 9. Secrets

There should be no secret API keys in V1.

Because the application is entirely local-first, environment variables containing production secrets should not be necessary.

Do not create fake API keys or placeholder credentials and accidentally treat them as production configuration.

## 10. External Requests

Core application functionality should not require external network requests.

If an external service is introduced later, it must be explicitly documented.

The agent must not add:

* Tracking scripts
* Advertising scripts
* Analytics SDKs
* Remote logging
* External fonts or resources

without an explicit product decision.

## 11. Content Security Policy

A Content Security Policy should be considered during production deployment.

The policy should be restrictive enough to prevent unnecessary script execution and unauthorized external connections while still allowing the application's required resources.

Do not introduce a CSP configuration that breaks the application without testing it.

## 12. Browser Security

The application should avoid unnecessary browser capabilities.

It does not need access to:

* Camera
* Microphone
* Location
* Contacts
* Clipboard beyond explicit user actions
* Notifications

unless a future feature explicitly requires them.

## 13. Data Integrity

All mutations should go through a controlled data-access layer.

Do not allow random UI components to directly mutate IndexedDB.

This helps ensure:

* Consistent validation
* Consistent data structure
* Easier testing
* Fewer accidental corruptions

## 14. Deletion

Deletion is destructive.

The UI should prevent accidental deletion through an appropriate confirmation interaction.

The underlying delete operation should identify the exact expense by ID rather than relying on array position.

Bad:

```text
delete expense at index 3
```

Preferred:

```text
delete expense with ID expense_123
```

## 15. Error Disclosure

User-facing errors should not expose internal implementation details.

Avoid displaying:

```text
DOMException: TransactionInactiveError
```

Instead:

```text
Something went wrong while saving your expense.
Please try again.
```

Technical errors can be logged during development.

## 16. Security Boundaries

The application has one primary trust boundary:

```text
User input
     ↓
Validation
     ↓
Application logic
     ↓
Local persistence
```

All values coming from forms, imported data, or future integrations must be treated as untrusted.

## 17. Future Cloud Synchronization

If cloud synchronization is introduced in a future version, the security architecture must be reconsidered.

At minimum it would require:

* Authentication
* Authorization
* Secure transport
* Server-side validation
* Database security
* Account recovery
* Session management
* Data deletion procedures
* Privacy policy considerations

None of these should be implemented in V1.

## 18. Security Acceptance Criteria

V1 should satisfy the following:

* No authentication exists.
* No expense data is sent to a backend.
* No unnecessary third-party tracking exists.
* Expense descriptions render as text.
* Invalid amounts cannot be saved.
* Invalid dates cannot be saved.
* Expense IDs are unique.
* Delete operations use IDs.
* No secrets are present in client-side code.
* User-facing errors do not expose internal stack traces.
* Core functionality works without network access.
* The application does not falsely claim that local data is encrypted.
