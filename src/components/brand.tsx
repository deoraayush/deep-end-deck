import logoAsset from "@/assets/logo.png.asset.json";
import penguinAsset from "@/assets/penguin.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Deep End Club"
      className={className}
      draggable={false}
    />
  );
}

export function Penguin({
  className = "",
  variant = "navy",
}: {
  className?: string;
  variant?: "navy" | "white";
}) {
  return (
    <img
      src={penguinAsset.url}
      alt=""
      aria-hidden
      draggable={false}
      className={className}
      style={
        variant === "white"
          ? { filter: "brightness(0) invert(1)" }
          : undefined
      }
    />
  );
}
