export interface PlanInfo {
  id: number;
  name: string;
  icon: string;
  description: string;
  owner: string;
  createdAt: string;
  memberCount: number;
  balance: string;
}

export interface FinancialStat {
  value: string;
  label: string;
  icon: string;
}

export interface Transaction {
  id: number;
  meal_title: string;
  plan_title: string;
  member_name: string;
  details: string;
  entry_type: "Credit" | "Debit";
  avatar: string;
  amount: string;
  date: string;
}

export interface Member {
  id: number;
  username: string;
  fullname: string;
  profile_picture: string;
  email_address: string;
  access_level: string;
}

export interface MonthlyData {
  income: string;
  expense: string;
  remaining: string;
}

export interface Activity {
  id: number;
  memberName: string;
  avatar: string;
  description: string;
  timestamp: string;
}

export const planInfo: PlanInfo = {
  id: 1,
  name: "Bachelor House",
  icon: "\ud83c\udfe0",
  description: "Monthly meal management for our apartment.",
  owner: "Tanmoy",
  createdAt: "Jul 2026",
  memberCount: 5,
  balance: "\u09f38,500",
};

export const financialStats: FinancialStat[] = [
  { value: "\u09f38,500", label: "Current Balance", icon: "\ud83d\udcb0" },
  { value: "\u09f325,000", label: "Total Income", icon: "\ud83d\udcc8" },
  { value: "\u09f316,500", label: "Total Expense", icon: "\ud83d\udcc9" },
  { value: "82", label: "Total Transactions", icon: "\ud83d\udcca" },
];

export const monthlyData: MonthlyData = {
  income: "\u09f325,000",
  expense: "\u09f316,500",
  remaining: "\u09f38,500",
};

export const activities: Activity[] = [
  {
    id: 1,
    memberName: "Rahim",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    description: "Rahim added \u09f35,000",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    memberName: "Karim",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    description: "Karim spent \u09f3850 on Grocery",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    memberName: "Nusrat",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    description: "Nusrat added \u09f33,200",
    timestamp: "Yesterday",
  },
  {
    id: 4,
    memberName: "Fahim",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    description: "Fahim settled \u09f31,500",
    timestamp: "2 days ago",
  },
  {
    id: 5,
    memberName: "Tanmoy",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    description: "Tanmoy updated plan settings",
    timestamp: "3 days ago",
  },
  {
    id: 6,
    memberName: "Tanjim",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    description: "Tanjim joined the plan",
    timestamp: "5 days ago",
  },
];

export const quickActions = [
  { label: "Add Transaction", icon: "\u2795" },
  { label: "Invite Member", icon: "\ud83d\udce1" },
  { label: "View Reports", icon: "\ud83d\udcca" },
  { label: "Settings", icon: "\u2699\ufe0f" },
];
