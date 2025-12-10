"use client"

import { Check, ChevronsUpDown, Clock, Search } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/ui/command"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"

import { Resource } from "@/features/appointments/types"
import { Service } from "@/features/services/types"

interface ServiceSelectionProps {
    services: Service[]
    resources: Resource[]
}

export function ServiceSelectionField({ services, resources }: ServiceSelectionProps) {
    const { control, setValue } = useFormContext()
    const [openServiceCombobox, setOpenServiceCombobox] = useState(false)
    const [openResourceCombobox, setOpenResourceCombobox] = useState(false)

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
                <h3 className="text-sm font-semibold text-foreground">Dịch vụ & Nhân viên</h3>
            </div>

            <div className="grid gap-4">
                {/* Service Field */}
                <FormField
                    control={control}
                    name="serviceId"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-foreground/80 font-normal">Dịch vụ</FormLabel>
                            <Popover open={openServiceCombobox} onOpenChange={setOpenServiceCombobox}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openServiceCombobox}
                                            className={cn(
                                                "w-full justify-between h-auto min-h-[40px] py-2 rounded-lg bg-background px-3 font-normal transition-all text-left shadow-sm hover:shadow-md hover:border-input focus-premium",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? (() => {
                                                    const service = services.find(s => s.id === field.value);
                                                    return service ? (
                                                        <div className="flex items-start gap-3 w-full">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium truncate text-sm">{service.name}</div>
                                                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                                                    <Badge variant="secondary" className="text-[10px] px-1 h-5 rounded-sm font-normal text-muted-foreground">{service.duration} phút</Badge>
                                                                    <span>•</span>
                                                                    <span className="font-medium text-primary">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : "Chọn dịch vụ";
                                                  })()
                                                : <span className="flex items-center"><Search className="mr-2 h-4 w-4 opacity-50"/> Tìm dịch vụ...</span>}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Tìm tên dịch vụ..." />
                                        <CommandList className="max-h-[300px] overflow-y-auto">
                                            <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                            {Array.from(new Set(services.map(s => s.category))).map(category => (
                                                <CommandGroup key={category || "Khác"} heading={category || "Khác"}>
                                                    {services.filter(s => s.category === category).map((service) => (
                                                        <CommandItem
                                                            key={service.id}
                                                            value={service.name}
                                                            onSelect={() => {
                                                                setValue("serviceId", service.id);
                                                                setOpenServiceCombobox(false);
                                                            }}
                                                            className="flex items-start gap-2 py-3 px-3 cursor-pointer aria-selected:bg-accent/50"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mt-1 h-4 w-4 text-primary shrink-0",
                                                                    field.value === service.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium text-sm">{service.name}</span>
                                                                    <span className="text-xs font-semibold text-primary">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                                                    <span className="line-clamp-1">{service.description}</span>
                                                                    <div className="flex items-center shrink-0 ml-2">
                                                                        <Clock className="w-3 h-3 mr-1" />
                                                                        {service.duration}p
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            ))}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Resource Field */}
                <FormField
                    control={control}
                    name="resourceId"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-foreground/80 font-normal">Nhân viên thực hiện</FormLabel>
                            <Popover open={openResourceCombobox} onOpenChange={setOpenResourceCombobox}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openResourceCombobox}
                                            className={cn(
                                                "w-full justify-between h-10 rounded-lg bg-background px-3 font-normal transition-all shadow-sm hover:shadow-md hover:border-input focus-premium",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                                {field.value
                                                ? (() => {
                                                    const resource = resources.find(r => r.id === field.value);
                                                    return resource ? (
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={resource.avatar} alt={resource.name} />
                                                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                                    {resource.name.split(' ').pop()?.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium text-sm">{resource.name}</span>
                                                            <span className="text-xs text-muted-foreground">• {resource.role}</span>
                                                        </div>
                                                    ) : "Chọn nhân viên";
                                                    })()
                                                : <span className="flex items-center"><Search className="mr-2 h-4 w-4 opacity-50"/> Chọn nhân viên...</span>}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Tìm nhân viên..." />
                                        <CommandList className="max-h-[300px] overflow-y-auto">
                                            <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                            <CommandGroup>
                                                {resources.map((resource) => (
                                                    <CommandItem
                                                        key={resource.id}
                                                        value={resource.name}
                                                        onSelect={() => {
                                                            setValue("resourceId", resource.id);
                                                            setOpenResourceCombobox(false);
                                                        }}
                                                        className="flex items-center gap-2 py-2 cursor-pointer"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4 text-primary",
                                                                field.value === resource.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <Avatar className="h-7 w-7 border">
                                                            <AvatarImage src={resource.avatar} alt={resource.name} />
                                                            <AvatarFallback className="text-xs bg-muted">
                                                                {resource.name.split(' ').pop()?.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm">{resource.name}</span>
                                                            <span className="text-xs text-muted-foreground">{resource.role}</span>
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
            </div>
        </div>
    )
}
