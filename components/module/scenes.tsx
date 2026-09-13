"use client";

/**
 * The Factory — SVG scene art + character sprites for the stage.
 * Flat-illustration style in the Workshop Premium palette.
 * Shared coordinate space: viewBox 0 0 960 420, floor line at y=356.
 */

import { motion, useReducedMotion } from "framer-motion";

export type SceneId = "warehouse" | "office" | "dock" | "finance";
export const FLOOR_Y = 356;

const C = {
  wallA: "#EFE7D6", wallB: "#E7DCC6", floor: "#D9CBB1", floorLine: "#C7B591",
  wood: "#8B5E3C", woodDeep: "#6E4A2F", steel: "#5B6670", steelDeep: "#454F58",
  brass: "#B97E2C", paper: "#FFFDF8", ink: "#2B2620", green: "#3E7A4E",
  tube: "#9AA5AE", board: "#C89B6B", boardDeep: "#A87C4F",
};

/* ------------------------------ characters ------------------------------- */

type SpriteConfig = { skin: string; hair: string; hairStyle: "short" | "bun" | "bald" | "cap" | "long"; top: string; vest?: boolean; glasses?: boolean; bottom: string; big?: boolean };

const CAST: Record<string, SpriteConfig> = {
  frank:  { skin: "#C68863", hair: "#B8B2A6", hairStyle: "short", top: "#7A4A2E", bottom: "#454F58" },
  priya:  { skin: "#A9713F", hair: "#2E2620", hairStyle: "long",  top: "#3E6F6A", bottom: "#2B2620" },
  dale:   { skin: "#E0A97E", hair: "#6B5B4A", hairStyle: "cap",   top: "#5B6670", vest: true, bottom: "#3B434B", big: true },
  marcus: { skin: "#E7B98A", hair: "#1E1B17", hairStyle: "short", top: "#3E5F8A", bottom: "#454F58", glasses: true },
  sofia:  { skin: "#D99C70", hair: "#4A2C1D", hairStyle: "long",  top: "#A8402F", bottom: "#2B2620" },
  ray:    { skin: "#8A5A33", hair: "#141210", hairStyle: "short", top: "#B97E2C", bottom: "#2B2620" },
  nadia:  { skin: "#E8C29B", hair: "#8A6A4F", hairStyle: "bun",   top: "#454F58", bottom: "#2B2620", glasses: true },
  tommy:  { skin: "#D8A671", hair: "#2E2620", hairStyle: "cap",   top: "#3E7A4E", vest: true, bottom: "#454F58" },
};

export function spriteExists(id: string) { return id in CAST; }

