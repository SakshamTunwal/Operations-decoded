"use client";

/**
 * The Factory v2 — density pass.
 * Richer rooms (ceiling lights, wall paneling, depth layers, props),
 * refined sprites (necks, hands, shoes, a raised arm while talking),
 * ambient background workers, and DataPlaque: live per-step data
 * rendered inside the world from module JSON (journey.sceneData).
 * Shared space: viewBox 0 0 960 420, floor at y=356.
 */

import { motion, useReducedMotion } from "framer-motion";

export type SceneId = "warehouse" | "office" | "dock" | "finance";
export const FLOOR_Y = 356;

const C = {
  wallA: "#EFE7D6", wallB: "#E7DCC6", wallPanel: "#E9DFCC", floor: "#D9CBB1",
  floorLine: "#C7B591", plank: "#D2C3A6",
  wood: "#8B5E3C", woodDeep: "#6E4A2F", steel: "#5B6670", steelDeep: "#454F58",
  brass: "#B97E2C", paper: "#FFFDF8", ink: "#2B2620", green: "#3E7A4E",
  red: "#A8402F", blue: "#3E5F8A",
  tube: "#9AA5AE", board: "#C89B6B", boardDeep: "#A87C4F", glow: "#F7EBC9",
};

const toneColor: Record<string, string> = {
  positive: C.green, caution: C.brass, danger: C.red, info: C.steel, neutral: C.steel,
};

export interface SceneDatum { label: string; value?: string; tone?: string }

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

