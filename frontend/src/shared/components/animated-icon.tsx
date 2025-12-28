// ... existing code ...
import { LucideProps, Users, Package } from "lucide-react";
import { forwardRef } from "react";

export const AnimatedUsersIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <Users
      ref={ref}
      {...props}
      className={`opacity-50 ${props.className || ""}`}
    />
  )
);
AnimatedUsersIcon.displayName = "AnimatedUsersIcon";

export const AnimatedGiftIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <Package
      ref={ref}
      {...props}
      className={`opacity-50 ${props.className || ""}`}
    />
  )
);
AnimatedGiftIcon.displayName = "AnimatedGiftIcon";
