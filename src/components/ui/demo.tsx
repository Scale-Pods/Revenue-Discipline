import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function DemoOne() {
  return (
    <> 
      <div className="relative h-[200px] w-[800px] bg-slate-900 rounded-xl flex items-center justify-center"> 
        <LiquidButton className="z-10 text-white border border-white/20">
          Liquid Glass
        </LiquidButton> 
      </div>
    </>
  )
}