export function PersonSprite({ id, x, flip = false, talking = false, entering = false, muted = false }: { id: string; x: number; flip?: boolean; talking?: boolean; entering?: boolean; muted?: boolean }) {
  const reduce = useReducedMotion();
  const c = CAST[id] ?? CAST.tommy;
  const w = c.big ? 1.12 : 1;
  const H = 122 * (c.big ? 1.04 : 1);
  const bodyW = 42 * w;
  const headY = FLOOR_Y - H + 12;
  const shoulderY = FLOOR_Y - H + 38;
  const gray = (hex: string) => (muted ? "#B8AE9C" : hex);
  return (
    <motion.g
      initial={entering && !reduce ? { x: x + (flip ? 150 : -150), opacity: 0 } : { x, opacity: 1 }}
      animate={{ x, opacity: muted ? 0.55 : 1 }}
      transition={{ type: "spring", stiffness: 85, damping: 16 }}
    >
      <motion.g
        animate={reduce ? {} : { y: [0, -2.5, 0] }}
        transition={{ duration: talking ? 1.1 : 2.6, repeat: Infinity, ease: "easeInOut" }}
        transform={flip ? "scale(-1,1)" : undefined}
      >
        <ellipse cx={0} cy={FLOOR_Y} rx={27 * w} ry={5} fill="rgba(43,38,32,0.16)" />
        {/* legs + shoes */}
        <rect x={-bodyW / 2 + 5} y={FLOOR_Y - 44} width={bodyW / 2 - 8} height={38} rx={5} fill={gray(c.bottom)} />
        <rect x={3} y={FLOOR_Y - 44} width={bodyW / 2 - 8} height={38} rx={5} fill={gray(c.bottom)} />
        <rect x={-bodyW / 2 + 2} y={FLOOR_Y - 8} width={bodyW / 2 - 3} height={8} rx={4} fill={C.ink} />
        <rect x={1} y={FLOOR_Y - 8} width={bodyW / 2 - 3} height={8} rx={4} fill={C.ink} />
        {/* torso with shoulders */}
        <path d={`M ${-bodyW / 2} ${shoulderY + 10} q 0 -14 14 -14 l ${bodyW - 28} 0 q 14 0 14 14 l 0 ${H - 96} q 0 10 -10 10 l ${-(bodyW - 20)} 0 q -10 0 -10 -10 z`} fill={gray(c.top)} />
        {c.vest && !muted && (
          <>
            <path d={`M ${-bodyW / 2} ${shoulderY + 10} q 0 -14 14 -14 l ${bodyW - 28} 0 q 14 0 14 14 l 0 ${H - 96} q 0 10 -10 10 l ${-(bodyW - 20)} 0 q -10 0 -10 -10 z`} fill="#E8892B" opacity={0.92} />
            <rect x={-bodyW / 2} y={shoulderY + 24} width={bodyW} height={7} fill="#F5EFE4" opacity={0.9} />
            <rect x={-5} y={shoulderY - 4} width={10} height={H - 78} fill="#F5EFE4" opacity={0.35} />
          </>
        )}
        {/* static arm (far side) */}
        <rect x={-bodyW / 2 - 9} y={shoulderY + 4} width={9} height={44} rx={4.5} fill={gray(c.top)} />
        <circle cx={-bodyW / 2 - 4.5} cy={shoulderY + 52} r={5} fill={gray(c.skin)} />
        {/* gesture arm (near side): raises while talking */}
        <motion.g
          animate={talking && !reduce ? { rotate: -58 } : { rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 15 }}
          style={{ originX: `${bodyW / 2 + 2}px`, originY: `${shoulderY + 8}px` }}
        >
          <rect x={bodyW / 2} y={shoulderY + 4} width={9} height={44} rx={4.5} fill={gray(c.top)} />
          <circle cx={bodyW / 2 + 4.5} cy={shoulderY + 52} r={5} fill={gray(c.skin)} />
        </motion.g>
        {/* neck + head */}
        <rect x={-4} y={headY + 12} width={8} height={8} fill={gray(c.skin)} />
        <circle cx={0} cy={headY} r={17} fill={gray(c.skin)} />
        {c.hairStyle === "short" && <rect x={-17} y={headY - 17} width={34} height={12} rx={6} fill={gray(c.hair)} />}
        {c.hairStyle === "long" && (
          <>
            <rect x={-17} y={headY - 17} width={34} height={12} rx={6} fill={gray(c.hair)} />
            <rect x={-20} y={headY - 12} width={8} height={32} rx={4} fill={gray(c.hair)} />
            <rect x={12} y={headY - 12} width={8} height={32} rx={4} fill={gray(c.hair)} />
          </>
        )}
        {c.hairStyle === "bun" && (
          <>
            <rect x={-17} y={headY - 16} width={34} height={10} rx={5} fill={gray(c.hair)} />
            <circle cx={0} cy={headY - 20} r={7} fill={gray(c.hair)} />
          </>
        )}
        {c.hairStyle === "cap" && (
          <>
            <path d={`M -17 ${headY - 8} a 17 17 0 0 1 34 0 z`} fill={C.steelDeep} />
            <rect x={-23} y={headY - 11} width={27} height={5} rx={2.5} fill={C.steelDeep} />
          </>
        )}
        {c.glasses && !muted && (
          <g stroke={C.ink} strokeWidth={1.6} fill="none" opacity={0.85}>
            <circle cx={-6.5} cy={headY + 1} r={4.5} />
            <circle cx={6.5} cy={headY + 1} r={4.5} />
            <line x1={-2} y1={headY + 1} x2={2} y2={headY + 1} />
          </g>
        )}
        {!muted && (
          <>
            <circle cx={-6} cy={headY + 1} r={1.7} fill={C.ink} />
            <circle cx={6} cy={headY + 1} r={1.7} fill={C.ink} />
            {talking ? (
              <motion.ellipse cx={0} cy={headY + 9} rx={3.4} ry={2.6} fill={C.ink}
                animate={reduce ? {} : { ry: [2.6, 1, 2.6] }} transition={{ duration: 0.5, repeat: Infinity }} />
            ) : (
              <path d={`M -4 ${headY + 9} q 4 3 8 0`} stroke={C.ink} strokeWidth={1.6} fill="none" strokeLinecap="round" />
            )}
          </>
        )}
      </motion.g>
    </motion.g>
  );
}

/** Desaturated far-layer worker drifting slowly — background life. */
function AmbientWorker({ x, range = 46, dur = 16, id = "tommy" }: { x: number; range?: number; dur?: number; id?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.g animate={reduce ? {} : { x: [0, range, 0] }} transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }} transform={`translate(0,-6) scale(0.82)`} style={{ transformOrigin: `${x}px ${FLOOR_Y}px` }}>
      <PersonSprite id={id} x={x} muted />
    </motion.g>
  );
}

