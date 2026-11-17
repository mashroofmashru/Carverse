import React, { useState, useEffect, useMemo } from "react";
import {
  Users2, Store, ClipboardCheck, Mail, Phone, X, Search, Trash2, CheckCircle2, Ban, RotateCcw,
  Building2, FileBadge, MapPin, Clock,
} from "lucide-react";
import useModal from "../../hooks/useModal";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import Toast from "../../components/common/Toast";
import api from "../../config/server";
import { ADMIN_LINKS } from "../../constants/Links";

// One page component, three sections. `view` picks which accounts it lists.
const VIEWS = {
  customers: {
    title: "Customers",
    icon: Users2,
    blurb: "People who browse and buy cars on Carverse.",
    match: (u) => u.role === "user",
    filters: [
      { key: "all", label: "All" },
      { key: "approved", label: "Active" },
      { key: "blocked", label: "Blocked" },
    ],
    empty: "No customers found.",
  },
  dealers: {
    title: "Dealers",
    icon: Store,
    blurb: "Dealer accounts, including those that are not approved yet.",
    match: (u) => u.role === "dealer",
    filters: [
      { key: "all", label: "All" },
      { key: "approved", label: "Approved" },
      { key: "notApproved", label: "Not approved" },
      { key: "blocked", label: "Blocked" },
    ],
    empty: "No dealers found.",
  },
  requests: {
    title: "Dealer requests",
    icon: ClipboardCheck,
    blurb: "Dealers who submitted their details and are waiting for your decision.",
    match: (u) => u.role === "dealer" && u.status === "pending" && u.isApplied,
    filters: [],
    empty: "No pending requests. You're all caught up.",
  },
};

const passes = (key, u) => {
  if (key === "approved") return u.status === "approved";
  if (key === "blocked") return u.status === "blocked";
  if (key === "notApproved") return u.status !== "approved";
  return true;
};

// Badge text and colour for an account's state
const statusBadge = (u) => {
  if (u.status === "approved") return { text: u.role === "dealer" ? "Approved" : "Active", cls: "badge-success" };
  if (u.status === "blocked") return { text: "Blocked", cls: "badge-danger" };
  if (u.role === "dealer" && !u.isApplied) return { text: "Awaiting details", cls: "badge-neutral" };
  return { text: "Pending review", cls: "badge-warning" };
};

