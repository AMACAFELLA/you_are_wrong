"use client";
const Spinner = ({ color, size }: { color?: string; size?: string }) => {
  const colorX = `${!color && "text-primary-500"} `;
  return (
    <div
      className={`animate-spin inline-block ${
        size ? `w-[18px] h-[18px] mx-0 py-0 pt-2` : "w-8 h-8 mx-2"
      } border-[3px] border-current border-t-transparent rounded-full ${colorX}`}
      role="status"
      aria-label="loading"
      style={{
        color: color,
        marginBottom: size ? "-3px" : undefined,
      }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
