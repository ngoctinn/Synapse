import { LucideProps, Users } from "lucide-react";
import { forwardRef } from "react";

export const AnimatedUsersIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <Users
      ref={ref}
      {...props}
      className={`animate-pulse opacity-50 ${props.className || ""}`}
    />
  )
);
AnimatedUsersIcon.displayName = "AnimatedUsersIcon";
