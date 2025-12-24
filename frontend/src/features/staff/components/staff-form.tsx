"use client";

import { Skill } from "@/features/services";
import { cn } from "@/shared/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { StaffGeneralInfo } from "./staff-form/staff-general-info";
import { StaffProfessionalInfo } from "./staff-form/staff-professional-info";
import { StaffHRInfo } from "./staff-form/staff-hr-info";

interface StaffFormProps {
  mode: "create" | "update";
  skills: Skill[];
  className?: string;
}

export function StaffForm({ mode, skills, className }: StaffFormProps) {
  return (
    <div className={cn("w-full", className)}>
      {mode === "create" ? (
        <div className="space-y-6">
          <section>
            <h3 className="mb-4 text-lg font-semibold">Thông tin chung</h3>
            <StaffGeneralInfo mode={mode} />
          </section>

          <div className="bg-border/50 h-px" />

          <section>
            <h3 className="mb-4 text-lg font-semibold">Nghiệp vụ</h3>
            <StaffProfessionalInfo mode={mode} skills={skills} />
          </section>

          <div className="bg-border/50 h-px" />

          <section>
            <h3 className="mb-4 text-lg font-semibold">Nhân sự</h3>
            <StaffHRInfo />
          </section>
        </div>
      ) : (
        <Tabs defaultValue="general" className="w-full">
          <TabsList variant="form" size="lg" fullWidth gridCols={3}>
            <TabsTrigger value="general" variant="form"> Thông tin chung </TabsTrigger>
            <TabsTrigger value="professional" variant="form"> Nghiệp vụ </TabsTrigger>
            <TabsTrigger value="hr" variant="form"> Nhân sự </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="bg-card space-y-4 rounded-lg border p-4">
            <StaffGeneralInfo mode={mode} />
          </TabsContent>

          <TabsContent value="professional" className="bg-card space-y-4 rounded-lg border p-4">
            <StaffProfessionalInfo mode={mode} skills={skills} />
          </TabsContent>

          <TabsContent value="hr" className="bg-card space-y-4 rounded-lg border p-4">
            <StaffHRInfo />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
