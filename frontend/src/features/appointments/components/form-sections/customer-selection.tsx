"use client"

import { Check, ChevronsUpDown, Search } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { Customer } from "@/features/appointments/types"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/ui/command"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"

interface CustomerSelectionProps {
    customers: Customer[]
    customerTab: "search" | "new"
    onTabChange: (val: "search" | "new") => void
}

export function CustomerSelectionField({ customers, customerTab, onTabChange }: CustomerSelectionProps) {
    const { control, setValue, watch } = useFormContext()
    const [openCombobox, setOpenCombobox] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const phoneNumber = watch("phoneNumber")

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
                <h3 className="text-sm font-semibold text-foreground">Khách hàng</h3>
            </div>

            <Tabs value={customerTab} onValueChange={(v) => onTabChange(v as "search" | "new")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
                    <TabsTrigger value="search" className="text-xs">Tìm khách cũ</TabsTrigger>
                    <TabsTrigger value="new" className="text-xs">Khách mới</TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="mt-0 animate-in fade-in slide-in-from-left-1 duration-200">
                    <FormField
                        control={control}
                        name="customerName"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCombobox}
                                            className={cn(
                                                "w-full justify-between h-10 rounded-lg bg-background border-input transition-all font-normal shadow-sm hover:shadow-md hover:border-input focus-premium",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <Search className="h-4 w-4 shrink-0 opacity-50" />
                                                {field.value
                                                    ? <span className="text-foreground">{field.value} {phoneNumber && <span className="text-muted-foreground">({phoneNumber})</span>}</span>
                                                    : "Tìm kiếm (Tên/SĐT)..."}
                                            </div>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[340px] p-0" align="start">
                                        <Command>
                                            <CommandInput
                                                placeholder="Nhập từ khóa..."
                                                value={searchQuery}
                                                onValueChange={setSearchQuery}
                                            />
                                            <CommandList className="max-h-[300px] overflow-y-auto">
                                                <CommandEmpty className="py-4 text-center text-sm">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <p className="text-muted-foreground">Không tìm thấy.</p>
                                                        {searchQuery && (
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => {
                                                                    onTabChange("new")
                                                                    setValue("phoneNumber", searchQuery)
                                                                    setValue("customerName", "")
                                                                    setOpenCombobox(false)
                                                                }}
                                                                className="h-7 text-xs"
                                                            >
                                                                Tạo mới "{searchQuery}"
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CommandEmpty>
                                                <CommandGroup heading="Đã lưu">
                                                    {customers.map((customer) => (
                                                        <CommandItem
                                                            key={customer.id}
                                                            value={`${customer.name} ${customer.phone}`}
                                                            onSelect={() => {
                                                                setValue("customerName", customer.name)
                                                                setValue("phoneNumber", customer.phone)
                                                                setOpenCombobox(false)
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4 text-primary",
                                                                    phoneNumber === customer.phone ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{customer.name}</span>
                                                                <span className="text-xs text-muted-foreground">{customer.phone}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TabsContent>

                <TabsContent value="new" className="mt-0 animate-in fade-in slide-in-from-right-1 duration-200">
                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="customerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/80 font-normal">Họ tên</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tên..." {...field} className="bg-background h-10 shadow-sm hover:shadow-md focus-premium" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/80 font-normal">SĐT</FormLabel>
                                    <FormControl>
                                        <Input placeholder="09..." {...field} className="bg-background h-10 shadow-sm hover:shadow-md focus-premium" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
