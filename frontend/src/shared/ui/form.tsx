"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
  size?: "compact" | "regular" | "large";
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

interface FormItemProps extends React.ComponentProps<"div"> {
  size?: "compact" | "regular" | "large";
}

function FormItem({ className, size = "regular", ...props }: FormItemProps) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id, size }}>
      <div
        data-slot="form-item"
        className={cn("group space-y-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

interface FormLabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean;
}

function FormLabel({ className, required, children, ...props }: FormLabelProps) {
  const { error, formItemId } = useFormField();
  const { size } = React.useContext(FormItemContext);

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      size={size}
      className={cn(
        "text-foreground/80 data-[error=true]:text-destructive/90 font-medium block",
        className
      )}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formDescriptionId } = useFormField();

  // Hide description if there is an error to avoid clutter,
  // unless explicitly handled layout-wise.
  // For this refactor, we keep description hidden on error as per common pattern,
  // or we could let it stack. Standard is often replacing or stacking.
  // Synapse requirement: "when helper present, error replaces helper"
  if (error) {
    return null;
  }

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  // Reserved space implementation:
  // We always render the element to maintain layout stability (min-height).
  // If no error, we render an empty space or just the container.

  return (
    <p
      id={formMessageId}
      data-slot="form-message"
      className={cn(
        "text-destructive text-xs font-medium transition-all",
        !body && "opacity-0", // Hide visually but keep space? Or just use min-h on container.
        // Actually, if we use min-h, we might have extra whitespace when valid.
        // Better approach for "Reserved space":
        // If we want "reserved space checking", we usually assume the design allows for that gap.
        // If the user wants "No layout jump", then adequate spacing is needed.
        // We will prioritize the "reserved space" via min-height.
        className
      )}
      {...props}
    >
        {body}
    </p>
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, OptionalMark, useFormField
};

function OptionalMark() {
  return (
    <span
      className="text-muted-foreground ml-1 text-xs font-normal"
      aria-hidden="true"
    >
      (Tùy chọn)
    </span>
  );
}

