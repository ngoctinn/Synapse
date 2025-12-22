import { useEffect, useState } from "react";

import { searchCustomers } from "@/features/appointments/actions";

interface CustomerOption {
  id: string;
  name: string;
  phone: string;
}

interface CustomerSearchResult {
  customerOptions: CustomerOption[];
  isSearching: boolean;
  setCustomerSearch: (search: string) => void;
}

/**
 * Hook tìm kiếm khách hàng với debounce 300ms
 * Chỉ tìm kiếm khi input >= 2 ký tự
 */
export function useCustomerSearch(): CustomerSearchResult {
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (customerSearch.length < 2) {
      setCustomerOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await searchCustomers(customerSearch);
        if (result.data) {
          setCustomerOptions(result.data);
        }
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [customerSearch]);

  return { customerOptions, isSearching, setCustomerSearch };
}
