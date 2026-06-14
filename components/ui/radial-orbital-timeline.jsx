"use client";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RadialOrbitalTimeline({
  timelineData,
  title,
  subtitle,
}) {
  const [expandedItems, setExpandedItems] = useState({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState({});
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [radius, setRadius] = useState(200);
  const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const containerRef = useRef(null);
  const orbitRef = useRef(null);
  const nodeRefs = useRef({});

  // Responsive orbit radius + a downward offset on mobile so the orbit clears
  // the section title.
  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const isMobile = w < 768;
      setRadius(isMobile ? Math.max(84, w * 0.26) : Math.min(190, w * 0.32));
      setCenterOffset({ x: 0, y: isMobile ? 48 : 0 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulseEffect = {};
        relatedItems.forEach((relId) => (newPulseEffect[relId] = true));
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  // Pause rotation when the section is off-screen to avoid constant re-renders.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!autoRotate || !visible) return;
    const rotationTimer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(rotationTimer);
  }, [autoRotate, visible]);

  const centerViewOnNode = (nodeId) => {
    if (!nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    // Offset is applied once via the orbit wrapper transform, so node positions
    // stay concentric with the centre orb (no double offset).
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)),
    );
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId) => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId) => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return "text-white bg-slate-900 border-slate-900";
      case "in-progress":
        return "text-slate-700 bg-slate-100 border-slate-300";
      case "pending":
        return "text-slate-500 bg-slate-100 border-slate-300";
      default:
        return "text-slate-500 bg-slate-100 border-slate-300";
    }
  };

  return (
    <div
      className="relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f7faf8] px-4"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {(title || subtitle) && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-50 -translate-x-1/2 px-4 text-center md:top-16">
          {subtitle && (
            <p className="font-hand mb-1 text-3xl text-slate-400">{subtitle}</p>
          )}
          {title && (
            <h2 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
              {title}
            </h2>
          )}
        </div>
      )}

      <div className="relative flex h-full w-full max-w-4xl items-center justify-center">
        <div
          className="absolute flex h-full w-full items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          <div className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 animate-pulse">
            <div className="absolute h-20 w-20 animate-ping rounded-full border border-emerald-400/40 opacity-70"></div>
            <div
              className="absolute h-24 w-24 animate-ping rounded-full border border-emerald-400/20 opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-md"></div>
          </div>

          <div
            className="absolute rounded-full border border-slate-300/70"
            style={{ width: radius * 2, height: radius * 2 }}
          ></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute cursor-pointer transition-all duration-700"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute -inset-1 rounded-full ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(100,116,139,0.22) 0%, rgba(100,116,139,0) 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isExpanded
                      ? "scale-150 border-slate-900 bg-slate-900 text-white"
                      : isRelated
                        ? "animate-pulse border-slate-400 bg-slate-200 text-slate-700"
                        : "border-slate-300 bg-white text-slate-600"
                  }`}
                >
                  <Icon size={16} />
                </div>

                <div
                  className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${
                    isExpanded ? "scale-110 text-slate-900" : "text-slate-500"
                  }`}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute left-1/2 top-16 w-44 -translate-x-1/2 overflow-visible border-slate-200 bg-white text-slate-700 shadow-xl shadow-slate-900/10 sm:top-20 sm:w-64">
                    <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-slate-300"></div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={`px-2 text-xs ${getStatusStyles(item.status)}`}
                        >
                          {item.dateLabel || item.date}
                        </Badge>
                        <span className="font-mono text-xs text-slate-400">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="mt-2 text-sm text-slate-900">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-600">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="mb-3 h-28 w-full rounded-lg object-contain sm:h-36"
                        />
                      )}
                      <p className="leading-relaxed">{item.content}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
