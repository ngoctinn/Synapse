"use client"

import { Skill } from "@/features/services/types"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover"
import { Check, ChevronsUpDown, X } from "lucide-react"
import * as React from "react"

interface SkillSelectorProps {
  skills: Skill[]
  selectedSkillIds: string[]
  onSkillsChange: (skillIds: string[]) => void
  disabled?: boolean
}

export function SkillSelector({
  skills,
  selectedSkillIds,
  onSkillsChange,
  disabled = false,
}: SkillSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selectedSkills = skills.filter((skill) =>
    selectedSkillIds.includes(skill.id)
  )

  const handleSelect = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      onSkillsChange(selectedSkillIds.filter((id) => id !== skillId))
    } else {
      onSkillsChange([...selectedSkillIds, skillId])
    }
  }

  const handleRemove = (skillId: string) => {
    onSkillsChange(selectedSkillIds.filter((id) => id !== skillId))
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedSkills.length > 0
              ? `${selectedSkills.length} kỹ năng đã chọn`
              : "Chọn kỹ năng..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm kiếm kỹ năng..." />
            <CommandList>
              <CommandEmpty>Không tìm thấy kỹ năng nào.</CommandEmpty>
              <CommandGroup>
                {skills.map((skill) => (
                  <CommandItem
                    key={skill.id}
                    value={skill.name}
                    onSelect={() => handleSelect(skill.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSkillIds.includes(skill.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {skill.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="pr-1">
              {skill.name}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleRemove(skill.id)}
                disabled={disabled}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
