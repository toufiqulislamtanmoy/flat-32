export interface SummaryStat {
  value: string;
  label: string;
  icon: string;
}

export interface Plan {
  id: number;
  name: string;
  memberCount: number;
  balance: string;
  monthlyIncome: string;
  monthlyExpense: string;
  totalTransactions: number;
  lastUpdated: string;
}

export interface RecentActivity {
  id: number;
  description: string;
  timestamp: string;
}

export const summaryData: SummaryStat[] = [
  { value: "3", label: "Active Plans", icon: "📋" },
  { value: "12", label: "Across All Plans", icon: "👥" },
  { value: "৳18,250", label: "Current Balance", icon: "💰" },
  { value: "৳9,800", label: "This Month", icon: "📈" },
];

export const plansData: Plan[] = [
  {
    id: 1,
    name: "Bachelor House",
    memberCount: 5,
    balance: "৳8,500",
    monthlyIncome: "৳25,000",
    monthlyExpense: "৳16,500",
    totalTransactions: 82,
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    name: "Office Lunch Group",
    memberCount: 8,
    balance: "৳5,750",
    monthlyIncome: "৳40,000",
    monthlyExpense: "৳34,250",
    totalTransactions: 156,
    lastUpdated: "5 hours ago",
  },
  {
    id: 3,
    name: "Trip to Cox's Bazar",
    memberCount: 4,
    balance: "৳4,000",
    monthlyIncome: "৳60,000",
    monthlyExpense: "৳56,000",
    totalTransactions: 24,
    lastUpdated: "Yesterday",
  },
];

export const recentActivities: RecentActivity[] = [
  { id: 1, description: "Rahim added ৳5,000", timestamp: "2 hours ago" },
  { id: 2, description: "Karim spent ৳850 on Grocery", timestamp: "5 hours ago" },
  { id: 3, description: "You invited Fahim", timestamp: "Yesterday" },
  { id: 4, description: "Nusrat added ৳3,200", timestamp: "Yesterday" },
  { id: 5, description: "Bill settled for ৳1,500", timestamp: "2 days ago" },
  { id: 6, description: "Tanjim joined Office Lunch Group", timestamp: "3 days ago" },
];
