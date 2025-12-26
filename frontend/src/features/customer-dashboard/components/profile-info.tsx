"use client";

import { PROFILE_LABELS } from "@/features/customer-dashboard/constants";
import { ProfileInput } from "@/features/customer-dashboard";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";
import { vi } from "date-fns/locale";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { format, parse } from "date-fns";
import { motion } from "framer-motion";
import { Cake, Calendar as CalendarIcon, Lock, MapPin, Phone, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ProfileInfoProps {
  form: UseFormReturn<ProfileInput>;
  isPending: boolean;
  minDate: Date;
  maxDate: Date;
}

export function ProfileInfo({
  form,
  isPending,
  minDate,
  maxDate,
}: ProfileInfoProps) {
  return (
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{PROFILE_LABELS.FULL_NAME}</FormLabel>
              <FormControl>
                <Input
                  startContent={
                    <User className="text-muted-foreground h-4 w-4" />
                  }
                  placeholder={PROFILE_LABELS.FULL_NAME_PLACEHOLDER}
                  aria-invalid={!!form.formState.errors.fullName}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{PROFILE_LABELS.DATE_OF_BIRTH}</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border-input",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {field.value ? format(parse(field.value, "yyyy-MM-dd", new Date()), "dd/MM/yyyy") : <span>{PROFILE_LABELS.DATE_OF_BIRTH}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                        }}
                        disabled={(date) => date > maxDate || date < minDate}
                        initialFocus
                        locale={vi}
                        captionLayout="dropdown"
                        fromYear={minDate.getFullYear()}
                        toYear={maxDate.getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{PROFILE_LABELS.PHONE}</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    startContent={
                      <Phone className="text-muted-foreground h-4 w-4" />
                    }
                    placeholder={PROFILE_LABELS.PHONE_PLACEHOLDER}
                    aria-invalid={!!form.formState.errors.phone_number}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{PROFILE_LABELS.EMAIL}</FormLabel>
              <FormControl>
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Input
                          type="email"
                          readOnly
                          disabled
                          startContent={
                            <Lock className="text-muted-foreground h-4 w-4" />
                          }
                          placeholder={PROFILE_LABELS.EMAIL_PLACEHOLDER}
                          className="bg-muted/30 text-muted-foreground h-10 cursor-not-allowed border-dashed focus-visible:ring-0 focus-visible:ring-offset-0"
                          aria-invalid={!!form.formState.errors.email}
                          {...field}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-popover text-popover-foreground text-xs shadow-md"
                    >
                      <p>{PROFILE_LABELS.EMAIL_TOOLTIP}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{PROFILE_LABELS.ADDRESS}</FormLabel>
              <FormControl>
                <Input
                  startContent={
                    <MapPin className="text-muted-foreground h-4 w-4" />
                  }
                  placeholder={PROFILE_LABELS.ADDRESS_PLACEHOLDER}
                  aria-invalid={!!form.formState.errors.address}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end pt-6">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            isLoading={isPending}
            size="default"
            className="shadow-primary/20 hover:shadow-primary/40 min-w-[140px] font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            {PROFILE_LABELS.SUBMIT_BUTTON}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
