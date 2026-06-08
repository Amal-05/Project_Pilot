// Pages Router 404 override — completely bypasses App Router root layout
// Prevents the /_error prerender crash caused by client-only modules in the App Router tree
export default function Custom404() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f9fafb",
      }}
    >
      <h1 style={{ fontSize: "6rem", fontWeight: 800, color: "#2563eb", margin: 0 }}>
        404
      </h1>
      <p style={{ fontSize: "1.25rem", color: "#6b7280", marginTop: "1rem" }}>
        Page not found
      </p>
      <a
        href="/"
        style={{
          marginTop: "2rem",
          padding: "0.75rem 2rem",
          backgroundColor: "#2563eb",
          color: "white",
          borderRadius: "0.5rem",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Go back home
      </a>
    </div>
  );
}
