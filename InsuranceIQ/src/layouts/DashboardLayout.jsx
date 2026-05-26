function DashboardLayout({ title, children }) {
  return (
    <div>
      <nav
        style={{
          padding: "20px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <h2>InsuranceIQ</h2>
      </nav>

      <main
        style={{
          padding: "20px",
        }}
      >
        <h1>{title}</h1>

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;