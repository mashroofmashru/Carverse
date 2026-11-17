import React, { useState, useEffect } from "react";
import { User, Mail, Save, RefreshCcw, Phone, Copy, Check } from "lucide-react";
import DealerLayout from "../../components/common/DealerLayout";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../config/server";

// Same rule the server enforces: 10 digits, starting 6-9
const PHONE_RE = /^[6-9]\d{9}$/;

const DealerSettings = () => {
  const { user, update } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Fill the form from the signed-in user (and again after a successful save)
  useEffect(() => {
    if (user) {
      setName(user.Name || "");
      setEmail(user.Email || "");
      setPhone(user.Phone || "");
    }
  }, [user]);

  const phoneError = phone && !PHONE_RE.test(phone) ? "Enter a 10-digit mobile number starting with 6, 7, 8 or 9." : "";
  const dirty = name !== (user?.Name || "") || email !== (user?.Email || "") || phone !== (user?.Phone || "");

  const reset = () => {
    setName(user?.Name || "");
    setEmail(user?.Email || "");
    setPhone(user?.Phone || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?._id) return showToast("User ID not found.", "error");
    if (phoneError) return;

    setIsSaving(true);
    try {
      const res = await api.put(`/dealer/update-profile/${user._id}`, {
        Name: name,
        Email: email,
        Phone: phone,
      });
      if (res.data.success) {
        showToast(res.data.message || "Profile updated");
        // Merge into the current user. Do NOT call login() without a token: that signs the user out.
        update({ ...user, ...res.data.user });
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Error updating profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user?._id || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast("Couldn't copy. Select the ID and copy it manually.", "error");
    }
  };

  return (
    <DealerLayout title="Dealer Settings" width="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dealer profile</h1>
        <p className="mt-1 text-sm text-gray-600">Your contact details, as customers and the admin team see them.</p>
      </div>

      <form onSubmit={handleUpdate} noValidate className="space-y-6">
        {/* Summary */}
        <section className="card flex items-center gap-5 p-6">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand text-2xl font-bold" aria-hidden="true">
            {name ? name.charAt(0).toUpperCase() : "D"}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">{name || "Dealer"}</h2>
            <span className="badge badge-neutral mt-1 capitalize">{user?.role || "dealer"}</span>
            {user?.dealershipName && <p className="mt-1 truncate text-sm text-gray-600">{user.dealershipName}</p>}
          </div>
        </section>

        {/* Fields */}
        <section className="card grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          <div>
            <label htmlFor="ds-name" className="label">
              Full name
            </label>
            <div className="relative">
              <User size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input id="ds-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Enter full name" className="field pl-11" />
            </div>
          </div>

          <div>
            <label htmlFor="ds-email" className="label">
              Email address
            </label>
            <div className="relative">
              <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input id="ds-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="Enter email address" className="field pl-11" />
            </div>
          </div>

          <div>
            <label htmlFor="ds-phone" className="label">
              Phone number
            </label>
            <div className="relative">
              <Phone size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input
                id="ds-phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ""))}
                autoComplete="tel"
                placeholder="10-digit mobile number"
                aria-invalid={!!phoneError}
                aria-describedby={phoneError ? "ds-phone-error" : undefined}
                className={`field pl-11 ${phoneError ? "!border-red-600" : ""}`}
              />
            </div>
            {phoneError && (
              <p id="ds-phone-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                {phoneError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ds-id" className="label">
              User ID (permanent)
            </label>
            <div className="flex gap-2">
              <input id="ds-id" type="text" readOnly disabled value={user?._id || "N/A"} className="field font-mono text-xs" />
              <button type="button" onClick={copyId} className="icon-btn shrink-0 border border-neutral-300" aria-label="Copy user ID" title="Copy user ID">
                {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </section>

        {/* Actions: sticks to the bottom of the screen on phones */}
        <div className="sticky bottom-3 z-10 flex justify-end gap-3 rounded-xl border border-neutral-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
          <button type="button" onClick={reset} disabled={!dirty || isSaving} className="btn btn-light">
            Reset
          </button>
          <button type="submit" disabled={!dirty || isSaving || !!phoneError} className="btn btn-brand">
            {isSaving ? <RefreshCcw className="animate-spin" size={18} aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </DealerLayout>
  );
};

export default DealerSettings;
