type Props = {
  filename: string;
  tone?: "dark" | "light";
  label?: string;
};

export function MissingAssetPlaceholder({ filename, tone = "dark", label }: Props) {
  return (
    <div className={`asset-placeholder ${tone === "light" ? "light-placeholder" : ""}`}>
      <span>
        {label || "Approved asset pending"}
        {process.env.NODE_ENV === "development" ? `: ${filename}` : ""}
      </span>
    </div>
  );
}
