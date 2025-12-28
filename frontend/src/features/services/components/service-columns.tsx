import { formatCurrency } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { Column } from "@/shared/ui/custom/data-table";
import { Box, Group, Stack } from "@/shared/ui/layout";
import { Switch } from "@/shared/ui/switch";
import { Text as UIText } from "@/shared/ui/typography";
import { MOCK_RESOURCE_GROUPS } from "../model/mocks";
import { Service, ServiceCategory } from "../model/types";
import { ServiceActions } from "./service-actions";

interface GetServiceColumnsProps {
  availableCategories: ServiceCategory[];
  onToggleStatus: (service: Service, checked: boolean) => void;
  onEdit: (service: Service) => void;
}

export function getServiceColumns({
  availableCategories,
  onToggleStatus,
  onEdit,
}: GetServiceColumnsProps): Column<Service>[] {
  const getResourceGroupName = (groupId: string) => {
    return MOCK_RESOURCE_GROUPS.find((g) => g.id === groupId)?.name || groupId;
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
      header: "Thời lượng",
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
          <Group wrap gap={1}>
            {reqs.map((req, idx) => (
              <Badge key={idx} variant="outline" size="md" className="font-normal">
                {req.quantity}x {getResourceGroupName(req.group_id)}
              </Badge>
            ))}
          </Group>
        );
      },
    },
    {
      header: "Giá",
      accessorKey: "price",
      cell: ({ row }) => (
        <UIText weight="medium" size="sm">
          {formatCurrency(row.original.price)}
        </UIText>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "is_active",
      cell: ({ row }) => (
        <Group align="center" gap={2} onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={row.original.is_active}
            onCheckedChange={(checked) =>
              onToggleStatus(row.original, checked)
            }
          />
          <Badge
            variant={row.original.is_active ? "status-active" : "status-inactive"}
            size="xs"
          >
            {row.original.is_active ? "Hiện" : "Ẩn"}
          </Badge>
        </Group>
      ),
    },
    {
      header: "Hành động",
      id: "actions",
      cell: ({ row }) => (
        <Group
          justify="end"
          onClick={(e) => e.stopPropagation()}
          pr={6}
        >
          <ServiceActions
            service={row.original}
            onEdit={() => onEdit(row.original)}
          />
        </Group>
      ),
    },
  ];
}