/* -------------------------------- props ---------------------------------- */

function CeilingLight({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 1.5} y={0} width={3} height={34} fill={C.steelDeep} />
      <path d={`M ${x - 26} 58 L ${x + 26} 58 L ${x + 16} 34 L ${x - 16} 34 Z`} fill={C.steelDeep} />
      <ellipse cx={x} cy={62} rx={24} ry={6} fill={C.glow} opacity={0.85} />
      <path d={`M ${x - 24} 60 L ${x + 24} 60 L ${x + 64} ${FLOOR_Y} L ${x - 64} ${FLOOR_Y} Z`} fill={C.glow} opacity={0.14} />
    </g>
  );
}

export function DataPlaque({ x, y, datum, wide = false }: { x: number; y: number; datum: SceneDatum; wide?: boolean }) {
  const tone = toneColor[datum.tone ?? "info"];
  const w = wide ? 172 : 148;
  return (
    <motion.g initial={{ opacity: 0, y: y + 8 }} animate={{ opacity: 1, y }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
      <rect x={x} y={0} width={w} height={datum.value ? 44 : 27} rx={5} fill={C.paper} stroke={C.floorLine} strokeWidth={1.5} />
      <rect x={x} y={0} width={5} height={datum.value ? 44 : 27} rx={2.5} fill={tone} />
      <text x={x + w / 2 + 2} y={18} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.ink} fontFamily="Inter, sans-serif" letterSpacing={0.4}>{datum.label}</text>
      {datum.value && (
        <text x={x + w / 2 + 2} y={35} textAnchor="middle" fontSize={11.5} fontWeight={800} fill={tone} fontFamily="Inter, sans-serif" letterSpacing={0.6}>{datum.value}</text>
      )}
    </motion.g>
  );
}

function Rack({ x, sparse = false, back = false }: { x: number; sparse?: boolean; back?: boolean }) {
  const boards = sparse ? [0, 3] : [0, 1, 2, 3, 4, 5];
  const post = back ? "#8E979E" : C.steel, beam = back ? "#79828B" : C.steelDeep;
  const b1 = back ? "#D6B48C" : C.board, b2 = back ? "#BC9268" : C.boardDeep;
  return (
    <g transform={`translate(${x},0)${back ? " scale(0.86)" : ""}`} opacity={back ? 0.7 : 1}>
      <rect x={0} y={128} width={14} height={FLOOR_Y - 128} fill={post} />
      <rect x={196} y={128} width={14} height={FLOOR_Y - 128} fill={post} />
      {[168, 238, 308].map((y) => <rect key={y} x={-4} y={y} width={218} height={10} fill={beam} />)}
      {boards.map((i) => {
        const shelf = Math.floor(i / 2), slot = i % 2;
        return <rect key={i} x={22 + slot * 92} y={140 + shelf * 70} width={78} height={24} rx={3} fill={slot ? b1 : b2} />;
      })}
    </g>
  );
}

function BoxStack({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={FLOOR_Y - 34} width={44} height={34} rx={3} fill={C.board} stroke={C.boardDeep} strokeWidth={2} />
      <rect x={x + 8} y={FLOOR_Y - 62} width={38} height={28} rx={3} fill={C.boardDeep} stroke={C.woodDeep} strokeWidth={2} />
      <line x1={x + 22} y1={FLOOR_Y - 34} x2={x + 22} y2={FLOOR_Y} stroke={C.boardDeep} strokeWidth={2} />
    </g>
  );
}

function PalletJack({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={FLOOR_Y - 16} width={70} height={7} rx={3} fill={C.red} />
      <rect x={x + 62} y={FLOOR_Y - 52} width={7} height={40} rx={3} fill={C.red} transform={`rotate(14 ${x + 65} ${FLOOR_Y - 12})`} />
      <circle cx={x + 10} cy={FLOOR_Y - 6} r={6} fill={C.ink} />
      <circle cx={x + 58} cy={FLOOR_Y - 6} r={6} fill={C.ink} />
    </g>
  );
}

