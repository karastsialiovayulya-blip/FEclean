"use client";

import { useEffect, useMemo, useState } from "react";
import { getUsersAPI } from "@/lib/api/actions/user";
import { Role, User } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { DashboardDescription } from "@/components/sections/heroSections";
import { Button } from "@/components/ui/button";

const USERS_PER_PAGE = 8;

const USER_TABS = ["ALL", "CUSTOMER", "CLEANER", "ADMIN"] as const;

type UserTab = (typeof USER_TABS)[number];
type PaginationState = Record<UserTab, number>;

const INITIAL_PAGES: PaginationState = {
  ALL: 1,
  CUSTOMER: 1,
  CLEANER: 1,
  ADMIN: 1,
};

const ROLE_LABELS: Record<Role, string> = {
  ROLE_USER: "Customer",
  ROLE_CLEANER: "Cleaner",
  ROLE_ADMIN: "Admin",
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<UserTab>("ALL");
  const [pagesByTab, setPagesByTab] = useState<PaginationState>(INITIAL_PAGES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const response = await getUsersAPI();
      setUsers(response);
      setIsLoading(false);
    }

    fetchUsers();
  }, []);

  const usersByTab = useMemo(() => {
    return {
      ALL: users,
      CUSTOMER: users.filter((user) => user.roles.includes("ROLE_USER")),
      CLEANER: users.filter((user) => user.roles.includes("ROLE_CLEANER")),
      ADMIN: users.filter((user) => user.roles.includes("ROLE_ADMIN")),
    };
  }, [users]);

  const activeUsers = usersByTab[activeTab];
  const totalPages = Math.max(1, Math.ceil(activeUsers.length / USERS_PER_PAGE));
  const currentPage = Math.min(pagesByTab[activeTab], totalPages);
  const paginatedUsers = activeUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE,
  );

  useEffect(() => {
    setPagesByTab((currentPages) => ({
      ...currentPages,
      [activeTab]: Math.min(currentPages[activeTab], totalPages),
    }));
  }, [activeTab, totalPages]);

  const changePage = (tab: UserTab, nextPage: number) => {
    setPagesByTab((currentPages) => ({
      ...currentPages,
      [tab]: nextPage,
    }));
  };

  return (
    <div className="p-10">
      <DashboardDescription
        p="Manage user accounts, roles, and permissions to ensure secure and efficient access control within the system."
        upperH1="Directory"
        highlight="Access"
        h1="System Access Management"
      >
        <div className="flex gap-4">
          <Button
            size="normal"
            className="rounded-xl px-6 py-4 text-lg whitespace-normal"
          >
            Generate link for cleaner
          </Button>
          <Button
            size="normal"
            variant="secondary"
            className="rounded-xl px-6 py-4 text-lg whitespace-normal"
          >
            Add admin
          </Button>
        </div>
      </DashboardDescription>

      <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Role</div>
          {USER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200",
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab} ({usersByTab[tab].length})
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
              Loading users...
            </div>
          ) : paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-center">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      User
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-slate-500">@{user.username}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Phone
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Roles
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {ROLE_LABELS[role]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
              No users found for this role.
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="normal"
              disabled={currentPage <= 1}
              onClick={() => changePage(activeTab, currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              size="normal"
              disabled={currentPage >= totalPages}
              onClick={() => changePage(activeTab, currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
