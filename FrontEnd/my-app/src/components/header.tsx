type HeaderProps = {
  onLogout: () => void;
};

export default function Header({ onLogout }: HeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem("token");

    onLogout();
  };

  return (
    <header className="app-header">
      <h1>User Management</h1>

      <button className="btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
