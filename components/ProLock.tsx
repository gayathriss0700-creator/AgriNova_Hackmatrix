"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function ProLock({ children, featureName }: { children: React.ReactNode, featureName: string }) {
  // DEV/PRESENTATION OVERRIDE: Pro check is bypassed so features can be shown during the presentation
  return <>{children}</>;
}
