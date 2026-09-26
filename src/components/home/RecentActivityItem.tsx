import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export interface RecentActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  plan: { id: number; title: string };
  user: { id: number; fullname: string; profile_picture?: string | null };
  createdAt: string;
}

interface RecentActivityItemProps {
  activity: RecentActivity;
  // Hide the plan tag when already inside that plan
  showPlan?: boolean;
}

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// Backend only sends text like "Contributed ৳40000.00" / "Spent ৳100.00 for ..."
const getAmountInfo = (description: string) => {
  const match = description.match(/৳\s?([\d,]+(?:\.\d+)?)/);
  if (!match) return null;
  const amount = Number(match[1].replace(/,/g, ""));
  if (Number.isNaN(amount)) return null;
  const isIncome = /^contribut/i.test(description.trim());
  return { amount, isIncome };
};

const formatTimeAgo = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { relative: value, absolute: value };
  return {
    relative: formatDistanceToNow(date, { addSuffix: true }),
    absolute: format(date, "dd MMM yyyy, hh:mm a"),
  };
};

export default function RecentActivityItem({ activity, showPlan = true }: RecentActivityItemProps) {
  const isMessage = activity.type === "message";
  const amountInfo = isMessage ? null : getAmountInfo(activity.description);
  const time = formatTimeAgo(activity.createdAt);
  // "Added a contribution" → "added a contribution" so it reads after the user's name
  const action = activity.title.charAt(0).toLowerCase() + activity.title.slice(1);

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Image
        src={activity.user?.profile_picture || DEFAULT_AVATAR}
        alt={activity.user?.fullname || "User"}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm text-natural">
          <span className="font-semibold">{activity.user?.fullname || "Someone"}</span> {action}
        </p>
        {isMessage && activity.description && (
          <p className="mt-1 line-clamp-2 rounded-lg bg-login-background px-3 py-1.5 text-sm text-natural/80">
            {activity.description}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {showPlan && activity.plan?.id && (
            <Link
              href={`/plans/${activity.plan.id}`}
              className="rounded-full bg-login-background px-2 py-0.5 font-medium text-natural/80 transition-colors hover:bg-primary/10 hover:text-natural"
            >
              {activity.plan.title}
            </Link>
          )}
          <time dateTime={activity.createdAt} title={time.absolute} suppressHydrationWarning>
            {time.relative}
          </time>
        </div>
      </div>

      {amountInfo ? (
        <span
          className={`shrink-0 text-sm font-semibold ${
            amountInfo.isIncome ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {amountInfo.isIncome ? "+" : "−"}৳
          {amountInfo.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </span>
      ) : (
        !isMessage && (
          <span className="shrink-0 text-xs text-muted-foreground">{activity.description}</span>
        )
      )}
    </div>
  );
}