/** A flat character standing on the floor line at x (center). */
export function PersonSprite({ id, x, flip = false, talking = false, entering = false }: { id: string; x: number; flip?: boolean; talking?: boolean; entering?: boolean }) {
  const reduce = useReducedMotion();
  const c = CAST[id] ?? CAST.tommy;
  const w = c.big ? 1.12 : 1;
  const H = 118 * (c.big ? 1.04 : 1);
  const bodyW = 40 * w;
  return (
    <motion.g
      initial={entering && !reduce ? { x: x + (flip ? 140 : -140), opacity: 0 } : { x, opacity: 1 }}
      animate={{ x, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      style={{ originX: "0px", originY: "0px" }}
    >
      <motion.g
        animate={reduce ? {} : { y: [0, -2.5, 0] }}
        transition={{ duration: talking ? 1.1 : 2.4, repeat: Infinity, ease: "easeInOut" }}
        transform={flip ? "scale(-1,1)" : undefined}
      >
        {/* shadow */}
        <ellipse cx={0} cy={FLOOR_Y} rx={26 * w} ry={5} fill="rgba(43,38,32,0.18)" transform={flip ? "scale(-1,1)" : undefined} />
        {/* legs */}
        <rect x={-bodyW / 2 + 4} y={FLOOR_Y - 40} width={bodyW / 2 - 6} height={40} rx={5} fill={c.bottom} />
        <rect x={2} y={FLOOR_Y - 40} width={bodyW / 2 - 6} height={40} rx={5} fill={c.bottom} />
        {/* body */}
        <rect x={-bodyW / 2} y={FLOOR_Y - H + 34} width={bodyW} height={H - 72} rx={12} fill={c.top} />
        {c.vest && (
          <>
            <rect x={-bodyW / 2} y={FLOOR_Y - H + 34} width={bodyW} height={H - 72} rx={12} fill="#E8892B" opacity={0.92} />
            <rect x={-bodyW / 2} y={FLOOR_Y - H + 52} width={bodyW} height={7} fill="#F5EFE4" opacity={0.9} />
          </>
        )}
        {/* arms */}
        <rect x={-bodyW / 2 - 9} y={FLOOR_Y - H + 40} width={9} height={40} rx={4.5} fill={c.top} />
        <rect x={bodyW / 2} y={FLOOR_Y - H + 40} width={9} height={40} rx={4.5} fill={c.top} />
        {/* head */}
        <circle cx={0} cy={FLOOR_Y - H + 14} r={17} fill={c.skin} />
        {/* hair */}
        {c.hairStyle === "short" && <path d={`M -16 ${FLOOR_Y - H + 10} a 17 17 0 0 1 32 0 l 0 -3 a 17 14 0 0 0 -32 0 z`} fill={c.hair} />}
        {c.hairStyle === "short" && <rect x={-17} y={FLOOR_Y - H - 3} width={34} height={11} rx={6} fill={c.hair} />}
        {c.hairStyle === "long" && (
          <>
            <rect x={-17} y={FLOOR_Y - H - 3} width={34} height={12} rx={6} fill={c.hair} />
            <rect x={-19} y={FLOOR_Y - H + 2} width={8} height={30} rx={4} fill={c.hair} />
            <rect x={11} y={FLOOR_Y - H + 2} width={8} height={30} rx={4} fill={c.hair} />
          </>
        )}
        {c.hairStyle === "bun" && (
          <>
            <rect x={-17} y={FLOOR_Y - H - 2} width={34} height={10} rx={5} fill={c.hair} />
            <circle cx={0} cy={FLOOR_Y - H - 6} r={7} fill={c.hair} />
          </>
        )}
        {c.hairStyle === "cap" && (
          <>
            <path d={`M -17 ${FLOOR_Y - H + 6} a 17 17 0 0 1 34 0 z`} fill={C.steelDeep} />
            <rect x={-22} y={FLOOR_Y - H + 3} width={26} height={5} rx={2.5} fill={C.steelDeep} />
          </>
        )}
        {c.glasses && (
          <g stroke={C.ink} strokeWidth={1.6} fill="none" opacity={0.85}>
            <circle cx={-6.5} cy={FLOOR_Y - H + 15} r={4.5} />
            <circle cx={6.5} cy={FLOOR_Y - H + 15} r={4.5} />
            <line x1={-2} y1={FLOOR_Y - H + 15} x2={2} y2={FLOOR_Y - H + 15} />
          </g>
        )}
        {/* face: eyes + mouth (talking = open) */}
        <circle cx={-6} cy={FLOOR_Y - H + 15} r={1.7} fill={C.ink} />
        <circle cx={6} cy={FLOOR_Y - H + 15} r={1.7} fill={C.ink} />
        {talking ? (
          <motion.ellipse cx={0} cy={FLOOR_Y - H + 23} rx={3.4} ry={2.6} fill={C.ink}
            animate={reduce ? {} : { ry: [2.6, 1, 2.6] }} transition={{ duration: 0.5, repeat: Infinity }} />
        ) : (
          <path d={`M -4 ${FLOOR_Y - H + 23} q 4 3 8 0`} stroke={C.ink} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        )}
      </motion.g>
    </motion.g>
  );
}

/* -------------------------------- props ---------------------------------- */

function Rack({ x, label, sparse = false }: { x: number; label?: string; sparse?: boolean }) {
  const boards = sparse ? [0, 3] : [0, 1, 2, 3, 4, 5];
  return (
    <g transform={`translate(${x},0)`}>
      <rect x={0} y={128} width={14} height={FLOOR_Y - 128} fill={C.steel} />
      <rect x={196} y={128} width={14} height={FLOOR_Y - 128} fill={C.steel} />
      {[168, 238, 308].map((y) => (
        <rect key={y} x={-4} y={y} width={218} height={10} fill={C.steelDeep} />
      ))}
      {boards.map((i) => {
        const shelf = Math.floor(i / 2), slot = i % 2;
        return <rect key={i} x={22 + slot * 92} y={140 + shelf * 70} width={78} height={24} rx={3} fill={slot ? C.board : C.boardDeep} />;
      })}
      {label && (
        <g>
          <rect x={52} y={FLOOR_Y - 66} width={116} height={26} rx={4} fill={C.paper} stroke={C.floorLine} />
          <text x={110} y={FLOOR_Y - 48} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.ink} fontFamily="Inter, sans-serif">{label}</text>
        </g>
      )}
    </g>
  );
}

function Window({ x, y = 118, w = 120, h = 96 }: { x: number; y?: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#DCE6E4" stroke={C.floorLine} strokeWidth={3} />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={C.floorLine} strokeWidth={3} />
      <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={C.floorLine} strokeWidth={3} />
    </g>
  );
}

function Desk({ x, laptop = true }: { x: number; laptop?: boolean }) {
  return (
    <g>
      <rect x={x} y={FLOOR_Y - 78} width={190} height={12} rx={4} fill={C.wood} />
      <rect x={x + 10} y={FLOOR_Y - 66} width={12} height={66} fill={C.woodDeep} />
      <rect x={x + 168} y={FLOOR_Y - 66} width={12} height={66} fill={C.woodDeep} />
      {laptop && (
        <g>
          <rect x={x + 66} y={FLOOR_Y - 112} width={58} height={36} rx={3} fill={C.steelDeep} />
          <rect x={x + 70} y={FLOOR_Y - 108} width={50} height={28} rx={2} fill="#BFD3CE" />
          <rect x={x + 60} y={FLOOR_Y - 78} width={70} height={5} rx={2} fill={C.steel} />
        </g>
      )}
    </g>
  );
}

function Plant({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={FLOOR_Y - 34} width={30} height={34} rx={4} fill={C.woodDeep} />
      <circle cx={x + 15} cy={FLOOR_Y - 52} r={16} fill={C.green} />
      <circle cx={x + 4} cy={FLOOR_Y - 42} r={11} fill="#4E8A5E" />
      <circle cx={x + 27} cy={FLOOR_Y - 42} r={11} fill="#356843" />
    </g>
  );
}

function Poster({ x, lines }: { x: number; lines: [string, string] }) {
  return (
    <g>
      <rect x={x} y={130} width={104} height={72} rx={4} fill={C.paper} stroke={C.floorLine} strokeWidth={2} />
      <text x={x + 52} y={160} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.wood} fontFamily="Fraunces, serif">{lines[0]}</text>
      <text x={x + 52} y={178} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.wood} fontFamily="Fraunces, serif">{lines[1]}</text>
    </g>
  );
}

