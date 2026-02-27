"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  Search,
  Plus,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import SettingsModal from "./SettingsModal";
import AuthModal from "@/components/auth/AuthModal";

export default function Header() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // uid - "b7t3ENENYHWHB9ImoDw41KiyeXU2"
  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border-light)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Left — Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--color-text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            HT
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
              {t("appName")}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              {t("appSubtitle")}
            </div>
          </div>
        </div>

        {/* Right — Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginRight: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    style={{ width: 28, height: 28, borderRadius: "50%" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <UserIcon size={16} />
                  </div>
                )}
                <span
                  className="hidden sm:block"
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  {user.displayName || user.email?.split("@")[0]}
                </span>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => logout()}
                title="Log Out"
                style={{ padding: 6 }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAuthModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginRight: 8,
              }}
            >
              <LogIn size={16} />
              Login
            </button>
          )}

          {/* Language quick toggle */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() =>
              updateSettings({
                language: settings.language === "uk" ? "en" : "uk",
              })
            }
            style={{ fontWeight: 600 }}
          >
            {settings.language === "uk" ? "🇺🇦 UA" : "🇬🇧 EN"}
          </button>

          {/* Add button */}
          <button className="btn btn-icon btn-secondary">
            <Plus size={18} />
          </button>

          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "var(--color-bg)",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <Search size={14} color="var(--color-text-muted)" />
            <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              {t("searchPlaceholder")}
            </span>
          </div>

          {/* Settings */}
          <button
            className="btn btn-icon btn-secondary"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
