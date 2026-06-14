"use client";

import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion built on Radix. Reliable click-to-open with a smooth CSS
 * height animation — no scroll pinning (which misbehaved on the dynamic
 * homepage). First item opens by default.
 */
export default function ScrollFAQAccordion({
  data = [],
  title,
  subtitle,
  className,
  questionClassName,
  answerClassName,
}) {
  const [openItem, setOpenItem] = React.useState(
    data[0] ? data[0].id.toString() : null
  );

  return (
    <div className={cn("mx-auto max-w-3xl px-6 py-20 text-center", className)}>
      {subtitle && (
        <p className="font-hand mb-1 text-3xl text-emerald-600">{subtitle}</p>
      )}
      <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>

      <Accordion.Root
        type="single"
        collapsible
        value={openItem || ""}
        onValueChange={setOpenItem}
        className="mt-10 text-left"
      >
        {data.map((item) => {
          const isOpen = openItem === item.id.toString();
          return (
            <Accordion.Item value={item.id.toString()} key={item.id} className="mb-5">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between gap-x-4">
                  <div
                    className={cn(
                      "rounded-xl p-3 text-left transition-colors",
                      isOpen
                        ? "bg-emerald-500/15 text-emerald-700"
                        : "bg-slate-100 text-slate-800",
                      questionClassName
                    )}
                  >
                    <span className="font-medium">{item.question}</span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-slate-500",
                      isOpen && "text-emerald-600"
                    )}
                  >
                    {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content asChild forceMount>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-500 ease-out",
                    isOpen
                      ? "mt-4 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="ml-7 flex justify-end md:ml-16">
                      <div
                        className={cn(
                          "max-w-md rounded-2xl bg-emerald-600 px-4 py-2 text-base text-white",
                          answerClassName
                        )}
                      >
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </div>
  );
}
