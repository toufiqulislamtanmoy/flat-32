Read AGENTS.md to understand the project architecture and coding conventions.

Then create the UI for the **Plan Details (Plan Workspace)** page of the Flat Mate application.

## Project Context

Flat Mate is a collaborative expense management application designed for bachelor houses, families, offices, and other groups that share expenses.

A user creates a Plan (e.g., "Bachelor House"), invites members, records contributions and expenses, and everyone can transparently track the shared balance.

This page is the primary workspace of a plan. Users will spend most of their time here.

This task is **UI only**.

Do NOT implement:

- Backend integration
- API calls
- Authentication
- State management
- CRUD functionality

Use realistic mock data throughout the page.

---

## Route

```
(main)/plans/[planId]
```

---

## User Experience Goal

When a user opens this page, they should immediately understand:

- Which plan they are viewing
- Current balance
- Total income
- Total expenses
- Number of members
- Recent transactions
- Recent activity
- Available quick actions

The interface should feel clean, modern, professional, and easy to scan.

---

## Page Layout

The page should contain the following sections in order:

1. Plan Header
2. Financial Summary Cards
3. Quick Action Buttons
4. Recent Transactions
5. Members Preview
6. Monthly Summary
7. Recent Activity Timeline

---

## Plan Header

Display:

- Plan icon
- Plan name
- Short description
- Owner
- Created date
- Total members

Display the current balance prominently on the right.

Example:

🏠 Bachelor House

Monthly meal management for our apartment.

Owner: Tanmoy

5 Members

Created Jul 2026

Current Balance

৳8,500

---

## Financial Summary

Display four summary cards.

Current Balance

Total Income

Total Expense

Total Transactions

Use mock values.

---

## Quick Actions

Display four primary actions.

- Add Transaction
- Invite Member
- View Reports
- Settings

These buttons are UI only.

---

## Recent Transactions

Show the latest five transactions.

Each transaction card should display:

- Avatar
- Member Name
- Credit/Debit badge
- Category
- Amount
- Date

Include a "View All Transactions" button.

---

## Members Preview

Display a small list of members.

Each card should contain:

- Avatar
- Name
- Role
- Permission

Include a "View All Members" button.

---

## Monthly Summary

Display

- Income
- Expense
- Remaining Balance

Simple information card.

No charts.

---

## Recent Activity

Display activities such as:

- Member joined
- Expense added
- Contribution added
- Plan updated

Each activity should include:

- Avatar
- Description
- Timestamp

---

## Floating Quick Chat

This is one of the most important features.

Create a floating chat button fixed to the bottom-right corner.

When clicked:

Open a popup chat window similar to Facebook Messenger.

The user should never leave the current page.

### Chat Popup

Header

- Plan name
- Online member count
- Minimize button
- Close button

Body

- Mock conversation between members
- Chat bubbles
- Sender avatar
- Sender name
- Timestamp

Footer

- Message input
- Send button

Desktop

- Popup width around 360px
- Height around 500px

Mobile

- Open as a bottom sheet instead of a floating popup.

Include a small unread badge on the floating button using mock data.

---

## Empty States

Design beautiful empty states for:

- No Transactions
- No Members
- No Activity

---

## Design Requirements

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

The design should be:

- Modern
- Minimal
- Professional
- Spacious
- Mobile-first
- Accessible

Use:

- Rounded corners
- Soft shadows
- Consistent spacing

Avoid unnecessary gradients.

---

## Component Structure

Create reusable components.

Suggested structure:

components/
plan/
PlanHeader.tsx
SummaryCards.tsx
QuickActions.tsx
RecentTransactions.tsx
MembersPreview.tsx
MonthlySummary.tsx
ActivityTimeline.tsx
FloatingChatButton.tsx
ChatPopup.tsx

---

## Responsive Behavior

Desktop

- Multi-column layout
- Floating chat popup

Tablet

- Two-column layout

Mobile

- Single-column layout
- Chat opens as a bottom sheet

---

## Code Quality

Before generating code:

1. Explain the component hierarchy.
2. Explain the file structure.
3. Explain how the layout is organized.

Then implement the complete responsive UI using reusable components and realistic mock data.

Do not skip any section described above.
