import { useRouter } from "next/navigation";
import {
  IconLayoutDashboard,
  IconShoppingCart,
  IconAlignBoxBottomCenter,
  IconBox,
  IconLogout,
  IconCheckupList,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
}

const useMenuItems = (): MenuItem[] => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/authentication/login");
  };

  return [
    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: "/",
    },
    {
      id: uniqueId(),
      title: "Inventory",
      icon: IconShoppingCart,
      href: "/Inventory",
    },
    {
      id: uniqueId(),
      title: "Report",
      icon: IconAlignBoxBottomCenter,
      href: "/Report",
    },
    {
      id: uniqueId(),
      title: "Purchase Orders",
      icon: IconBox,
      href: "/PurchaseOrders",
    },
    {
      id: uniqueId(),
      title: "Sales Invoice",
      icon: IconCheckupList,
      href: "/SalesInvoice",
    },
    {
      id: uniqueId(),
      title: "Logout",
      icon: IconLogout,
      onClick: handleLogout,
    },
  ];
};

export default useMenuItems;