export function Truck({ arrive }: { arrive: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.g initial={reduce ? { x: 0 } : { x: arrive ? 300 : 0 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 60, damping: 17 }}>
      <rect x={700} y={FLOOR_Y - 128} width={160} height={96} rx={6} fill={C.paper} stroke={C.floorLine} strokeWidth={2} />
      <text x={780} y={FLOOR_Y - 74} textAnchor="middle" fontSize={13} fontWeight={800} fill={C.steel} fontFamily="Inter, sans-serif" letterSpacing={1}>CRESTLINE</text>
      <rect x={860} y={FLOOR_Y - 96} width={54} height={64} rx={6} fill={C.steel} />
      <rect x={868} y={FLOOR_Y - 88} width={30} height={24} rx={3} fill="#DCE6E4" />
      <motion.circle cx={738} cy={FLOOR_Y - 20} r={17} fill={C.ink} animate={reduce ? {} : { rotate: 360 }} style={{ originX: "738px", originY: `${FLOOR_Y - 20}px` }} />
      <circle cx={738} cy={FLOOR_Y - 20} r={8} fill={C.steel} />
      <motion.circle cx={886} cy={FLOOR_Y - 20} r={17} fill={C.ink} />
      <circle cx={886} cy={FLOOR_Y - 20} r={8} fill={C.steel} />
    </motion.g>
  );
}

/* -------------------------------- scenes --------------------------------- */

