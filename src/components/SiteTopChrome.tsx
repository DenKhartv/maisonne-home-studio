import { useLocation } from "@tanstack/react-router";
import { AnnouncementBar, ANNOUNCEMENT_BAR_HEIGHT_PX } from "@/components/AnnouncementBar";
import { SiteHeader } from "@/components/SiteHeader";
import { usePromoBarVisible } from "@/hooks/use-promo-bar-visible";

export function SiteTopChrome() {
  const isHome = useLocation().pathname === "/";
  const promoVisible = usePromoBarVisible(isHome);
  const headerTop = promoVisible ? ANNOUNCEMENT_BAR_HEIGHT_PX : 0;

  return (
    <>
      <AnnouncementBar visible={promoVisible} isHome={isHome} />
      <SiteHeader topOffsetPx={headerTop} />
    </>
  );
}
