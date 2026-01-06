import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Package, Truck, Menu, X, MapMinus, List, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen, setIsOpenDesktop, isOpenDesktop }) => {
  const nav_item = [
    { to: "/admin/productAdmin", label: "Inventory", icon: <Package size={18} /> },
    { to: "/admin/productDetail", label: "Attributes", icon: <LayoutGrid size={18} /> },
    { to: "/admin/delivery", label: "Shipments", icon: <Truck size={18} /> },
    { to: "/admin/category", label: "Category", icon: <List size={18} /> },
  ];

  const token = useSelector((state) => state.token.value);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user?.email || !token) {
      return navigate("/auth/login");
    }
  }, [token, user, navigate]);

  if (!user || !user?.email || !token) return null;

  const NavItemStyle = ({ isActive }) =>
    `relative px-6 py-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] transition-all duration-200 ${
      isActive
        ? "text-slate-900 font-bold bg-slate-50"
        : "text-slate-400 hover:text-slate-900 hover:bg-slate-50/50"
    }`;

  return (
    <>
      {/* Desktop Sidebar */}
      <AnimatePresence>
        {isOpenDesktop && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="hidden md:flex flex-col fixed left-0 h-full w-64 bg-white border-r border-slate-100 z-40"
          >
            <div className="p-8 flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-900  hover:text-gray-400 cursor-pointer" onClick={()=>navigate("/user")}>
                  Ralph Lauren
                </h2>
                <span className="text-[9px] tracking-[0.1em] uppercase text-slate-400 font-medium">
                  Administrative
                </span>
              </div>
            </div>

            <nav className="flex flex-col mt-4">
              {nav_item.map((item) => (
                <NavLink key={item.to} to={item.to} className={NavItemStyle}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 w-[3px] h-6 bg-slate-900 rounded-r-full"
                        />
                      )}
                      {item.icon}
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-[60] shadow-2xl md:hidden p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xs font-bold tracking-widest uppercase">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {nav_item.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={NavItemStyle}
                  >
                    {item.icon} {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDesktop, setIsOpenDesktop] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] antialiased">
      <Sidebar
        isOpen={isOpen}
        isOpenDesktop={isOpenDesktop}
        setIsOpen={setIsOpen}
        setIsOpenDesktop={setIsOpenDesktop}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isOpenDesktop ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* Modern Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsOpenDesktop(!isOpenDesktop)}
              className="hidden md:flex text-slate-400 hover:text-slate-900 transition"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-slate-400 hover:text-slate-900 transition"
            >
              <Menu size={20} />
            </button>
            <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
            <h1 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-900">
              System Control / Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
               AD
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8 lg:p-12 max-w-[1600px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}