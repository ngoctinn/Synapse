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
import { Stack } from "@/shared/ui/layout";

interface StaffFormProps {
  mode: "create" | "update";
  skills: Skill[];
  className?: string;
}

export function StaffForm({ mode, skills, className }: StaffFormProps) {
  return (
    <div className={cn("w-full", className)}>
      {mode === "create" ? (
        <Stack gap={6}>
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
        </Stack>
      ) : (
        <Tabs defaultValue="general" className="w-full">
          <TabsList size="lg" fullWidth gridCols={3}>
            <TabsTrigger value="general"> Thông tin chung </TabsTrigger>
            <TabsTrigger value="professional"> Nghiệp vụ </TabsTrigger>
            <TabsTrigger value="hr"> Nhân sự </TabsTrigger>
          </TabsList>

          <TabsContent value="general" asChild>
            <Stack gap={4} className="bg-card rounded-lg border p-6">
              <StaffGeneralInfo mode={mode} />
            </Stack>
          </TabsContent>

          <TabsContent value="professional" asChild>
            <Stack gap={4} className="bg-card rounded-lg border p-6">
              <StaffProfessionalInfo mode={mode} skills={skills} />
            </Stack>
          </TabsContent>

          <TabsContent value="hr" asChild>
            <Stack gap={4} className="bg-card rounded-lg border p-6">
              <StaffHRInfo />
            </Stack>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
