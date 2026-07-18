"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Transaction } from "./mock-data";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-natural">
            Recent Transactions
          </CardTitle>
          <Button variant="ghost" size="sm">
            View All Transactions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-login-background text-2xl">
              \ud83d\udcb3
            </div>
            <p className="text-sm font-semibold text-natural">
              No Transactions
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Transactions will appear here once recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={tx.avatar}
                    alt={tx.memberName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-natural truncate">
                    {tx.memberName}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.category}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      tx.type === "credit"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {tx.type === "credit" ? "Credit" : "Debit"}
                  </span>
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === "credit" ? "text-secondary" : "text-natural"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                    {tx.amount}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
