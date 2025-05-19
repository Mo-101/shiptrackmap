import { useState } from "react";
import ShipmentsTab from "./ShipmentsTab";
import ForwardersTab from "./ForwardersTab";
import RoutesTab from "./RoutesTab";
import AnomaliesTab from "./AnomaliesTab";
import SettingsTab from "./SettingsTab";
import { motion, AnimatePresence } from "framer-motion";

const tabList = [
  { key: "shipments", label: "📦 Shipments" },
  { key: "forwarders", label: "🧭 Freight Forwarders" },
  { key: "routes", label: "🌍 Origins / Destinations" },
  { key: "anomalies", label: "🚨 Anomalies & Outliers" },
  { key: "settings", label: "⚙️ Settings / Admin" }
];

const DashboardTabs = ({ data, filters, setFilters }: any) => {
  const [tab, setTab] = useState("shipments");
  return (
    <div className="flex-1 flex flex-col">
      <nav className="flex gap-2 border-b bg-blue-950/80">
        {tabList.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 font-semibold transition-colors ${tab === t.key ? "text-cyan-300 border-b-2 border-cyan-300" : "text-white/60"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="flex-1 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === "shipments" && (
            <motion.div key="shipments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ShipmentsTab data={data} filters={filters} setFilters={setFilters} />
            </motion.div>
          )}
          {tab === "forwarders" && (
            <motion.div key="forwarders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ForwardersTab data={data} />
            </motion.div>
          )}
          {tab === "routes" && (
            <motion.div key="routes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RoutesTab data={data} />
            </motion.div>
          )}
          {tab === "anomalies" && (
            <motion.div key="anomalies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnomaliesTab data={data} />
            </motion.div>
          )}
          {tab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SettingsTab data={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default DashboardTabs;
