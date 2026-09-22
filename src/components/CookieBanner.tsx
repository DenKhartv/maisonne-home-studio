import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  readCookieConsent,
  saveCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (readCookieConsent() === null) setVisible(true);
  }, []);

  const persist = (consent: CookieConsent) => {
    saveCookieConsent(consent);
    setVisible(false);
    setSettingsOpen(false);
  };

  const acceptAll = () => persist({ necessary: true, analytics: true });
  const rejectAll = () => persist({ necessary: true, analytics: false });
  const saveSettings = () => persist({ necessary: true, analytics });

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border/70 bg-background/95 font-sans shadow-[0_-12px_40px_-24px_rgba(41,39,35,0.35)] backdrop-blur-sm"
      role="region"
      aria-label="Уведомление об использовании cookie"
    >
      <div className="page-wrap py-3 md:py-3.5">
        {settingsOpen ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 space-y-3">
              <p className="text-sm font-medium text-foreground">Настройки cookie</p>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-secondary/35 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Необходимые</p>
                  <p className="text-xs text-muted-foreground">Работа сайта и сохранение выбора</p>
                </div>
                <Switch checked disabled aria-label="Необходимые cookie всегда включены" />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Аналитика</p>
                  <p className="text-xs text-muted-foreground">Анонимная статистика посещений</p>
                </div>
                <Switch
                  checked={analytics}
                  onCheckedChange={setAnalytics}
                  aria-label="Аналитические cookie"
                />
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSettingsOpen(false)}>
                Назад
              </Button>
              <Button type="button" variant="warm" size="sm" onClick={saveSettings}>
                Сохранить выбор
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
            <p className="text-sm leading-relaxed text-foreground/90">
              Этот сайт использует cookie.{" "}
              <Link to="/privacy" className="underline underline-offset-4 transition hover:text-olive">
                Политика конфиденциальности
              </Link>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
                Настроить
              </Button>
              <Button type="button" variant="warm" size="sm" onClick={rejectAll}>
                Отклонить
              </Button>
              <Button type="button" variant="warm" size="sm" onClick={acceptAll}>
                Принять
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
