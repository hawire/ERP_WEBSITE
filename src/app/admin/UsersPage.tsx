import { useState, useEffect } from "react";
import { Mail, Loader2, AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  createdAt: string;
}

interface SendingState {
  [email: string]: {
    loading: boolean;
    success: boolean;
    error: string;
    previewUrl?: string;
    loginLink?: string;
  };
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminKey, setAdminKey] = useState(localStorage.getItem("erp_admin_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(!adminKey);
  const [sending, setSending] = useState<SendingState>({});

  const getAdminKey = () => {
    const stored = localStorage.getItem("erp_admin_key");
    if (!stored && !adminKey) {
      setShowKeyInput(true);
      return null;
    }
    return stored || adminKey;
  };

  useEffect(() => {
    if (!adminKey && !localStorage.getItem("erp_admin_key")) {
      setLoading(false);
      return;
    }
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");
      const key = getAdminKey();
      if (!key) {
        setError("Admin key required.");
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/admin/users?adminKey=${encodeURIComponent(key)}`);
      if (!res.ok) {
        if (res.status === 403) setError("Invalid admin key.");
        else setError((await res.json())?.message || "Unable to fetch users.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError("Unable to fetch users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendLoginLink(email: string) {
    const key = getAdminKey();
    if (!key) {
      setError("Admin key required.");
      return;
    }

    setSending((prev) => ({ ...prev, [email]: { loading: true, success: false, error: "" } }));
    try {
      const res = await fetch("/api/admin/send-login-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-ADMIN-KEY": key,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSending((prev) => ({
          ...prev,
          [email]: { loading: false, success: false, error: data.message || "Failed to send link." },
        }));
        return;
      }

      setSending((prev) => ({
        ...prev,
        [email]: {
          loading: false,
          success: true,
          error: "",
          previewUrl: data.previewUrl || undefined,
          loginLink: data.loginLink || undefined,
        },
      }));

      // Auto-clear success after 5 seconds
      setTimeout(() => {
        setSending((prev) => {
          const updated = { ...prev };
          delete updated[email];
          return updated;
        });
      }, 5000);
    } catch (err) {
      setSending((prev) => ({
        ...prev,
        [email]: { loading: false, success: false, error: "Request failed." },
      }));
      console.error(err);
    }
  }

  function handleSaveAdminKey() {
    if (adminKey.trim()) {
      localStorage.setItem("erp_admin_key", adminKey);
      setShowKeyInput(false);
      fetchUsers();
    }
  }

  if (showKeyInput) {
    return (
      <div className="p-8">
        <div className="max-w-md bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Enter Admin Key</h2>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Your admin key"
            className="w-full px-4 py-2.5 mb-4 rounded-xl border border-black/10 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSaveAdminKey}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Manage Users</h1>
        <p className="text-slate-500">Send one-time login links to users via email.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#2563EB] animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-black/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Created</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {users.map((user) => {
                  const state = sending[user.email];
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${user.verified
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {user.verified ? "✓ Verified" : "○ Unverified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {state ? (
                          state.loading ? (
                            <Loader2 size={16} className="inline text-[#2563EB] animate-spin" />
                          ) : state.success ? (
                            <div className="flex flex-col gap-2 items-center">
                              <CheckCircle2 size={16} className="text-emerald-600" />
                              {state.previewUrl && (
                                <a
                                  href={state.previewUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink size={12} /> Preview
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-red-600">
                              {state.error}
                              {state.loginLink && (
                                <div className="mt-1 flex flex-col gap-1">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(state.loginLink || "");
                                    }}
                                    className="text-[#2563EB] hover:underline flex items-center justify-center gap-1"
                                  >
                                    <Copy size={12} /> Copy link
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        ) : (
                          <button
                            onClick={() => handleSendLoginLink(user.email)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563EB] font-medium text-xs hover:bg-blue-100 transition-colors"
                          >
                            <Mail size={14} />
                            Send Link
                          </button>
                        )}
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
  );
}
