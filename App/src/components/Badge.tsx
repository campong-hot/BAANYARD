type Props = {
  kind?: "simulated" | "demo" | "estimate";
  label: string;
};

export function Badge({ kind = "simulated", label }: Props) {
  const className =
    kind === "estimate" ? "chip chip-sage" : kind === "demo" ? "chip" : "chip";
  return <span className={className}>{label}</span>;
}