function Window({ x, y = 118, w = 120, h = 96 }: { x: number; y?: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#DCE6E4" stroke={C.floorLine} strokeWidth={3} />
      <path d={`M ${x + 8} ${y + h - 8} L ${x + w * 0.45} ${y + 8} L ${x + w * 0.62} ${y + 8} L ${x + 8 + w * 0.17} ${y + h - 8} Z`} fill="#fff" opacity={0.35} />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={C.floorLine} strokeWidth={3} />
      <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={C.floorLine} strokeWidth={3} />
      <rect x={x - 6} y={y + h} width={w + 12} height={6} rx={3} fill={C.floorLine} />
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
          <rect x={x + 74} y={FLOOR_Y - 104} width={26} height={3} fill={C.steel} />
          <rect x={x + 74} y={FLOOR_Y - 98} width={38} height={3} fill={C.steel} />
          <rect x={x + 60} y={FLOOR_Y - 78} width={70} height={5} rx={2} fill={C.steel} />
        </g>
      )}
      <rect x={x + 138} y={FLOOR_Y - 92} width={34} height={14} rx={2} fill={C.paper} stroke={C.floorLine} />
    </g>
  );
}

function Bookshelf({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={150} width={96} height={FLOOR_Y - 150} fill={C.wood} />
      <rect x={x + 6} y={158} width={84} height={FLOOR_Y - 166} fill={C.paper} opacity={0.25} />
      {[170, 226, 282].map((y) => (
        <g key={y}>
          <rect x={x + 6} y={y + 34} width={84} height={6} fill={C.woodDeep} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={x + 10 + i * 16} y={y} width={11} height={34} rx={1.5} fill={[C.steel, C.brass, C.green, C.red, C.blue][i]} opacity={0.75} />
          ))}
        </g>
      ))}
    </g>
  );
}

function WallClock({ x, y = 130 }: { x: number; y?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={17} fill={C.paper} stroke={C.steelDeep} strokeWidth={3} />
      <line x1={x} y1={y} x2={x} y2={y - 10} stroke={C.ink} strokeWidth={2} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x + 7} y2={y + 3} stroke={C.ink} strokeWidth={2} strokeLinecap="round" />
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
      <motion.circle cx={738} cy={FLOOR_Y - 20} r={17} fill={C.ink} />
      <circle cx={738} cy={FLOOR_Y - 20} r={8} fill={C.steel} />
      <circle cx={886} cy={FLOOR_Y - 20} r={17} fill={C.ink} />
      <circle cx={886} cy={FLOOR_Y - 20} r={8} fill={C.steel} />
    </motion.g>
  );
}

/* -------------------------------- scenes --------------------------------- */

function Backdrop({ children, lights = [240, 620] }: { children: React.ReactNode; lights?: number[] }) {
  return (
    <>
      <rect x={0} y={0} width={960} height={FLOOR_Y} fill={C.wallA} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={i * 124} y={0} width={4} height={FLOOR_Y - 40} fill={C.wallPanel} />
      ))}
      <rect x={0} y={96} width={960} height={8} fill={C.wallB} />
      <rect x={0} y={FLOOR_Y - 14} width={960} height={14} fill={C.wallB} />
      <rect x={0} y={FLOOR_Y} width={960} height={420 - FLOOR_Y} fill={C.floor} />
      {[120, 340, 560, 780].map((x) => (
        <line key={x} x1={x} y1={FLOOR_Y} x2={x - 30} y2={420} stroke={C.plank} strokeWidth={2} />
      ))}
      <line x1={0} y1={FLOOR_Y} x2={960} y2={FLOOR_Y} stroke={C.floorLine} strokeWidth={3} />
      {lights.map((x) => <CeilingLight key={x} x={x} />)}
      {children}
    </>
  );
}

