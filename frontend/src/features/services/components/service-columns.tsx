import { ResourceGroup } from "@/features/resources";
import { formatCurrency } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { Column } from "@/shared/components/data-table";
import { Box, HStack, Stack } from "@/shared/ui/layout";
import { Text as UIText } from "@/shared/ui/typography";
import { Service, ServiceCategory } from "../model/types";
import { ServiceActions } from "./service-actions";
import { ServiceStatusToggle } from "./service-status-toggle";

interface GetServiceColumnsProps {
  availableCategories: ServiceCategory[];
  availableResourceGroups: ResourceGroup[];
  onEdit: (service: Service) => void;
}

export function getServiceColumns({
  availableCategories,
  availableResourceGroups,
  onEdit,
}: GetServiceColumnsProps): Column<Service>[] {
  const getResourceGroupName = (groupId: string) => {
    return availableResourceGroups.find((g) => g.id === groupId)?.name || groupId;
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Box pl={4}>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </Box>
      ),
      cell: ({ row }) => (
        <Box pl={4}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </Box>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Tên dịch vụ",
      accessorKey: "name",
      cell: ({ row }) => (
        <Stack gap={0}>
          <UIText
            size="sm"
            weight="medium"
            variant="highlight"
          >
            {row.original.name}
          </UIText>
        </Stack>
      ),
    },
    {
      accessorKey: "category_id",
      header: "Danh mục",
      cell: ({ row }) => {
        const category = availableCategories.find(
          (c) => c.id === row.original.category_id
        );
        return category ? (
          <Badge variant="secondary">{category.name}</Badge>
        ) : (
          <UIText variant="muted" size="xs" italic>
            Chưa phân loại
          </UIText>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Thời lượng",
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true;

        const duration = row.getValue(id) as number;
        const [minStr, maxStr] = (value as string).split("-");
        const min = minStr ? parseInt(minStr) : 0;
        const max = maxStr === "inf" ? Infinity : parseInt(maxStr);

        // Logic: (min, max] -> Lớn hơn min và nhỏ hơn hoặc bằng max
        // Ngoại lệ: Nhóm đầu tiên "0-30" sẽ bao gồm cả 0 (nếu có) đến 30.
        if (min === 0) return duration >= 0 && duration <= max;

        return duration >= min && duration <= max;
      },
      cell: ({ row }) => {
        const totalTime = row.original.duration + row.original.buffer_time;
        return (
          <Stack gap={1}>
            <UIText size="xs" weight="medium">
              Tổng: {totalTime}p
            </UIText>
            <UIText size="xs" variant="muted">
              ({row.original.duration}p + {row.original.buffer_time}p nghỉ)
            </UIText>
          </Stack>
        );
      },
    },
    {
      header: "Tài nguyên",
      cell: ({ row }) => {
        const reqs = row.original.resource_requirements || [];
        if (reqs.length === 0) {
          return (
            <UIText variant="muted" size="xs" italic>
              Không yêu cầu
            </UIText>
          );
        }

        return (
          <HStack className="flex-wrap" gap={1}>
            {reqs.map((req, idx) => (
              <Badge key={idx} variant="outline" size="md" className="font-normal">
                {req.quantity}x {getResourceGroupName(req.group_id)}
              </Badge>
            ))}
          </HStack>
        );
      },
    },
    {
      header: "Giá",
      accessorKey: "price",
      meta: { align: "right" },
      cell: ({ row }) => (
        <UIText weight="medium" size="sm">
          {formatCurrency(row.original.price)}
        </UIText>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "is_active",
      cell: ({ row }) => <ServiceStatusToggle service={row.original} />,
    },
    {
      header: "Hành động",
      id: "actions",
      meta: { align: "right" },
      cell: ({ row }) => (
        <HStack
          justify="end"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <ServiceActions
            service={row.original}
            onEdit={() => onEdit(row.original)}
          />
        </HStack>
      ),
    },
  ];
}
