"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/components/shared/modal";
import AddTransactionForm from "./dialogs/AddTransactionForm";
import InviteMemberForm from "./dialogs/InviteMemberForm";
import { ChartBar, Factory, Settings, User } from "lucide-react";

export default function QuickActions() {
  const { openModal } = useModal();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => {
          console.log("Add Transaction Modal Opened");
          openModal({
            title: "Add Transaction",
            description: "Record a new income or expense for this plan.",
            content: <AddTransactionForm />,
            className: "sm:max-w-md",
          });
        }}
      >
        <Factory />
        Add Transaction
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() =>
          openModal({
            title: "Add Member",
            description: "Add an existing Flat Mate user to this plan.",
            content: <InviteMemberForm />,
            className: "sm:max-w-md",
          })
        }
      >
        <User />
        Add Member
      </Button>
      <Button variant="outline" className="gap-2">
        <ChartBar />
        View Report
      </Button>
      <Button variant="outline" className="gap-2">
        <Settings />
        Settings
      </Button>
    </div>
  );
}
