import { MouseEvent, RefObject, TouchEvent, useEffect, useRef } from 'react';

export function useDraggableScroll(ref: RefObject<HTMLElement | null>, options: { speedMultiplier?: number } = {}) {
  const { speedMultiplier = 1.5 } = options;

  const isDown = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  // Mouse Handlers
  const handleMouseDown = (e: MouseEvent) => {
    const container = ref.current;
    if (!container) return;
    if (e.button !== 0) return; // Only left click

    isDown.current = true;
    isDragging.current = false;
    container.classList.add('cursor-grabbing');
    container.classList.remove('cursor-grab');

    startX.current = e.pageX - container.offsetLeft;
    startY.current = e.pageY - container.offsetTop;
    scrollLeft.current = container.scrollLeft;
    scrollTop.current = container.scrollTop;
  };

  const handleMouseLeave = () => {
    const container = ref.current;
    if (!container) return;
    isDown.current = false;
    container.classList.remove('cursor-grabbing');
    container.classList.add('cursor-grab');
  };

  const handleMouseUp = () => {
    const container = ref.current;
    if (!container) return;
    isDown.current = false;
    container.classList.remove('cursor-grabbing');
    container.classList.add('cursor-grab');

    // Slight delay to allow onClick to fire and check the ref before we potentially reset it
    // (Though we reset on MouseDown so it persists until next interaction)
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const container = ref.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const y = e.pageY - container.offsetTop;
    const walkX = (x - startX.current) * speedMultiplier;
    const walkY = (y - startY.current) * speedMultiplier;

    // Only mark as dragging if moved significantly (e.g. 5px)
    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
        isDragging.current = true;
    }

    container.scrollLeft = scrollLeft.current - walkX;
    container.scrollTop = scrollTop.current - walkY;
  };

  // Touch Handlers
  const handleTouchStart = (e: TouchEvent) => {
    const container = ref.current;
    if (!container) return;
    isDown.current = true;
    isDragging.current = false;

    const touch = e.touches[0];
    startX.current = touch.pageX - container.offsetLeft;
    startY.current = touch.pageY - container.offsetTop;
    scrollLeft.current = container.scrollLeft;
    scrollTop.current = container.scrollTop;
  };

  const handleTouchEnd = () => {
    isDown.current = false;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDown.current) return;
    const container = ref.current;
    if (!container) return;

    const touch = e.touches[0];
    const x = touch.pageX - container.offsetLeft;
    const y = touch.pageY - container.offsetTop;
    const walkX = (x - startX.current) * speedMultiplier;
    const walkY = (y - startY.current) * speedMultiplier;

    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
        isDragging.current = true;
    }

    container.scrollLeft = scrollLeft.current - walkX;
    container.scrollTop = scrollTop.current - walkY;
  };

  // Initial setup
  useEffect(() => {
    const container = ref.current;
    if (container) {
      container.classList.add('cursor-grab');
    }
  }, [ref]);

  return {
    events: {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
    },
    isDragging // Export ref
  };
}
