"use client";
import dynamic from "next/dynamic";

const CyberMap = dynamic(() => import("./cyber-map").then(mod => mod.CyberMap), { ssr: false });

export default function CyberMapClient(props: any) {
  return <CyberMap {...props} />;
}