const Avatar = ({ name, size = "h-10 w-10" }) => (
  <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-brand font-bold text-ink`} aria-hidden="true">
    {name?.charAt(0)?.toUpperCase() || "U"}
  </span>
);

const ManageUser = ({ view = "customers" }) => {
  const cfg = VIEWS[view];
  const PageIcon = cfg.icon;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: "" });
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  useModal(!!selectedUser, () => setSelectedUser(null));
  useModal(deleteConfirm.show, () => setDeleteConfirm((prev) => ({ ...prev, show: false })));

  // Reset the filter and search when moving between sections
  useEffect(() => {
    setFilter("all");
    setSearch("");
    setSelectedUser(null);
  }, [view]);

  useEffect(() => {
    fetchUsers();
    // Load once when the page opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/getusers");
      setUsers(Array.isArray(res.data.user) ? res.data.user : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/delete-user/${deleteConfirm.id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteConfirm.id));
      if (selectedUser?._id === deleteConfirm.id) setSelectedUser(null);
      showToast("Account deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Error deleting account", "error");
    } finally {
      setDeleteConfirm({ show: false, id: null, name: "" });
    }
  };

  const handleUpdateStatus = async (user, newStatus) => {
    try {
      const res = await api.patch(`/admin/update-user-status/${user._id}`, { status: newStatus });
      if (res.data.success) {
        setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u)));
        setSelectedUser((cur) => (cur?._id === user._id ? { ...cur, status: newStatus } : cur));
        const verb = newStatus === "approved" ? "approved" : newStatus === "blocked" ? "blocked" : "updated";
        showToast(`${user.Name} ${verb}`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    }
  };

  // Everyone this section is about, before the filter chips and search
  const base = useMemo(() => users.filter(cfg.match), [users, cfg]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return base.filter(
      (u) =>
        passes(filter, u) &&
        (!q ||
          u.Name?.toLowerCase().includes(q) ||
          u.Email?.toLowerCase().includes(q) ||
          u.dealershipName?.toLowerCase().includes(q))
    );
  }, [base, filter, search]);

  const awaitingDetails = useMemo(
    () => users.filter((u) => u.role === "dealer" && u.status === "pending" && !u.isApplied).length,
    [users]
  );

  const subtitle = loading
    ? "Loading…"
    : view === "requests"
      ? `${base.length} ${base.length === 1 ? "request" : "requests"} waiting for review`
      : `${base.length} ${base.length === 1 ? "account" : "accounts"} in total`;

  return (
    <div className="bg-mist font-sans min-h-screen flex flex-col text-ink">
      <Header title="Admin Portal" />

      <div className="flex flex-1 relative min-h-[calc(100vh-4rem)]">
        <SideBar links={ADMIN_LINKS} />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="flex items-center gap-3 text-2xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand">
                  <PageIcon size={22} aria-hidden="true" />
                </span>
                {cfg.title}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {cfg.blurb} <span className="font-semibold text-ink">{subtitle}</span>
              </p>
            </div>

            {/* Filter chips + search (not needed for the review queue) */}
            {view !== "requests" && (
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter accounts">
                  {cfg.filters.map((f) => {
                    const count = base.filter((u) => passes(f.key, u)).length;
                    const active = filter === f.key;
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setFilter(f.key)}
                        aria-pressed={active}
                        className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                          active ? "border-ink bg-ink text-white" : "border-neutral-300 bg-white text-ink hover:border-ink"
                        }`}
                      >
                        {f.label}
                        <span className={`rounded-full px-2 text-xs ${active ? "bg-white/20" : "bg-mist-deep"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full md:w-72">
                  <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                  <label htmlFor="account-search" className="sr-only">
                    Search accounts
                  </label>
                  <input
                    id="account-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or email…"
                    className="field pl-11"
                  />
                </div>
              </div>
            )}

            {/* Heads-up on the requests page for dealers who have not applied yet */}
            {view === "requests" && awaitingDetails > 0 && (
              <p className="mb-5 flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-gray-700">
                <Clock size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                {awaitingDetails} {awaitingDetails === 1 ? "dealer has" : "dealers have"} registered but not submitted
                their dealership details yet. They'll appear here once they apply.
              </p>
            )}

            {loading ? (
              <div className="card p-16 text-center text-gray-600 animate-pulse">Loading accounts…</div>
            ) : visible.length === 0 ? (
              <div className="card border-dashed p-16 text-center">
                <p className="font-semibold">{cfg.empty}</p>
                {view !== "requests" && (search || filter !== "all") && (
                  <button
                    type="button"
                    className="btn btn-light btn-sm mt-4"
                    onClick={() => {
                      setFilter("all");
                      setSearch("");
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : view === "requests" ? (
              /* ---------- Review queue ---------- */
              <div className="grid gap-5 md:grid-cols-2">
                {visible.map((u) => (
                  <article key={u._id} className="card flex flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={u.Name} size="h-11 w-11" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold leading-tight">{u.Name}</p>
                          <p className="truncate text-xs text-gray-600">{u.Email}</p>
                        </div>
                      </div>
                      <span className="badge badge-warning">Awaiting review</span>
                    </div>

                    <dl className="mt-5 space-y-3 text-sm">
                      {[
                        { icon: Building2, label: "Dealership", value: u.dealershipName },
                        { icon: FileBadge, label: "Business license", value: u.licenseNumber, mono: true },
                        { icon: MapPin, label: "Showroom address", value: u.dealershipAddress },
                      ].map(({ icon, label, value, mono }) => {
                        const Icon = icon;
                        return (
                          <div key={label} className="flex items-start gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mist">
                              <Icon size={16} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <dt className="text-xs font-medium text-gray-600">{label}</dt>
                              <dd className={`break-words font-medium ${mono ? "font-mono text-[13px]" : ""}`}>{value || "N/A"}</dd>
                            </div>
                          </div>
                        );
                      })}
                    </dl>

                    <div className="mt-6 flex gap-3 border-t border-neutral-200 pt-4">
                      <button type="button" onClick={() => handleUpdateStatus(u, "approved")} className="btn btn-brand btn-sm flex-1">
                        <CheckCircle2 size={16} aria-hidden="true" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(u, "blocked")}
                        className="btn btn-light btn-sm flex-1 !text-red-700 hover:!border-red-700"
                      >
                        <X size={16} aria-hidden="true" /> Reject
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* ---------- Customers / Dealers table ---------- */
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-mist text-xs font-semibold text-gray-600">
                        <th className="px-5 py-3.5">{view === "dealers" ? "Dealer" : "Customer"}</th>
                        {view === "dealers" && <th className="px-5 py-3.5">Dealership</th>}
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {visible.map((u) => {
                        const badge = statusBadge(u);
                        return (
                          <tr key={u._id} onClick={() => setSelectedUser(u)} className="cursor-pointer transition-colors hover:bg-mist">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <Avatar name={u.Name} />
                                <div className="min-w-0">
                                  <p className="truncate font-semibold leading-tight">{u.Name}</p>
                                  <p className="truncate text-xs text-gray-600">{u.Email}</p>
                                </div>
                              </div>
                            </td>
                            {view === "dealers" && (
                              <td className="px-5 py-3.5 text-sm">{u.dealershipName || <span className="text-gray-500">Not submitted</span>}</td>
                            )}
                            <td className="px-5 py-3.5">
                              <span className={`badge ${badge.cls}`}>{badge.text}</span>
                            </td>
                            <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end gap-1">
                                {u.status === "approved" ? (
                                  <button type="button" onClick={() => handleUpdateStatus(u, "blocked")} className="icon-btn hover:!text-red-700" aria-label={`Block ${u.Name}`} title="Block">
                                    <Ban size={18} aria-hidden="true" />
                                  </button>
                                ) : u.status === "blocked" ? (
                                  <button type="button" onClick={() => handleUpdateStatus(u, "approved")} className="icon-btn" aria-label={`Unblock ${u.Name}`} title="Unblock">
                                    <RotateCcw size={18} aria-hidden="true" />
                                  </button>
                                ) : (
                                  <>
                                    <button type="button" onClick={() => handleUpdateStatus(u, "approved")} className="icon-btn hover:!text-green-700" aria-label={`Approve ${u.Name}`} title="Approve">
                                      <CheckCircle2 size={18} aria-hidden="true" />
                                    </button>
                                    <button type="button" onClick={() => handleUpdateStatus(u, "blocked")} className="icon-btn hover:!text-red-700" aria-label={`Reject ${u.Name}`} title="Reject">
                                      <X size={18} aria-hidden="true" />
                                    </button>
                                  </>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirm({ show: true, id: u._id, name: u.Name })}
                                  className="icon-btn hover:!bg-red-50 hover:!text-red-700"
                                  aria-label={`Delete ${u.Name}`}
                                  title="Delete"
                                >
                                  <Trash2 size={18} aria-hidden="true" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {deleteConfirm.show && (
        <ConfirmationModal
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, id: null, name: "" })}
          onConfirm={confirmDelete}
          title="Delete account?"
          message={
            <>
              You are about to remove <span className="font-bold text-ink">{deleteConfirm.name}</span>. This data cannot be recovered.
            </>
          }
          confirmText="Delete"
        />
      )}

      <Toast
        isOpen={notification.show}
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      {/* ---------- Account details ---------- */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-brand p-6 text-ink">
              <button type="button" aria-label="Close" onClick={() => setSelectedUser(null)} className="icon-btn absolute right-4 top-4 hover:!bg-black/10">
                <X size={20} aria-hidden="true" />
              </button>
              <div className="flex items-center gap-4 pr-10">
                <Avatar name={selectedUser.Name} size="h-16 w-16 text-2xl !bg-black/10" />
                <div className="min-w-0">
                  <h2 id="account-title" className="truncate text-xl font-bold">{selectedUser.Name}</h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-ink/80">
                    <Mail size={14} aria-hidden="true" /> <span className="truncate">{selectedUser.Email}</span>
                  </p>
                  {selectedUser.Phone && (
                    <p className="mt-0.5 flex items-center gap-2 text-sm text-ink/80">
                      <Phone size={14} aria-hidden="true" /> {selectedUser.Phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-neutral-200 bg-mist p-3">
                  <p className="text-xs font-semibold text-gray-600">Role</p>
                  <p className="mt-1 text-sm font-semibold capitalize">{selectedUser.role === "user" ? "Customer" : selectedUser.role}</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-mist p-3">
                  <p className="text-xs font-semibold text-gray-600">Status</p>
                  <span className={`badge mt-1 ${statusBadge(selectedUser).cls}`}>{statusBadge(selectedUser).text}</span>
                </div>
              </div>

              {selectedUser.role === "dealer" && selectedUser.isApplied && (
                <dl className="space-y-3 text-sm">
                  {[
                    { icon: Building2, label: "Dealership", value: selectedUser.dealershipName },
                    { icon: FileBadge, label: "Business license", value: selectedUser.licenseNumber, mono: true },
                    { icon: MapPin, label: "Showroom address", value: selectedUser.dealershipAddress },
                  ].map(({ icon, label, value, mono }) => {
                    const Icon = icon;
                    return (
                      <div key={label} className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/25">
                          <Icon size={16} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-xs font-medium text-gray-600">{label}</dt>
                          <dd className={`break-words font-medium ${mono ? "font-mono text-[13px]" : ""}`}>{value || "N/A"}</dd>
                        </div>
                      </div>
                    );
                  })}
                </dl>
              )}

              {selectedUser.role !== "admin" && (
                <div className="flex gap-3 border-t border-neutral-200 pt-5">
                  {selectedUser.status === "approved" ? (
                    <button type="button" onClick={() => handleUpdateStatus(selectedUser, "blocked")} className="btn btn-light flex-1 !text-red-700 hover:!border-red-700">
                      <Ban size={18} aria-hidden="true" /> Block {selectedUser.role === "dealer" ? "dealer" : "customer"}
                    </button>
                  ) : selectedUser.status === "blocked" ? (
                    <button type="button" onClick={() => handleUpdateStatus(selectedUser, "approved")} className="btn btn-brand flex-1">
                      <RotateCcw size={18} aria-hidden="true" /> Unblock
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={() => handleUpdateStatus(selectedUser, "approved")} className="btn btn-brand flex-1">
                        <CheckCircle2 size={18} aria-hidden="true" /> Approve
                      </button>
                      <button type="button" onClick={() => handleUpdateStatus(selectedUser, "blocked")} className="btn btn-light flex-1 !text-red-700 hover:!border-red-700">
                        <X size={18} aria-hidden="true" /> Reject
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
