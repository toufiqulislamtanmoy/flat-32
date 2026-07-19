"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/components/shared/modal";

export default function AddTransactionForm() {
  const { closeModal } = useModal();

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium text-natural">
          Category
        </label>
        <input
          id="category"
          type="text"
          placeholder="e.g. Grocery, Utilities"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-natural outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium text-natural">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          placeholder="0.00"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-natural outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-natural">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Optional note..."
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm text-natural outline-none focus:border-primary"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="submit" className="bg-linear-to-r from-[#00d1ff] to-[#10b981] text-white">
          Add Transaction
        </Button>
      </div>
    </form>
  );
}
