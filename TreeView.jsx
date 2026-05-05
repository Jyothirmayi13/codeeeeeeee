import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { RefreshCw, Info } from "lucide-react";

const NODE_R = 28;
const X_GAP  = 60;
const Y_GAP  = 100;

function assignCoords(node, depth = 0, counter = { x: 0 }) {
  if (!node) return null;
  const left  = assignCoords(node.left,  depth + 1, counter);
  const self  = { ...node, depth };
  self.x = counter.x * X_GAP;
  counter.x += 1;
  const right = assignCoords(node.right, depth + 1, counter);
  self._left = left; self._right = right;
  self.y = depth * Y_GAP;
  return self;
}

function collect(node, nodes = [], edges = []) {
  if (!node) return { nodes, edges };
  nodes.push(node);
  if (node._left)  { edges.push([node, node._left]);  collect(node._left,  nodes, edges); }
  if (node._right) { edges.push([node, node._right]); collect(node._right, nodes, edges); }
  return { nodes, edges };
}

const priorityColor = (p) => {
  if (p === "High")   return { fill: "#fee2e2", ring: "#ef4444" };
  if (p === "Medium") return { fill: "#fef3c7", ring: "#f59e0b" };
  return { fill: "#ccfbf1", ring: "#0d9488" };
};

export default function TreeView() {
  const [tree, setTree] = useState(null);
  const reload = () => api.tree().then(setTree);
  useEffect(() => {
    reload();
    const t = setInterval(reload, 4000);
    return () => clearInterval(t);
  }, []);

  const laid = tree?.root ? assignCoords(tree.root) : null;
  const { nodes, edges } = laid ? collect(laid) : { nodes: [], edges: [] };

  const width  = Math.max(900, (nodes.length + 1) * X_GAP + 80);
  const height = Math.max(300, ((tree?.height ?? 1) + 1) * Y_GAP + 80);

  return (
    <div className="space-y-4" data-testid="tree-page">
      <Card className="p-5 rounded-2xl border-slate-200">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="font-heading text-2xl">Patient Priority Queue</div>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Live view of all active patients, automatically arranged by urgency and appointment time.
              Emergency cases always appear first. The system self-balances to keep lookups fast
              no matter how many patients are added.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Stat label="Active patients" value={tree?.size ?? 0} />
            <Stat label="Queue depth"     value={tree?.height ?? 0} />
            <Button variant="outline" size="sm" onClick={reload} data-testid="tree-refresh-btn">
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-xs">
          <Legend color="#ef4444" label="Emergency / High priority" />
          <Legend color="#f59e0b" label="Medium priority" />
          <Legend color="#0d9488" label="Routine / Low priority" />
          <div className="flex items-center gap-1 text-slate-500">
            <Info className="h-3.5 w-3.5" /> Each card shows the patient's name and scheduling position.
          </div>
        </div>
      </Card>

      <Card className="p-3 rounded-2xl border-slate-200 overflow-auto">
        {!laid ? (
          <div className="empty-state">No patients in the queue. Add a patient to see them appear here.</div>
        ) : (
          <svg width={width} height={height} data-testid="avl-svg">
            <g transform={`translate(40, 40)`}>
              {edges.map(([a, b], i) => (
                <line key={i}
                      x1={a.x + NODE_R} y1={a.y + NODE_R}
                      x2={b.x + NODE_R} y2={b.y + NODE_R}
                      className="avl-edge" />
              ))}
              {nodes.map((n) => {
                const c = priorityColor(n.priority);
                return (
                  <g key={n.id} className="avl-node-g" transform={`translate(${n.x}, ${n.y})`}>
                    <circle cx={NODE_R} cy={NODE_R} r={NODE_R}
                            fill={c.fill} stroke={c.ring} strokeWidth={2} />
                    <text x={NODE_R} y={NODE_R - 2} textAnchor="middle"
                          className="avl-node-label" fontSize="11" fontWeight="600" fill="#0f172a">
                      {n.name.split(" ")[0].slice(0, 8)}
                    </text>
                    <text x={NODE_R} y={NODE_R + 12} textAnchor="middle"
                          className="avl-node-label" fontSize="10" fill="#475569">
                      {n.priority}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        )}
      </Card>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div>
    <div className="text-xs uppercase text-slate-500">{label}</div>
    <div className="font-heading text-2xl">{value}</div>
  </div>
);

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-1.5 text-slate-600">
    <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
    {label}
  </div>
);
