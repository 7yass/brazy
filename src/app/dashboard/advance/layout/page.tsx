"use client";
import { LayoutTemplate } from "lucide-react";
const F = "Satoshi, sans-serif";
export default function AdvanceLayoutPage() {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:28,fontFamily:F }}>
      <div>
        <h1 style={{ fontSize:22,fontWeight:700,color:"#fafafa",margin:0 }}>Advance — Layout Settings</h1>
        <p style={{ fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:4 }}>Control profile width, content alignment, and card style</p>
      </div>
      <div style={{ borderRadius:18,border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)",padding:40,display:"flex",flexDirection:"column",alignItems:"center",gap:14 }}>
        <div style={{ width:52,height:52,borderRadius:14,background:"rgba(99,102,241,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <LayoutTemplate style={{ width:24,height:24,color:"#818cf8" }} />
        </div>
        <p style={{ fontSize:15,fontWeight:600,color:"#fafafa",margin:0 }}>Layout Settings</p>
        <p style={{ fontSize:13,color:"rgba(255,255,255,0.35)",margin:0,textAlign:"center",maxWidth:340 }}>Advanced layout controls are available in Customize under the ✦ Advanced section.</p>
        <a href="/dashboard/customize" style={{ marginTop:6,padding:"10px 22px",borderRadius:12,background:"#9849ac",color:"#fff",fontSize:14,fontWeight:600,textDecoration:"none" }}>Open Customize</a>
      </div>
    </div>
  );
}
