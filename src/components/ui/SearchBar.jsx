export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <label className="flex min-w-44 flex-1 items-center gap-2 border-b-2 border-ink px-0.5 py-1.5 focus-within:border-gold">
      <i className="fa-solid fa-magnifying-glass text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
      />
    </label>
  );
}
