"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fmt } from "./constants";

interface MatchDoc {
  id: "PO" | "GRN" | "INV";
  label: string;
  headerColor: string;
  borderColor: string;
  bgColor: string;
  lines: string[];
}

interface DragDropMatchProps {
  vendor: string;
  vendorPrice: number;
  grnQty: number;
  poQty: number;
  onMatchComplete: (success: boolean) => void;
}

export function DragDropMatch({ vendor, vendorPrice, grnQty, poQty, onMatchComplete }: DragDropMatchProps) {
  const total = vendorPrice * poQty;
  const [dropped, setDropped] = useState<string[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [result, setResult] = useState<null | "success" | "mismatch">(null);
  const [dragOver, setDragOver] = useState(false);
  // Mobile: tap-to-select
  const [tapSelected, setTapSelected] = useState<string | null>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const notified = useRef(false);

  const docs: MatchDoc[] = [
    {
      id: "PO",
      label: "Purchase Order",
      headerColor: "bg-green-600",
      borderColor: "border-green-400",
      bgColor: "bg-green-50",
      lines: [
        `Ref: PO-2024-0847`,
        `Vendor: ${vendor}`,
        `Qty: ${fmt(poQty)} kg`,
        `Unit: $${vendorPrice}/kg`,
        `Total: $${fmt(total)}`,
        `Terms: Net 30`,
      ],
    },
    {
      id: "GRN",
      label: "Goods Receipt Note",
      headerColor: "bg-blue-600",
      borderColor: "border-blue-400",
      bgColor: "bg-blue-50",
      lines: [
        `Ref: GRN-2024-1203`,
        `Received: ${fmt(grnQty)} kg`,
        `Condition: Good`,
        `Batch: Verified ✓`,
      ],
    },
    {
      id: "INV",
      label: "Vendor Invoice",
      headerColor: "bg-[#D97706]",
      borderColor: "border-[#f59e0b]",
      bgColor: "bg-[#FFFDF5]",
      lines: [
        `Ref: INV-CL-8841`,
        `From: ${vendor}`,
        `Qty Billed: ${fmt(poQty)} kg`,
        `Unit: $${vendorPrice}/kg`,
        `Total: $${fmt(total)}`,
      ],
    },
  ];

  const doMatch = useCallback((items: string[]) => {
    if (items.length < 3 || notified.current) return;
    const success = grnQty === poQty;
    notified.current = true;
    setResult(success ? "success" : "mismatch");
    onMatchComplete(success);
  }, [grnQty, poQty, onMatchComplete]);

  const addDoc = (id: string) => {
    if (dropped.includes(id)) return;
    const next = [...dropped, id];
    setDropped(next);
    if (next.length === 3) doMatch(next);
  };

  // ── Drag handlers ──
  const handleDragStart = (id: string) => setDragging(id);
  const handleDragEnd = () => setDragging(null);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (dragging) addDoc(dragging);
    setDragging(null);
  };

  // ── Tap handlers (mobile) ──
  const handleTap = (id: string) => {
    if (dropped.includes(id)) return;
    if (tapSelected === id) {
      addDoc(id);
      setTapSelected(null);
    } else {
      setTapSelected(id);
    }
  };

  const handleZoneTap = () => {
    if (tapSelected) {
      addDoc(tapSelected);
      setTapSelected(null);
    }
  };

  // ── Match rows (for comparison table) ──
  const matchRows = [
    {
      field: "Vendor",
      po: vendor,
      grn: "—",
      inv: vendor,
      match: true,
    },
    {
      field: "Quantity",
      po: `${fmt(poQty)} kg`,
      grn: `${fmt(grnQty)} kg`,
      inv: `${fmt(poQty)} kg`,
      match: grnQty === poQty,
    },
    {
      field: "Unit Price",
      po: `$${vendorPrice}`,
      grn: "—",
      inv: `$${vendorPrice}`,
      match: true,
    },
    {
      field: "Total",
      po: `$${fmt(total)}`,
      grn: "—",
      inv: `$${fmt(total)}`,
      match: grnQty === poQty,
    },
  ];

  return (
    <div>
      {/* Document cards */}
      <div className="flex flex-wrap gap-3 mb-6">
        {docs.map((doc) => {
          const inZone   = dropped.includes(doc.id);
          const selected = tapSelected === doc.id;
          return (
            <motion.div
              key={doc.id}
              draggable={!inZone}
              onDragStart={() => handleDragStart(doc.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleTap(doc.id)}
              animate={{
                opacity: inZone ? 0.28 : 1,
                scale: dragging === doc.id ? 1.07 : selected ? 1.04 : inZone ? 0.97 : 1,
                rotate: dragging === doc.id ? 3 : 0,
                boxShadow: dragging === doc.id
                  ? "0 16px 40px rgba(0,0,0,0.18)"
                  : selected
                  ? "0 4px 16px rgba(245,158,11,0.2)"
                  : "0 1px 4px rgba(0,0,0,0.08)",
              }}
              whileHover={{ y: inZone ? 0 : -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              className={`w-44 rounded-xl border-2 overflow-hidden select-none ${
                inZone ? "cursor-default" : "cursor-grab active:cursor-grabbing"
              } ${doc.borderColor} ${doc.bgColor} ${selected ? "ring-2 ring-[#f59e0b]" : ""}`}
            >
              <div className={`${doc.headerColor} px-3 py-1.5`}>
                <p className="text-white text-[9px] font-black uppercase tracking-wider">{doc.label}</p>
              </div>
              <div className="p-3 space-y-0.5">
                {doc.lines.map((line, i) => (
                  <p key={i} className="text-[10px] text-[#4B5563] leading-relaxed">{line}</p>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Drop zone */}
      <motion.div
        ref={zoneRef}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleZoneTap}
        animate={{
          scale: dragOver ? 1.015 : 1,
          boxShadow: dragOver ? "0 0 0 3px rgba(245,158,11,0.3)" : "none",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`border-2 rounded-2xl p-5 text-center mb-4 ${
          dragOver
            ? "border-[#f59e0b] bg-[#FEF3C7]/60"
            : dropped.length > 0
            ? "border-[#D1CBC2] bg-[#FAFAF7]"
            : "border-dashed border-[#D1CBC2] bg-[#FAFAF7]"
        }`}
      >
        {dropped.length === 0 ? (
          <div>
            <p className="text-[#9CA3AF] text-sm mb-1">
              <span className="hidden md:inline">Drag</span>
              <span className="md:hidden">Tap</span>
              {" "}all 3 documents here to run the 3-way match
            </p>
            <p className="text-[10px] text-[#C4BDB5]">
              <span className="md:hidden">Tap a card to select, then tap here to place</span>
              <span className="hidden md:inline">Drop zone</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {dropped.map((id) => {
              const d = docs.find((x) => x.id === id)!;
              return (
                <motion.span
                  key={id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-3 py-1.5 bg-white border-2 rounded-full text-xs font-semibold ${d.borderColor}`}
                >
                  ✓ {d.label}
                </motion.span>
              );
            })}
            {dropped.length < 3 && (
              <span className="text-[#9CA3AF] text-xs self-center">
                {3 - dropped.length} more…
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Match result + comparison table */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="space-y-4"
          >
            {/* Result banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className={`rounded-xl px-4 py-3 border flex items-start gap-3 ${
                result === "success"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 12, delay: 0.1 }}
                className="text-xl flex-shrink-0"
              >
                {result === "success" ? "✅" : "⚠️"}
              </motion.span>
              <p className={`text-sm font-bold ${result === "success" ? "text-green-800" : "text-red-800"}`}>
                {result === "success"
                  ? "3-Way Match Successful — Invoice approved for payment processing."
                  : `Quantity mismatch. Invoice claims ${fmt(poQty)} kg. GRN confirms ${fmt(grnQty)} kg. Dispute raised for ${fmt(poQty - grnQty)} kg.`}
              </p>
            </motion.div>

            {/* Comparison table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F0E8]">
                    <th className="text-left px-3 py-2 text-[#6B7280] font-semibold uppercase tracking-wide">Field</th>
                    <th className="text-center px-3 py-2 text-green-700 font-semibold">PO</th>
                    <th className="text-center px-3 py-2 text-blue-700 font-semibold">GRN</th>
                    <th className="text-center px-3 py-2 text-[#D97706] font-semibold">Invoice</th>
                    <th className="text-center px-3 py-2 text-[#6B7280] font-semibold">Match</th>
                  </tr>
                </thead>
                <tbody>
                  {matchRows.map((row, i) => (
                    <motion.tr
                      key={row.field}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.09 }}
                      className={`border-b border-[#E8E4DD] ${!row.match ? "bg-red-50" : ""}`}
                    >
                      <td className="px-3 py-2 font-semibold text-[#6B7280]">{row.field}</td>
                      <td className="px-3 py-2 text-center text-[#1A1A1A]">{row.po}</td>
                      <td className="px-3 py-2 text-center text-[#1A1A1A]">{row.grn}</td>
                      <td className={`px-3 py-2 text-center font-medium ${!row.match ? "text-red-600" : "text-[#1A1A1A]"}`}>
                        {row.inv}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 14, delay: 0.1 + i * 0.09 }}
                          className={`font-bold text-base ${row.match ? "text-green-600" : "text-red-500"}`}
                        >
                          {row.match ? "✓" : "✗"}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
