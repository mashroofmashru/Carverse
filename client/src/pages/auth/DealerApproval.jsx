import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Clock, RotateCcw, Building2, MapPin, FileBadge, Send, Check, Ban, LifeBuoy, Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import api from "../../config/server";
import { useToast } from "../../context/ToastContext";

const STEPS = ["Account created", "Dealership details", "Admin review"];

// Which step is current, and did it fail?
const stepState = (user) => {
  if (user?.status === "blocked") return { current: 2, failed: true };
  if (user?.isApplied) return { current: 2, failed: false };
  return { current: 1, failed: false };
};

const Stepper = ({ current, failed }) => (
  <ol className="mb-8 flex items-start" aria-label="Verification progress">
    {STEPS.map((label, i) => {
      const done = i < current;
      const isCurrent = i === current;
      const bad = isCurrent && failed;
      return (
        <li key={label} className="flex flex-1 flex-col items-center text-center" aria-current={isCurrent ? "step" : undefined}>
          <div className="flex w-full items-center">
            <span className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done || isCurrent ? "bg-ink" : "bg-neutral-200"}`} aria-hidden="true" />
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                bad
                  ? "border-red-700 bg-red-700 text-white"
                  : done
                    ? "border-ink bg-brand"
                    : isCurrent
                      ? "border-ink bg-ink text-white"
                      : "border-neutral-300 bg-white text-gray-500"
              }`}
            >
              {bad ? <Ban size={16} aria-hidden="true" /> : done ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : i + 1}
            </span>
            <span className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "invisible" : done ? "bg-ink" : "bg-neutral-200"}`} aria-hidden="true" />
          </div>
          <span className={`mt-2 px-1 text-xs ${isCurrent ? "font-semibold text-ink" : "text-gray-600"}`}>{label}</span>
        </li>
      );
    })}
  </ol>
);

const DetailRows = ({ user }) => (
  <dl className="space-y-3 text-sm">
    {[
      { icon: Building2, label: "Dealership", value: user?.dealershipName },
      { icon: FileBadge, label: "Business license", value: user?.licenseNumber, mono: true },
      { icon: MapPin, label: "Showroom address", value: user?.dealershipAddress },
    ].map(({ icon, label, value, mono }) => {
      const Icon = icon;
      return (
        <div key={label} className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
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
);

const DealerApproval = () => {
  const { showToast } = useToast();
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  // Form states
  const [dealershipName, setDealershipName] = useState("");
  const [dealershipAddress, setDealershipAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  useEffect(() => {
    if (user?.status === "approved") {
      navigate("/dealer");
    }
    if (user?.role !== "dealer") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      });

      if (res.data.success) {
        login(res.data.user, localStorage.getItem("auth_token"));
        if (res.data.user.status === "approved") {
          navigate("/dealer");
        } else if (res.data.user.status === "blocked") {
          showToast("Your application was not approved.", "error");
        } else if (res.data.user.isApplied) {
          showToast("Your account is still under review. Please check back later.");
        }
      }
    } catch (error) {
      console.error("Failed to check status", error);
      showToast("Couldn't check your status. Please try again.", "error");
    } finally {
      setChecking(false);
    }
  };

  const startEditing = () => {
    setDealershipName(user?.dealershipName || "");
    setDealershipAddress(user?.dealershipAddress || "");
    setLicenseNumber(user?.licenseNumber || "");
    setEditing(true);
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/auth/submit-dealer-details", {
        dealershipName,
        dealershipAddress,
        licenseNumber,
      });
      if (res.data.success) {
        login(res.data.user, localStorage.getItem("auth_token"));
        setEditing(false);
        showToast(editing ? "Details updated. Your account is still under review." : "Details submitted! Your account is now under review.");
      }
    } catch (error) {
      console.error("Failed to submit details", error);
      showToast("Failed to submit details. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const blocked = user?.status === "blocked";
  const showForm = !blocked && (!user?.isApplied || editing);
  const { current, failed } = stepState(user);

  const heading = blocked
    ? { icon: Ban, title: "Application not approved", text: "We couldn't approve this dealer account." }
    : showForm
      ? { icon: Building2, title: editing ? "Edit your details" : "Complete your profile", text: "Provide your dealership information to request admin approval." }
      : { icon: Clock, title: "Account under review", text: "We're verifying your dealership details." };
  const HeadIcon = heading.icon;

  return (
    <div className="bg-mist min-h-screen font-sans flex flex-col text-ink">
      <Header title="Dealer verification" showMenu={false} />

      <div className="flex flex-1 items-start justify-center p-4 py-10 sm:py-14">
        <div className="card w-full max-w-xl overflow-hidden shadow-lg">
          <div className="p-6 pb-0 sm:p-8 sm:pb-0">
            <Stepper current={current} failed={failed} />
          </div>

          <div className={`mx-6 rounded-xl p-6 text-center sm:mx-8 ${blocked ? "bg-red-50" : "bg-brand"}`}>
            <span className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${blocked ? "bg-red-100 text-red-700" : "bg-black/10"}`}>
              <HeadIcon size={26} aria-hidden="true" />
            </span>
            <h1 className="text-xl font-bold">{heading.title}</h1>
            <p className={`mt-1 text-sm ${blocked ? "text-red-900" : "text-ink/80"}`}>{heading.text}</p>
          </div>

          <div className="p-6 sm:p-8">
            {showForm ? (
              /* FORM VIEW */
              <form onSubmit={handleSubmitDetails} className="space-y-5">
                <div>
                  <label htmlFor="da-name" className="label">
                    Dealership name
                  </label>
                  <div className="relative">
                    <Building2 size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                    <input id="da-name" type="text" required value={dealershipName} onChange={(e) => setDealershipName(e.target.value)} className="field pl-11" placeholder="e.g. Prime Motors Ltd." />
                  </div>
                </div>

                <div>
                  <label htmlFor="da-address" className="label">
                    Dealership address
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="pointer-events-none absolute left-3.5 top-3.5 text-gray-500" aria-hidden="true" />
                    <textarea id="da-address" required rows="3" value={dealershipAddress} onChange={(e) => setDealershipAddress(e.target.value)} className="field resize-none pl-11" placeholder="Complete address of your showroom" />
                  </div>
                </div>

                <div>
                  <label htmlFor="da-license" className="label">
                    Business license / Tax ID
                  </label>
                  <div className="relative">
                    <FileBadge size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                    <input id="da-license" type="text" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="field pl-11" placeholder="e.g. LIC-987654321" />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button type="submit" disabled={submitting} className="btn btn-brand w-full">
                    {submitting ? <RotateCcw size={18} className="animate-spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
                    {submitting ? "Submitting…" : editing ? "Save changes" : "Submit for approval"}
                  </button>
                  {editing ? (
                    <button type="button" onClick={() => setEditing(false)} disabled={submitting} className="btn btn-light w-full">
                      Cancel
                    </button>
                  ) : (
                    <button type="button" onClick={handleLogout} className="btn btn-light w-full">
                      <LogOut size={18} aria-hidden="true" /> Sign out
                    </button>
                  )}
                </div>
              </form>
            ) : (
              /* STATUS VIEW (under review, or not approved) */
              <div>
                <p className="mb-5 leading-relaxed text-gray-700">
                  {blocked ? (
                    <>
                      Hello <span className="font-semibold text-ink">{user?.Name}</span>, our team reviewed your application and was not able to approve it. If you think this is a mistake, please contact support and
                      mention the email on your account.
                    </>
                  ) : (
                    <>
                      Hello <span className="font-semibold text-ink">{user?.Name}</span>, your request has been submitted. Our team is reviewing it and you'll get access as soon as it's approved.
                    </>
                  )}
                </p>

                <div className="mb-6 rounded-xl border border-neutral-200 bg-mist p-5">
                  <p className="mb-3 text-xs font-semibold text-gray-600">{blocked ? "What you submitted" : "Submitted details"}</p>
                  <DetailRows user={user} />
                </div>

                <div className="space-y-3">
                  {blocked ? (
                    <Link to="/about-us#contact-us" className="btn btn-brand w-full">
                      <LifeBuoy size={18} aria-hidden="true" /> Contact support
                    </Link>
                  ) : (
                    <>
                      <button type="button" onClick={checkStatus} disabled={checking} className="btn btn-brand w-full">
                        <RotateCcw size={18} className={checking ? "animate-spin" : ""} aria-hidden="true" />
                        {checking ? "Checking…" : "Check status again"}
                      </button>
                      <button type="button" onClick={startEditing} className="btn btn-light w-full">
                        <Pencil size={18} aria-hidden="true" /> Edit details
                      </button>
                    </>
                  )}
                  <button type="button" onClick={handleLogout} className="btn btn-light w-full">
                    <LogOut size={18} aria-hidden="true" /> Sign out
                  </button>
                </div>
              </div>
            )}

            <p className="mt-8 flex items-center justify-center gap-1.5 border-t border-neutral-200 pt-6 text-xs text-gray-600">
              <ShieldCheck size={14} aria-hidden="true" /> Your data is encrypted and secure with Carverse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerApproval;
