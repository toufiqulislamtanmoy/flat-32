# Homepage UI Specification

## Goal

Design a modern, responsive dashboard homepage for the Flat Mate application.

This task is **UI only**.

Do **NOT** connect to any backend, API, database, or state management.

Use mock/static data wherever necessary.

The page should be built with reusable components and be easy to integrate with backend APIs later.

---

# Design Principles

The homepage should immediately answer three questions:

1. How many plans do I have?
2. What is the overall financial summary?
3. Which plan do I want to open?

The design should feel modern, clean, and minimal.

Avoid unnecessary colors or visual clutter.

---

# Layout

```
----------------------------------------------------
Navbar
----------------------------------------------------

Welcome Section

Summary Cards

Quick Actions

My Plans

Recent Activity

----------------------------------------------------
```

---

# 1. Welcome Section

Display a welcome message.

Example

```
Welcome Back 👋

Manage your shared expenses with complete transparency.
```

If the user has no plans, replace the subtitle with:

```
Create your first plan to start tracking shared expenses.
```

---

# 2. Summary Cards

Display four summary cards in a responsive grid.

Desktop:

```
-----------------------------------------------
Plans | Members | Balance | Monthly Expense
-----------------------------------------------
```

Mobile:

```
Plans

Members

Balance

Expense
```

Cards should contain:

## Total Plans

Example

```
3

Active Plans
```

---

## Total Members

```
12

Across All Plans
```

---

## Current Balance

```
৳18,250

Current Balance
```

---

## Monthly Expense

```
৳9,800

This Month
```

Use placeholder numbers.

---

# 3. Quick Actions

Display three action buttons.

```
+ Create Plan

+ Join Plan

View Reports
```

Buttons are UI only.

No functionality.

---

# 4. My Plans Section

Title

```
My Plans
```

Display plans as responsive cards.

Each card should contain

- Plan Name
- Member Count
- Current Balance
- Monthly Income
- Monthly Expense
- Total Transactions
- Last Updated
- Open Plan Button

Example

```
Bachelor House

5 Members

Balance
৳8,500

Income
৳25,000

Expense
৳16,500

82 Transactions

Updated 2 hours ago

[ Open Plan ]
```

Generate at least three sample cards.

---

# Empty State

If there are no plans, display:

```
No Plans Available

Create your first plan to start managing shared expenses.

[ Create Plan ]
```

Center this section both vertically and horizontally.

Include a friendly empty-state illustration or icon.

---

# 5. Recent Activity

Display a timeline of recent activities.

Example

```
Rahim added ৳5,000

2 hours ago
```

```
Karim spent ৳850 on Grocery

5 hours ago
```

```
You invited Fahim

Yesterday
```

Generate 5–6 sample activities.

---

# Responsiveness

Desktop

- Four summary cards in one row.
- Plan cards in 3 columns.
- Comfortable spacing.

Tablet

- Two summary cards per row.
- Two plan cards per row.

Mobile

- One column layout.
- Cards stacked vertically.
- Buttons full width where appropriate.

---

# Components

Create reusable components for:

- SummaryCard
- PlanCard
- QuickActionButton
- RecentActivityItem
- EmptyState

Keep components modular.

---

# Styling

- Use Tailwind CSS.
- Use shadcn/ui components where appropriate.
- Rounded corners.
- Soft shadows.
- Consistent spacing.
- Modern typography.
- Responsive layout.
- Light mode support.

Avoid overly colorful gradients.

---

# Mock Data

Use static arrays for:

- Plans
- Summary
- Recent Activities

Do not fetch any data.

---

# Out of Scope

Do NOT implement:

- Backend integration
- Authentication
- API calls
- Loading states
- Forms
- CRUD operations
- Charts
- State management

Everything should be static.

---

# Expected Deliverables

Create:

- Home page
- Summary cards
- Plan cards
- Recent activity section
- Empty state
- Responsive layout
- Reusable UI components

The generated code should be production-ready and structured for future backend integration.
