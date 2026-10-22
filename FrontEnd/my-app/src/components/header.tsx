type HeaderProps = {
  onLogout: () => void | Promise<void>;
};

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <h1>User Management</h1>

      <button className="btn" onClick={() => void onLogout()}>
        Logout
      </button>
    </header>
  );
}