export function SceneArt({ scene, datum, truckArrive }: { scene: SceneId; datum?: SceneDatum; truckArrive?: boolean }) {
  switch (scene) {
    case "warehouse":
      return (
        <Backdrop lights={[200, 520, 840]}>
          <Rack x={430} back />
          <Rack x={60} sparse />
          <Rack x={300} />
          <BoxStack x={560} />
          <PalletJack x={630} />
          <AmbientWorker x={880} id="tommy" range={-40} />
          <g>
            <rect x={800} y={128} width={92} height={FLOOR_Y - 128} fill={C.woodDeep} />
            <rect x={808} y={140} width={76} height={FLOOR_Y - 152} fill={C.wood} />
            <circle cx={876} cy={248} r={4} fill={C.brass} />
            <text x={846} y={118} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.steel} fontFamily="Inter, sans-serif" letterSpacing={2}>PROCUREMENT →</text>
          </g>
          {datum && <g transform={`translate(0, ${FLOOR_Y - 118})`}><DataPlaque x={62} y={0} datum={datum} wide /></g>}
        </Backdrop>
      );
    case "office":
      return (
        <Backdrop lights={[300, 700]}>
          <Window x={70} /> <Window x={230} />
          <Poster x={412} lines={["MEASURE TWICE,", "ORDER ONCE."]} />
          <WallClock x={560} />
          <Bookshelf x={62} />
          <Desk x={560} />
          <Plant x={880} />
          {datum && <g transform="translate(0,236)"><DataPlaque x={620} y={0} datum={datum} /></g>}
        </Backdrop>
      );
    case "dock":
      return (
        <Backdrop lights={[220, 560]}>
          <g>
            <rect x={40} y={110} width={150} height={FLOOR_Y - 110} fill={C.steel} />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={40} y1={140 + i * 44} x2={190} y2={140 + i * 44} stroke={C.steelDeep} strokeWidth={5} />
            ))}
            <rect x={40} y={FLOOR_Y - 12} width={150} height={12} fill="#E8B23A" />
            <text x={115} y={100} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.steel} fontFamily="Inter, sans-serif" letterSpacing={2}>BAY 3 · RAW MATERIALS</text>
          </g>
          <g>
            <rect x={250} y={FLOOR_Y - 46} width={150} height={12} rx={2} fill={C.boardDeep} />
            <rect x={258} y={FLOOR_Y - 34} width={134} height={34} fill={C.wood} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={252} y={FLOOR_Y - 62 - i * 13} width={146} height={11} rx={5.5} fill={C.tube} stroke={C.steelDeep} strokeWidth={1} />
            ))}
          </g>
          <g>
            {[0, 1].map((i) => (
              <path key={i} d={`M ${470 + i * 44} ${FLOOR_Y} l 10 -26 l 10 26 z`} fill="#E8892B" stroke="#fff" strokeWidth={2} />
            ))}
          </g>
          <AmbientWorker x={210} id="tommy" range={30} dur={12} />
          <Truck arrive={!!truckArrive} />
          {datum && <g transform={`translate(0, ${FLOOR_Y - 110})`}><DataPlaque x={252} y={0} datum={datum} wide /></g>}
        </Backdrop>
      );
    case "finance":
      return (
        <Backdrop lights={[260, 680]}>
          <Window x={80} />
          <g>
            <rect x={250} y={168} width={90} height={FLOOR_Y - 168} fill={C.steel} />
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={258} y={180 + i * 56} width={74} height={40} rx={3} fill={C.steelDeep} />
                <rect x={284} y={194 + i * 56} width={22} height={6} rx={3} fill={C.brass} />
              </g>
            ))}
          </g>
          <Poster x={400} lines={["THE DOCUMENTS", "AGREE."]} />
          <WallClock x={540} y={150} />
          <Desk x={560} laptop={false} />
          <g>
            <rect x={600} y={FLOOR_Y - 104} width={44} height={26} rx={3} fill={C.paper} stroke={C.floorLine} />
            <rect x={606} y={FLOOR_Y - 99} width={30} height={3} fill={C.floorLine} />
            <rect x={606} y={FLOOR_Y - 93} width={22} height={3} fill={C.floorLine} />
            <rect x={664} y={FLOOR_Y - 116} width={16} height={26} rx={3} fill={C.woodDeep} />
            <rect x={656} y={FLOOR_Y - 94} width={32} height={10} rx={3} fill={C.brass} />
          </g>
          <Plant x={890} />
          {datum && <g transform="translate(0,224)"><DataPlaque x={700} y={0} datum={datum} /></g>}
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
