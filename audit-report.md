# 🔍 Operations Decoded — Site Audit Report

_Generated: 17/5/2026, 12:45:55 am_

## 📊 Summary

- 🔴 **Critical:** 0
- 🟠 **High:** 0
- 🟡 **Medium:** 120
- ⚪ **Low:** 72

Total issues found: **192**

---

## 🛠️ Functional & Visual Issues (Playwright)

### [Medium] slow-load — `/` [desktop]

- **Likely file to fix:** `app/page.tsx`
- **Screenshot:** `audit-results/screenshots/__desktop.png`
- **Detail:** Page took 9.3s to fully load

### [Medium] layout-overlap — `/` [desktop] (×9 occurrences)

- **Likely file to fix:** `app/page.tsx`
- **Screenshot:** `audit-results/screenshots/__desktop.png`
- **Distinct details (9):**
  - <div class="flex animate-marquee"> spills 615px past right edge
  - <div class="flex-shrink-0 mx-8 flex items-center gap-2 opacity-30 hover:"> spills 108px past right edge
  - <span class="text-sm font-semibold text-[#6B7280] whitespace-nowrap"> spills 108px past right edge
  - <div class="flex-shrink-0 mx-8 flex items-center gap-2 opacity-30 hover:"> spills 351px past right edge
  - <div class="w-7 h-7 rounded-md bg-[#D1CBC2]"> spills 200px past right edge
  - <span class="text-sm font-semibold text-[#6B7280] whitespace-nowrap"> spills 351px past right edge
  - <div class="flex-shrink-0 mx-8 flex items-center gap-2 opacity-30 hover:"> spills 583px past right edge
  - <div class="w-7 h-7 rounded-md bg-[#D1CBC2]"> spills 443px past right edge
  - <span class="text-sm font-semibold text-[#6B7280] whitespace-nowrap"> spills 583px past right edge

### [Medium] layout-overlap — `/` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/page.tsx`
- **Screenshot:** `audit-results/screenshots/__mobile.png`
- **Distinct details (10):**
  - <div class="flex animate-marquee"> spills 2930px past right edge
  - <div class="flex-shrink-0 mx-8 flex items-center gap-2 opacity-30 hover:"> spills 45px past right edge
  - <span class="text-sm font-semibold text-[#6B7280] whitespace-nowrap"> spills 45px past right edge
  - <div class="flex-shrink-0 mx-8 flex items-center gap-2 opacity-30 hover:"> spills 253px past right edge
  - <div class="w-7 h-7 rounded-md bg-[#D1CBC2]"> spills 137px past right edge
  - <span class="text-sm font-semibold text-[#6B7280] whitespace-nowrap"> spills 253px past right edge
  - <div class="flex-shrink-0 mx-8 flex items-center gap-2 opacity-30 hover:"> spills 469px past right edge
  - <div class="w-7 h-7 rounded-md bg-[#D1CBC2]"> spills 345px past right edge
  - <span class="text-sm font-semibold text-[#6B7280] whitespace-nowrap"> spills 469px past right edge
  - <div class="flex-shrink-0 mx-8 flex items-center gap-2 opacity-30 hover:"> spills 696px past right edge

### [Medium] layout-overlap — `/learn/concrete-floors` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/concrete-floors/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_concrete-floors_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center flex-shrink-0"> spills 73px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 41px past right edge
  - <div class="relative w-9 h-9"> spills 41px past right edge
  - <div class="relative z-10 w-9 h-9 rounded-full flex items-center justify"> spills 41px past right edge
  - <span class="text-sm"> spills 33px past right edge
  - <div class="relative w-7 md:w-10 h-0.5 mx-0.5 flex-shrink-0 overflow-hid"> spills 71px past right edge
  - <div class="absolute inset-0 border-t-2 border-dashed border-[#E8E4DD]"> spills 71px past right edge
  - <div class="flex items-center flex-shrink-0"> spills 109px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 109px past right edge
  - <div class="relative w-9 h-9"> spills 109px past right edge

### [Medium] layout-overlap — `/learn/last-mile` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/last-mile/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_last-mile_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center flex-shrink-0"> spills 49px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 17px past right edge
  - <div class="relative w-9 h-9"> spills 17px past right edge
  - <div class="relative z-10 w-9 h-9 rounded-full flex items-center justify"> spills 17px past right edge
  - <span class="text-sm"> spills 9px past right edge
  - <div class="relative w-7 md:w-10 h-0.5 mx-0.5 flex-shrink-0 overflow-hid"> spills 47px past right edge
  - <div class="absolute inset-0 border-t-2 border-dashed border-[#E8E4DD]"> spills 47px past right edge
  - <div class="flex items-center flex-shrink-0"> spills 85px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 85px past right edge
  - <div class="relative w-9 h-9"> spills 85px past right edge

