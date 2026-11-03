export default function Alert({ children }) {
  return (
    <p role="alert" className="mb-2.5 rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
      {children}
    </p>
  );
}
