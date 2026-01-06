import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";

export const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = useSelector((state) => state.token.value);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user?.email || !token) {
      return navigate("/auth/login");
    }
  }, [token, user, navigate]);

  if (!user || !user?.email || !token) {
    return null;
  }

  const nav_item = [
    // { to: "/shirt", label: "Shirt" },
    // { to: "/sweater", label: "Sweater" },
    // { to: "/pant", label: "Pant" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link to="/user" className="flex items-center gap-3 group">
              <img alt="logo" src="/logo.jpg" className="h-9 w-auto mix-blend-multiply" />
              <h1 className="text-slate-900 font-bold tracking-[0.2em] text-base uppercase">
                Ralph Lauren
              </h1>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-600"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop nav */}
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            {nav_item.map((nav) => (
              <Link
                key={nav.to}
                to={nav.to}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 hover:text-slate-900 transition-colors"
              >
                {nav.label}
              </Link>
            ))}
          </PopoverGroup>

          {/* Account/Login */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              to="/auth"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-900 hover:opacity-70 transition"
            >
              Account
            </Link>
          </div>
        </nav>

        {/* Mobile menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm border-l border-slate-100 shadow-xl">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img alt="logo" src="/logo.jpg" className="h-8 w-auto" />
                <span className="text-slate-900 font-bold uppercase tracking-wider">
                  Ralph Lauren
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 text-slate-600"
              >
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-10 flow-root">
              <div className="-my-6 divide-y divide-slate-100">
                <div className="space-y-4 py-6">
                  {nav_item.map((nav) => (
                    <Link
                      key={nav.to}
                      to={nav.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium uppercase tracking-widest text-slate-800 hover:text-slate-500"
                    >
                      {nav.label}
                    </Link>
                  ))}
                </div>

                <div className="py-6">
                  <Link
                    to="/auth"
                    className="block text-sm font-semibold uppercase tracking-widest text-slate-900"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>

      <div className="max-w-7xl mx-auto px-6">
        <Separator className="bg-slate-100" />
      </div>

      {/* Footer */}
      <footer className="bg-white py-16">
        <div className="flex flex-col items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-slate-400">
          <div className="flex gap-8 mb-4">
            <Link to="#" className="hover:text-slate-900 transition">Privacy Policy</Link>
            <Link to="#" className="hover:text-slate-900 transition">Terms of Service</Link>
          </div>
          <p>© 2025 Ralph Lauren Media LLC</p>
          <p className="opacity-50">Powered by Sak</p>
        </div>
      </footer>
    </div>
  );
};