### [Medium] layout-overlap — `/learn/demand-planning` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/demand-planning/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_demand-planning_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center gap-0 min-w-max"> spills 86px past right edge
  - <div class="flex items-center"> spills 42px past right edge
  - <div class="flex flex-col items-center gap-0.5"> spills 18px past right edge
  - <div class="w-7 h-7 rounded-full flex items-center justify-center text-["> spills 6px past right edge
  - <p class="text-[8px] font-semibold max-w-[52px] text-center leading-ti"> spills 18px past right edge
  - <div class="w-5 h-0.5 mx-0.5 rounded-full mb-3 transition-all bg-[#E8E4D"> spills 40px past right edge
  - <div class="flex items-center"> spills 86px past right edge
  - <div class="flex flex-col items-center gap-0.5"> spills 86px past right edge
  - <div class="w-7 h-7 rounded-full flex items-center justify-center text-["> spills 78px past right edge
  - <p class="text-[8px] font-semibold max-w-[52px] text-center leading-ti"> spills 86px past right edge

### [Medium] layout-overlap — `/learn/emergency-po` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/emergency-po/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_emergency-po_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center flex-shrink-0"> spills 49px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 17px past right edge
  - <div class="relative w-9 h-9"> spills 17px past right edge
  - <div class="relative z-10 w-9 h-9 rounded-full flex items-center justify"> spills 17px past right edge
  - <span class="text-sm"> spills 9px past right edge
  - <div class="relative w-7 md:w-10 h-0.5 mx-0.5 flex-shrink-0 overflow-hid"> spills 47px past right edge
  - <div class="absolute inset-0 border-t-2 border-dashed border-[#E8E4DD]"> spills 47px past right edge
  - <div class="flex items-center flex-shrink-0"> spills 85px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 85px past right edge
  - <div class="relative w-9 h-9"> spills 85px past right edge

### [Medium] layout-overlap — `/learn/grn-three-way-match` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/grn-three-way-match/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_grn-three-way-match_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center flex-shrink-0"> spills 66px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 34px past right edge
  - <div class="relative w-9 h-9"> spills 34px past right edge
  - <div class="relative z-10 w-9 h-9 rounded-full flex items-center justify"> spills 34px past right edge
  - <span class="text-sm"> spills 26px past right edge
  - <div class="relative w-7 md:w-10 h-0.5 mx-0.5 flex-shrink-0 overflow-hid"> spills 64px past right edge
  - <div class="absolute inset-0 border-t-2 border-dashed border-[#E8E4DD]"> spills 64px past right edge
  - <div class="flex items-center flex-shrink-0"> spills 102px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 102px past right edge
  - <div class="relative w-9 h-9"> spills 102px past right edge

### [Medium] layout-overlap — `/learn/incoterms-dock` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/incoterms-dock/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_incoterms-dock_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center flex-shrink-0"> spills 49px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 17px past right edge
  - <div class="relative w-9 h-9"> spills 17px past right edge
  - <div class="relative z-10 w-9 h-9 rounded-full flex items-center justify"> spills 17px past right edge
  - <span class="text-sm"> spills 9px past right edge
  - <div class="relative w-7 md:w-10 h-0.5 mx-0.5 flex-shrink-0 overflow-hid"> spills 47px past right edge
  - <div class="absolute inset-0 border-t-2 border-dashed border-[#E8E4DD]"> spills 47px past right edge
  - <div class="flex items-center flex-shrink-0"> spills 85px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 85px past right edge
  - <div class="relative w-9 h-9"> spills 85px past right edge

### [Medium] layout-overlap — `/learn/inventory-management` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/inventory-management/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_inventory-management_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center gap-0 min-w-max"> spills 134px past right edge
  - <div class="flex items-center"> spills 8px past right edge
  - <div class="w-5 h-0.5 mx-0.5 rounded-full mb-3 transition-all bg-[#E8E4D"> spills 6px past right edge
  - <div class="flex items-center"> spills 82px past right edge
  - <div class="flex flex-col items-center gap-0.5"> spills 58px past right edge
  - <div class="w-7 h-7 rounded-full flex items-center justify-center text-["> spills 47px past right edge
  - <p class="text-[8px] font-semibold max-w-[52px] text-center leading-ti"> spills 58px past right edge
  - <div class="w-5 h-0.5 mx-0.5 rounded-full mb-3 transition-all bg-[#E8E4D"> spills 80px past right edge
  - <div class="flex items-center"> spills 134px past right edge
  - <div class="flex flex-col items-center gap-0.5"> spills 134px past right edge