function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <>
      <rect x={0} y={0} width={960} height={FLOOR_Y} fill={C.wallA} />
      <rect x={0} y={96} width={960} height={8} fill={C.wallB} />
      <rect x={0} y={FLOOR_Y} width={960} height={420 - FLOOR_Y} fill={C.floor} />
      <line x1={0} y1={FLOOR_Y} x2={960} y2={FLOOR_Y} stroke={C.floorLine} strokeWidth={3} />
      {children}
    </>
  );
}

export function SceneArt({ scene, rackLabel, truckArrive }: { scene: SceneId; rackLabel?: string; truckArrive?: boolean }) {
  switch (scene) {
    case "warehouse":
      return (
        <Backdrop>
          <Rack x={60} label={rackLabel ?? "RACK 14 · 25MM TUBE"} sparse />
          <Rack x={330} />
          <g>
            <rect x={800} y={128} width={92} height={FLOOR_Y - 128} fill={C.woodDeep} />
            <rect x={808} y={140} width={76} height={FLOOR_Y - 152} fill={C.wood} />
            <circle cx={876} cy={248} r={4} fill={C.brass} />
            <text x={846} y={118} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.steel} fontFamily="Inter, sans-serif" letterSpacing={2}>PROCUREMENT →</text>
          </g>
        </Backdrop>
      );
    case "office":
      return (
        <Backdrop>
          <Window x={70} /> <Window x={230} />
          <Poster x={412} lines={["MEASURE TWICE,", "ORDER ONCE."]} />
          <Desk x={560} />
          <Plant x={880} />
          <text x={120} y={FLOOR_Y + 40} fontSize={0} />
        </Backdrop>
      );
    case "dock":
      return (
        <Backdrop>
          <g>
            <rect x={40} y={110} width={150} height={FLOOR_Y - 110} fill={C.steel} />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={40} y1={140 + i * 44} x2={190} y2={140 + i * 44} stroke={C.steelDeep} strokeWidth={5} />
            ))}
            <text x={115} y={100} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.steel} fontFamily="Inter, sans-serif" letterSpacing={2}>BAY 3 · RAW MATERIALS</text>
          </g>
          <g>
            <rect x={250} y={FLOOR_Y - 46} width={150} height={12} rx={2} fill={C.boardDeep} />
            <rect x={258} y={FLOOR_Y - 34} width={134} height={34} fill={C.wood} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={252} y={FLOOR_Y - 62 - i * 13} width={146} height={11} rx={5.5} fill={C.tube} stroke={C.steelDeep} strokeWidth={1} />
            ))}
            <rect x={276} y={FLOOR_Y - 96} width={98} height={22} rx={4} fill={C.paper} stroke={C.floorLine} />
            <text x={325} y={FLOOR_Y - 81} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.ink} fontFamily="Inter, sans-serif">INSPECTION AREA</text>
          </g>
          <Truck arrive={!!truckArrive} />
        </Backdrop>
      );
    case "finance":
      return (
        <Backdrop>
          <Window x={80} />
          <g>
            <rect x={250} y={168} width={90} height={FLOOR_Y - 168} fill={C.steel} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={258} y={180 + i * 56} width={74} height={40} rx={3} fill={C.steelDeep} />
            ))}
          </g>
          <Poster x={400} lines={["THE DOCUMENTS", "AGREE."]} />
          <Desk x={560} laptop={false} />
          <g>
            <rect x={600} y={FLOOR_Y - 104} width={44} height={26} rx={3} fill={C.paper} stroke={C.floorLine} />
            <rect x={664} y={FLOOR_Y - 116} width={16} height={26} rx={3} fill={C.woodDeep} />
            <rect x={656} y={FLOOR_Y - 94} width={32} height={10} rx={3} fill={C.brass} />
          </g>
          <Plant x={890} />
        </Backdrop>
      );
  }
}

export function sceneForLocation(location: string): SceneId {
  const l = location.toLowerCase();
  if (l.includes("warehouse") || l.includes("rack") || l.includes("stock")) return "warehouse";
  if (l.includes("bay") || l.includes("receiv") || l.includes("dock") || l.includes("shipping")) return "dock";
  if (l.includes("finance") || l.includes("accounts") || l.includes("payable")) return "finance";
  return "office";
}
