import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, Check } from "lucide-react";

interface SlideToConfirmWebProps {
  onConfirm: () => void;
  title?: string;
  confirmedTitle?: string;
  disabled?: boolean;
}

export const SlideToConfirmWeb: React.FC<SlideToConfirmWebProps> = ({
  onConfirm,
  title = "Slide to pick up the order",
  confirmedTitle = "Confirmed!",
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const startXRef = useRef(0);

  const getContainerWidth = () => {
    return containerRef.current?.clientWidth || 320;
  };

  const handleDrag = useCallback(
    (clientX: number) => {
      if (!isDragging || isConfirmed || disabled) return;
      const containerWidth = getContainerWidth();
      const thumbWidth = 56;
      const maxDrag = Math.max(0, containerWidth - thumbWidth - 8);

      const delta = clientX - startXRef.current;
      const clamped = Math.max(0, Math.min(delta, maxDrag));
      setDragX(clamped);

      if (clamped >= maxDrag * 0.88) {
        setIsConfirmed(true);
        setDragX(maxDrag);
        setIsDragging(false);
        if ("vibrate" in navigator) {
          try {
            navigator.vibrate([40, 20, 60]);
          } catch {
            // vibration API optional
          }
        }
        setTimeout(() => {
          onConfirm();
        }, 300);
      }
    },
    [isDragging, isConfirmed, disabled, onConfirm]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isConfirmed) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX - dragX;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || isConfirmed) return;
    setIsDragging(true);
    startXRef.current = e.clientX - dragX;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDrag(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDrag(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      if (isDragging && !isConfirmed) {
        setIsDragging(false);
        setDragX(0); // Snap back
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, isConfirmed, handleDrag]);

  const progress = Math.min(
    1,
    dragX / Math.max(1, getContainerWidth() - 56 - 8)
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-14 bg-neutral-900 rounded-full p-1 select-none overflow-hidden transition-all duration-300 shadow-lg ${
        disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
    >
      {/* Background Fill Gradient */}
      <div
        className="absolute inset-y-1 left-1 rounded-full bg-gradient-to-r from-[#FF2D55]/80 to-[#FF2D55] transition-all duration-75 pointer-events-none"
        style={{
          width: isConfirmed ? "calc(100% - 8px)" : `${dragX + 56}px`,
        }}
      />

      {/* Central Label */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
        style={{ opacity: isConfirmed ? 1 : 1 - progress * 1.5 }}
      >
        <span className="text-white text-sm font-semibold tracking-wide">
          {isConfirmed ? confirmedTitle : title}
        </span>
      </div>

      {/* Draggable Slider Thumb */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`absolute top-1 bottom-1 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform ${
          isDragging ? "" : "transition-[left] duration-200"
        }`}
        style={{
          left: `${dragX + 4}px`,
        }}
      >
        {isConfirmed ? (
          <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
        ) : (
          <ChevronRight className="w-6 h-6 text-neutral-800 stroke-[2.5] animate-pulse" />
        )}
      </div>
    </div>
  );
};
