"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { ProductCard } from "@/components/ProductCard";
import { AgentStepper } from "@/components/chat/AgentStepper";
import { OldTicket } from "@/components/chat/OldTicket";
import { ChatSituationBar } from "@/components/chat/ChatSituationBar";
import { MobilityModePicker } from "@/components/chat/MobilityModePicker";
import { DestinationPicker } from "@/components/chat/DestinationPicker";
import { RouteRibbon } from "@/components/chat/RouteRibbon";
import {
  parseRebookDestination,
  type RebookDestinationCode,
} from "@/lib/flights/rebook-destination";
import { TrackLegend } from "@/components/chat/TrackLegend";
import {
  MOBILITY_MODES,
  mobilityModesQuery,
  type MobilityMode,
} from "@/lib/flights/mobility-modes";
import { ConsentBanner } from "@/components/chat/ConsentBanner";
import { PaymentReceipt } from "@/components/chat/PaymentReceipt";
import type { AssistantUiStep, Product } from "@/lib/types";

type FareTrackView = {
  id: string;
  label: string;
  tagline: string;
  product: Product;
};

type Phase = "pick" | "consent" | "checkout" | "done";

export function Chat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [offers, setOffers] = useState<Product[]>([]);
  const [tracks, setTracks] = useState<FareTrackView[]>([]);
  const [alsoConsider, setAlsoConsider] = useState<Product[]>([]);
  const [mobilityModes, setMobilityModes] = useState<MobilityMode[]>([
    ...MOBILITY_MODES,
  ]);
  const [destination, setDestination] = useState<RebookDestinationCode>("MCI");
  const [optionsReady, setOptionsReady] = useState(false);
  const [fareSource, setFareSource] = useState<
    "mock-ota" | "mixed-rebook" | "ground-research" | "duffel" | "amadeus" | "catalog" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [heldProduct, setHeldProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [receipt, setReceipt] = useState<{ orderId: string; status: string } | null>(
    null
  );

  const phase: Phase = useMemo(() => {
    if (receipt) return "done";
    if (checkoutProduct) return "checkout";
    if (heldProduct) return "consent";
    return "pick";
  }, [receipt, checkoutProduct, heldProduct]);

  const stepperStep: AssistantUiStep = phase === "done" ? "done" : phase;
  const consentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heldProduct && phase === "consent") {
      consentRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [heldProduct, phase]);

  const loadOptions = useCallback(
    async (modes: MobilityMode[], dest: RebookDestinationCode) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          origin: "DFW",
          destination: dest,
          modes: mobilityModesQuery(modes),
        });
        params.set("createSession", sessionId ? "false" : "true");
        if (sessionId) params.set("sessionId", sessionId);
        const res = await fetch(`/api/ota/v1/search?${params.toString()}`);
        if (!res.ok) throw new Error("Could not load fares");
        const data = (await res.json()) as {
          sessionId?: string;
          products: Product[];
          tracks?: FareTrackView[];
          alsoConsider?: Product[];
          fareSource?:
            | "mock-ota"
            | "mixed-rebook"
            | "ground-research"
            | "duffel"
            | "amadeus"
            | "catalog";
          demoMode?: boolean;
          count?: number;
        };
        if (data.count === 0) {
          setError(
            dest === "OMA"
              ? "No Omaha flights — try ✈︎ only or rebook the KC stop (MCI)."
              : "No matches — add ✈︎ or bus."
          );
          setOptionsReady(false);
          return;
        }
        if (data.sessionId) setSessionId(data.sessionId);
        setTracks(data.tracks ?? []);
        setAlsoConsider(data.alsoConsider ?? []);
        setOffers(data.products);
        if (data.fareSource) setFareSource(data.fareSource);
        if (data.demoMode != null) setDemoMode(data.demoMode);
        setOptionsReady(true);
        setSelectedSku(null);
        setHeldProduct(null);
      } catch {
        setError("Couldn’t load fares — try again.");
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  const onApplyMobilityModes = useCallback(() => {
    const modesForSearch: MobilityMode[] =
      destination === "OMA" ? ["flight"] : mobilityModes;
    void loadOptions(modesForSearch, destination);
  }, [loadOptions, mobilityModes, destination]);

  const onDestinationChange = useCallback(
    (dest: RebookDestinationCode) => {
      setDestination(dest);
      setOptionsReady(false);
      setTracks([]);
      setAlsoConsider([]);
      setOffers([]);
      if (dest === "OMA" && mobilityModes.some((m) => m !== "flight")) {
        setMobilityModes(["flight"]);
      }
    },
    [mobilityModes]
  );

  const onSelectFare = useCallback(
    async (sku: string) => {
      if (loading) return;
      if (!sessionId) {
        setError("Tap Show 3 picks first — then choose a fare.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/demo/select", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, sku }),
        });
        const data = (await res.json()) as {
          selectedProduct?: Product;
          selectedSku?: string;
          demoMode?: boolean;
          reply?: string;
          error?: string;
        };
        if (!res.ok) {
          throw new Error(data.error ?? "Select failed");
        }
        if (data.demoMode != null) setDemoMode(data.demoMode);
        if (data.selectedSku) setSelectedSku(data.selectedSku);
        if (data.selectedProduct) {
          setHeldProduct(data.selectedProduct);
        } else {
          setError(data.reply ?? "Couldn’t hold that fare — search again.");
        }
      } catch {
        setError("Couldn’t hold that fare — try again.");
      } finally {
        setLoading(false);
      }
    },
    [sessionId, loading]
  );

  const onConfirmPay = useCallback(async () => {
    if (!sessionId || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/demo/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error("Confirm failed");
      const data = (await res.json()) as {
        awaitingPayment?: boolean;
        selectedProduct?: Product;
        demoMode?: boolean;
      };
      if (data.demoMode != null) setDemoMode(data.demoMode);
      if (data.awaitingPayment && data.selectedProduct) {
        setHeldProduct(null);
        setCheckoutProduct(data.selectedProduct);
      }
    } catch {
      setError("Couldn’t start checkout — try again.");
    } finally {
      setLoading(false);
    }
  }, [sessionId, loading]);

  return (
    <div className="flex flex-col gap-3 min-h-[60vh]">
      <ChatSituationBar />
      <RouteRibbon destination={destination} />
      <AgentStepper active={stepperStep} />
      {fareSource ? (
        <div className="h-1 rounded-full bg-black/5 overflow-hidden" aria-hidden>
          <div
            className={`h-full w-1/3 rounded-full ${
              fareSource === "mixed-rebook" ? "bg-paypal-blue" : "bg-ink/30"
            }`}
          />
        </div>
      ) : null}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        {loading && optionsReady ? (
          <div className="flex justify-center" aria-label="Loading options">
            <span className="block h-8 w-8 animate-spin rounded-full border-2 border-paypal-blue/30 border-t-paypal-blue" />
          </div>
        ) : null}

        {phase === "pick" || phase === "consent" ? (
          <div className="flex flex-col gap-3 max-w-lg mx-auto w-full">
            <OldTicket />
            <DestinationPicker
              value={destination}
              onChange={onDestinationChange}
              disabled={phase === "consent"}
            />
            {destination === "OMA" ? (
              <p className="text-[10px] text-center text-ink/50">
                Fly home to Omaha — skips the KC stop (flights only in this demo).
              </p>
            ) : (
              <p className="text-[10px] text-center text-ink/50">
                Rebook the KC leg first — Thanksgiving stop, then on to Omaha.
              </p>
            )}
            <MobilityModePicker
              selected={mobilityModes}
              onChange={setMobilityModes}
              onSubmit={onApplyMobilityModes}
              loading={loading}
              disabled={phase === "consent"}
              flightsOnly={destination === "OMA"}
            />
            {optionsReady ? (
              <>
                <TrackLegend />
                {(tracks.length > 0
                  ? tracks.map((track) => ({ product: track.product, track }))
                  : offers.map((product) => ({
                      product,
                      track: undefined as FareTrackView | undefined,
                    }))
                ).map(({ product: p, track }, j) => (
                  <ProductCard
                    key={p.sku}
                    product={p}
                    index={j}
                    selected={p.sku === selectedSku}
                    onSelect={onSelectFare}
                    trackLabel={track?.label}
                  />
                ))}
                {alsoConsider.length > 0 ? (
                  <div className="pt-1 space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-ink/45 text-center">
                      More options · swipe
                    </p>
                    <div
                      className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory"
                      aria-label="Additional trips you can still book"
                    >
                      {alsoConsider.map((p, j) => (
                        <ProductCard
                          key={p.sku}
                          product={p}
                          index={j + 3}
                          selected={p.sku === selectedSku}
                          onSelect={onSelectFare}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
                <button
                  type="button"
                  aria-label="Change transport modes"
                  className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink/50 hover:border-paypal-blue hover:text-paypal-blue"
                  onClick={() => {
                    setOptionsReady(false);
                    setTracks([]);
                    setAlsoConsider([]);
                    setOffers([]);
                  }}
                >
                  ↺
                </button>
                {phase === "consent" && heldProduct ? (
                  <div ref={consentRef} className="pt-2">
                    <ConsentBanner
                      disabled={loading}
                      onConfirm={() => void onConfirmPay()}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex justify-center gap-2 py-2 opacity-40" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="h-2 w-2 rounded-full bg-paypal-navy" />
              </div>
            )}
          </div>
        ) : null}

        {heldProduct && phase === "consent" && !optionsReady ? (
          <p className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-sm font-bold text-ink">
              <span className="text-success">✓</span>${heldProduct.priceUsd.toFixed(0)}
            </span>
          </p>
        ) : null}

        {phase === "consent" && !optionsReady ? (
          <ConsentBanner disabled={loading} onConfirm={() => void onConfirmPay()} />
        ) : null}

        {checkoutProduct && phase === "checkout" ? (
          <PayPalCheckout
            product={checkoutProduct}
            sessionId={sessionId}
            demoMode={demoMode}
            onSuccess={(orderId, status) => {
              setCheckoutProduct(null);
              setReceipt({ orderId, status });
            }}
            onError={(msg) => setError(msg)}
          />
        ) : null}

        {receipt ? (
          <PaymentReceipt orderId={receipt.orderId} status={receipt.status} />
        ) : null}
      </div>
    </div>
  );
}

