import { useRef } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { images } from "@/lib/catalog";
import fabricChoiceGlow from "@/assets/fabric-section-glow.webp";
import { useFabricStickyTrackHeight } from "@/hooks/use-fabric-sticky-track-height";

/**
 * Sticky text on the right; photo collage on the left.
 * Sticky track height = collage height (releases at bottom of right photos).
 */
export function FabricChoiceSection() {
  const collageRef = useRef<HTMLDivElement>(null);
  const stickyTrackRef = useRef<HTMLDivElement>(null);
  useFabricStickyTrackHeight(collageRef, stickyTrackRef);

  return (
    <section className="section-pad-compact overflow-x-clip bg-background">
      <div className="page-wrap grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative">
          <div
            aria-hidden
            className="fabric-choice-text-glow motion-reduce:hidden hidden lg:block"
          >
            <img src={fabricChoiceGlow} alt="" />
          </div>
          <div ref={collageRef} className="relative z-[1] grid grid-cols-2 gap-4">
            <img
              src={images.chair}
              alt="Фактура кресла"
              className="aspect-[3/4] w-full rounded-[24px] object-cover"
            />
            <div className="space-y-4 pt-20">
              <img
                src={images.sofa}
                alt="Фактура дивана"
                className="aspect-square w-full rounded-[24px] object-cover"
              />
              <img
                src={images.bedroom}
                alt="Ткань кровати"
                className="aspect-[4/3] w-full rounded-[24px] object-cover"
              />
            </div>
          </div>
        </div>
        <div className="relative z-[1] lg:pl-16">
          <div ref={stickyTrackRef}>
            <div className="lg:sticky lg:top-28">
              <SectionTitle regular="Выбирай ткань" italic="и цвет под себя" />
              <p className="mt-7 max-w-lg text-sm leading-7 text-copy">
                Для каждой модели доступны тщательно подобранные ткани и оттенки. Сравните варианты на странице
                товара и найдите тот, который естественно дополнит ваш дом.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
