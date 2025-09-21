interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function Chip({ children, active = false, onClick }: ChipProps) {
  return (
    <button className={active ? 'chip-active' : 'chip'} onClick={onClick}>
      {children}
    </button>
  );
}