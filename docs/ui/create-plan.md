# Create Plan UI Specification

## Goal

Design a clean, modern, and responsive **Create Plan** page for Flat Mate.

This page allows users to create a new shared expense plan.

Examples:

- Bachelor House
- Family Expenses
- Office Lunch
- Friends Tour

This task is **UI only**.

Do **NOT** connect to any backend, API, authentication, or database.

Use mock data only.

---

# Route

```
/plans/create
```

---

# Navigation

Users arrive on this page by clicking the **Create Plan** button from the Homepage.

After successful creation (future backend implementation), users will be redirected to:

```
/plans/:id
```

Do not implement navigation yet.

---

# Layout

The page should have:

```
Navbar

↓

Page Header

↓

Create Plan Form

↓

Preview Card

↓

Information Card
```

Maximum content width should be around **700px**.

Everything should be centered.

---

# Header

Title

```
Create New Plan
```

Subtitle

```
Start managing shared expenses by creating a new plan.
```

---

# Form

## Plan Name

Text Input

Placeholder

```
e.g. Bachelor House
```

Required

---

## Description

Textarea

Placeholder

```
Describe this plan...
```

Optional

Maximum 4 rows.

---

## Start Date

Display a date picker.

Use today's date as mock data.

---

## Cover Icon

Display selectable icons.

Examples

- 🏠 Home
- 👨‍👩‍👧 Family
- 🍽️ Meal
- 🏢 Office
- ✈️ Trip
- 🏕️ Friends

Selection is static.

No logic required.

---

# Preview Card

Display a mock preview.

Example

```
🏠 Bachelor House

Members
1

Balance
৳0

Transactions
0

Start Date

18 Jul 2026
```

This preview does not need to update dynamically.

---

# Action Buttons

Primary

```
Create Plan
```

Secondary

```
Cancel
```

Buttons are UI only.

---

# Information Card

Title

```
What happens next?
```

Content

• You'll become the owner of this plan.

• You can invite members later.

• Members can contribute money.

• Members can record expenses.

• Reports will be generated automatically.

---

# Empty Illustration

Display a simple illustration or icon related to planning or teamwork.

No external assets required.

---

# Components

Split into reusable components.

Suggested structure

```
components/

create-plan/

PageHeader.tsx

PlanForm.tsx

PlanPreviewCard.tsx

InformationCard.tsx
```

---

# Styling

Use

- Tailwind CSS

- shadcn/ui

Design should be

- Modern
- Clean
- Spacious
- Rounded corners
- Soft shadows
- Consistent spacing

Avoid heavy gradients.

---

# Responsiveness

Desktop

- Centered card
- Comfortable spacing

Tablet

- Same layout

Mobile

- Full-width inputs
- Stacked buttons
- Responsive spacing

---

# Mock Data

Everything should use static mock values.

No API.

No backend.

---

# Out of Scope

Do not implement

- API calls
- Form validation
- Authentication
- State management
- Database integration
- Loading states
- Navigation

---

# Expected Deliverables

Create

- Responsive Create Plan page
- Reusable components
- Clean folder structure
- Production-ready UI
