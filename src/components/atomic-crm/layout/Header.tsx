import { FileText, Import, Settings, User, Users } from "lucide-react";
import { CanAccess, useTranslate, useUserMenu } from "ra-core";
import { Link, matchPath, useLocation, useNavigate } from "react-router";
import { RefreshButton } from "@/components/admin/refresh-button";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { UserMenu } from "@/components/admin/user-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { useConfigurationContext } from "../root/ConfigurationContext";
import * as m from "motion/react-m";
import { crmIcons } from "../misc/crmIcons";
import { ImportPage } from "../misc/ImportPage";
import { requestTour } from "../onboarding/tourProgress";
import type { TourId } from "../onboarding/tourSteps";
import { ChangelogPage } from "../misc/ChangelogPage";
import { GlobalSearchButton } from "../search/GlobalSearchButton";

const Header = () => {
  const { darkModeLogo, lightModeLogo, title } = useConfigurationContext();
  const location = useLocation();
  const translate = useTranslate();

  let currentPath: string | boolean = "/";
  if (matchPath("/", location.pathname)) {
    currentPath = "/";
  } else if (matchPath("/contacts/*", location.pathname)) {
    currentPath = "/contacts";
  } else if (matchPath("/companies/*", location.pathname)) {
    currentPath = "/companies";
  } else if (matchPath("/deals/*", location.pathname)) {
    currentPath = "/deals";
  } else if (matchPath("/calendar/*", location.pathname)) {
    currentPath = "/calendar";
  } else {
    currentPath = false;
  }

  return (
    <>
      <nav className="grow">
        <header className="bg-secondary">
          <div className="px-4">
            <div className="flex justify-between items-center flex-1">
              <Link
                to="/"
                className="flex items-center gap-2 text-secondary-foreground no-underline"
              >
                <img
                  className="[.light_&]:hidden h-6"
                  src={darkModeLogo}
                  alt={title}
                />
                <img
                  className="[.dark_&]:hidden h-6"
                  src={lightModeLogo}
                  alt={title}
                />
                <h1 className="text-xl font-semibold">{title}</h1>
              </Link>
              <div>
                <nav className="flex">
                  <NavigationTab
                    label={translate("ra.page.dashboard")}
                    to="/"
                    Icon={crmIcons.dashboard}
                    isActive={currentPath === "/"}
                  />
                  <NavigationTab
                    label={translate("resources.contacts.name", {
                      smart_count: 2,
                    })}
                    to="/contacts"
                    Icon={crmIcons.contacts}
                    isActive={currentPath === "/contacts"}
                  />
                  <NavigationTab
                    label={translate("resources.companies.name", {
                      smart_count: 2,
                    })}
                    to="/companies"
                    Icon={crmIcons.companies}
                    isActive={currentPath === "/companies"}
                  />
                  <NavigationTab
                    label={translate("resources.deals.name", {
                      smart_count: 2,
                    })}
                    to="/deals"
                    Icon={crmIcons.deals}
                    isActive={currentPath === "/deals"}
                  />
                  <NavigationTab
                    label={translate("crm.calendar.title")}
                    to="/calendar"
                    tourId="nav-calendar"
                    Icon={crmIcons.calendar}
                    isActive={currentPath === "/calendar"}
                  />
                </nav>
              </div>
              <div className="flex items-center" data-tour="header-tools">
                <GlobalSearchButton />
                <ThemeModeToggle />
                <RefreshButton />
                <UserMenu>
                  <ProfileMenu />
                  <CanAccess resource="sales" action="list">
                    <UsersMenu />
                  </CanAccess>
                  <CanAccess resource="configuration" action="edit">
                    <SettingsMenu />
                  </CanAccess>
                  <ImportFromJsonMenuItem />
                  <TourMenuItem tourId="dashboard" />
                  <TourMenuItem tourId="deals" />
                  <ChangelogMenuItem />
                </UserMenu>
              </div>
            </div>
          </div>
        </header>
      </nav>
    </>
  );
};

const NavigationTab = ({
  label,
  to,
  isActive,
  Icon,
  tourId,
}: {
  label: string;
  to: string;
  isActive: boolean;
  Icon: React.ComponentType<{ className?: string }>;
  tourId?: string;
}) => (
  <Link
    to={to}
    data-tour={tourId}
    className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "text-secondary-foreground"
        : "text-secondary-foreground/70 hover:text-secondary-foreground/80"
    }`}
  >
    {isActive ? (
      <m.span
        layoutId="main-navigation-underline"
        className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
      />
    ) : null}
    <Icon className={isActive ? "size-4 text-primary" : "size-4"} />
    {label}
  </Link>
);

const UsersMenu = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<UsersMenu> must be used inside <UserMenu?");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to="/sales" className="flex items-center gap-2">
        <Users />
        {translate("resources.sales.name", { smart_count: 2 })}
      </Link>
    </DropdownMenuItem>
  );
};

const ProfileMenu = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<ProfileMenu> must be used inside <UserMenu?");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to="/profile" className="flex items-center gap-2">
        <User />
        {translate("crm.profile.title")}
      </Link>
    </DropdownMenuItem>
  );
};

const SettingsMenu = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<SettingsMenu> must be used inside <UserMenu>");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to="/settings" className="flex items-center gap-2">
        <Settings />
        {translate("crm.settings.title")}
      </Link>
    </DropdownMenuItem>
  );
};

const ImportFromJsonMenuItem = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<ImportFromJsonMenuItem> must be used inside <UserMenu>");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to={ImportPage.path} className="flex items-center gap-2">
        <Import />
        {translate("crm.header.import_data")}
      </Link>
    </DropdownMenuItem>
  );
};

/** Opens a guided tour from anywhere: goes to its page first if needed. */
const TourMenuItem = ({ tourId }: { tourId: TourId }) => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  const navigate = useNavigate();
  const location = useLocation();
  if (!userMenuContext) {
    throw new Error("<TourMenuItem> must be used inside <UserMenu>");
  }
  const path = tourId === "deals" ? "/deals" : "/";
  return (
    <DropdownMenuItem
      className="flex items-center gap-2"
      onClick={() => {
        userMenuContext.onClose();
        if (location.pathname !== path) navigate(path);
        requestTour(tourId);
      }}
    >
      <crmIcons.tour />
      {translate(`crm.onboarding.menu_${tourId}`)}
    </DropdownMenuItem>
  );
};

const ChangelogMenuItem = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<ChangelogMenuItem> must be used inside <UserMenu>");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to={ChangelogPage.path} className="flex items-center gap-2">
        <FileText />
        {translate("crm.changelog.title")}
      </Link>
    </DropdownMenuItem>
  );
};
export default Header;
