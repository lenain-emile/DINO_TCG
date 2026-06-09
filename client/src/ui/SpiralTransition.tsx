type Props = {
  show: boolean;
};

export default function SpiralTransition({ show }: Props) {
  if (!show) return null;

  return (
    <div className="spiral-screen fixed inset-0 z-[10000]" aria-hidden>
      <div className="spiral" />
      <div className="spiral-fade" />
    </div>
  );
}