### [Medium] layout-overlap — `/learn/order-to-cash` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/order-to-cash/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_order-to-cash_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center flex-shrink-0"> spills 49px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 17px past right edge
  - <div class="relative w-9 h-9"> spills 17px past right edge
  - <div class="relative z-10 w-9 h-9 rounded-full flex items-center justify"> spills 17px past right edge
  - <span class="text-sm"> spills 9px past right edge
  - <div class="relative w-7 md:w-10 h-0.5 mx-0.5 flex-shrink-0 overflow-hid"> spills 47px past right edge
  - <div class="absolute inset-0 border-t-2 border-dashed border-[#E8E4DD]"> spills 47px past right edge
  - <div class="flex items-center flex-shrink-0"> spills 85px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 85px past right edge
  - <div class="relative w-9 h-9"> spills 85px past right edge

### [Medium] layout-overlap — `/learn/procure-to-pay` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/procure-to-pay/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_procure-to-pay_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center flex-shrink-0"> spills 73px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 41px past right edge
  - <div class="relative w-9 h-9"> spills 41px past right edge
  - <div class="relative z-10 w-9 h-9 rounded-full flex items-center justify"> spills 41px past right edge
  - <span class="text-sm"> spills 33px past right edge
  - <div class="relative w-7 md:w-10 h-0.5 mx-0.5 flex-shrink-0 overflow-hid"> spills 71px past right edge
  - <div class="absolute inset-0 border-t-2 border-dashed border-[#E8E4DD]"> spills 71px past right edge
  - <div class="flex items-center flex-shrink-0"> spills 109px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 109px past right edge
  - <div class="relative w-9 h-9"> spills 109px past right edge

### [Medium] layout-overlap — `/learn/vendor-comparison` [mobile] (×10 occurrences)

- **Likely file to fix:** `app/learn/vendor-comparison/page.tsx`
- **Screenshot:** `audit-results/screenshots/_learn_vendor-comparison_mobile.png`
- **Distinct details (10):**
  - <div class="flex items-center flex-shrink-0"> spills 73px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 41px past right edge
  - <div class="relative w-9 h-9"> spills 41px past right edge
  - <div class="relative z-10 w-9 h-9 rounded-full flex items-center justify"> spills 41px past right edge
  - <span class="text-sm"> spills 33px past right edge
  - <div class="relative w-7 md:w-10 h-0.5 mx-0.5 flex-shrink-0 overflow-hid"> spills 71px past right edge
  - <div class="absolute inset-0 border-t-2 border-dashed border-[#E8E4DD]"> spills 71px past right edge
  - <div class="flex items-center flex-shrink-0"> spills 109px past right edge
  - <div class="flex flex-col items-center gap-1"> spills 109px past right edge
  - <div class="relative w-9 h-9"> spills 109px past right edge

> 💡 **Root-cause hint:** the same `layout-overlap` issue appears on 10 different /learn/ pages. These pages share a template/components, so this is likely **one underlying bug** — fixing the shared learn-page layout once should resolve most of these at once.

---

## 📈 Quality Scores (Lighthouse)

### `https://www.operationsdecoded.com/`

- [Low] **Performance:** 95/100
- [Low] **Accessibility:** 91/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 91/100
- [Low] **Performance:** 98/100
- [Low] **Accessibility:** 91/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 98/100
- [Low] **Accessibility:** 91/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
### `https://www.operationsdecoded.com/about`

- [Low] **Performance:** 96/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
### `https://www.operationsdecoded.com/blog`

- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 98/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 91/100
### `https://www.operationsdecoded.com/contact`

- [Low] **Performance:** 100/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
### `https://www.operationsdecoded.com/learn/inventory-management`

- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
### `https://www.operationsdecoded.com/solutions`

- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100
- [Low] **Performance:** 99/100
- [Low] **Accessibility:** 95/100
- [Low] **Best Practices:** 100/100
- [Low] **SEO:** 100/100

---

## 📋 How to use this report

1. Fix **Critical** items first, then High, Medium, Low.
2. The "Likely file to fix" is a hint, not a guarantee.
3. Open the screenshot to see exactly what the issue looks like.
4. Paste this whole file into Claude Code to apply fixes.
