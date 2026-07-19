"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/components/shared/modal";

export default function InviteMemberForm() {
  const { closeModal } = useModal();

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-natural">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="member@example.com"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-natural outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium text-natural">
          Role
        </label>
        <select
          id="role"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-natural outline-none focus:border-primary"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="permission" className="text-sm font-medium text-natural">
          Permission
        </label>
        <select
          id="permission"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-natural outline-none focus:border-primary"
        >
          <option value="contribute">Can Contribute Only</option>
          <option value="contribute-record">Can Contribute &amp; Record</option>
          <option value="full">Full Access</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="submit" className="bg-linear-to-r from-[#00d1ff] to-[#10b981] text-white">
          Send Invite
        </Button>
      </div>
    </form>
  );
}
