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
            title: "Invite Member",
            description: "Send an invitation to join this plan.",
            content: <InviteMemberForm />,
            className: "sm:max-w-md",
          })
        }
      >
        <User />
        Invite Members
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
