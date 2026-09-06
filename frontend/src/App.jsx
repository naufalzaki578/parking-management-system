import { useEffect, useMemo, useState } from "react";
import {
  CarFront, CircleParking, DoorOpen, LayoutDashboard,
  LogOut, Menu, RefreshCw, Search, Settings2, Users
} from "lucide-react";
import api from "./api";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString("id-ID") : "-";
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("parking_token", data.token);
      localStorage.setItem("parking_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand-mark"><CircleParking size={30} /></div>
        <h1>Parking System</h1>
        <p>Masuk untuk mengelola area parkir.</p>

        {error && <div className="alert error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="admin@example.com"
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
        />

        <button className="primary full">Login</button>
        <small>Daftar melalui POST /api/auth/register untuk membuat akun pertama.</small>
      </form>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><Icon size={22} /></div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Dashboard({ stats, refresh }) {
  return (
    <section>
      <div className="page-head">
        <div>
          <h2>Dashboard</h2>
          <p>Ringkasan kondisi parkir hari ini.</p>
        </div>
        <button className="secondary" onClick={refresh}><RefreshCw size={17}/> Refresh</button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Slot" value={stats.totalSlots} icon={CircleParking} />
        <StatCard title="Tersedia" value={stats.availableSlots} icon={CircleParking} />
        <StatCard title="Terisi" value={stats.occupiedSlots} icon={CarFront} />
        <StatCard title="Sedang Parkir" value={stats.activeParking} icon={CarFront} />
        <StatCard title="Transaksi Hari Ini" value={stats.todayTransactions} icon={DoorOpen} />
        <StatCard title="Pendapatan Hari Ini" value={formatRupiah(stats.todayRevenue)} icon={Users} />
      </div>
    </section>
  );
}

function EntryForm({ slots, onDone }) {
  const [form, setForm] = useState({ vehicleNumber: "", vehicleType: "car", slotId: "" });
  const [message, setMessage] = useState("");

  const available = slots.filter(s => s.status === "available" && s.type === form.vehicleType);

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/parking/entry", form);
      setMessage("Kendaraan berhasil masuk.");
      setForm({ vehicleNumber: "", vehicleType: form.vehicleType, slotId: "" });
      onDone();
    } catch (err) {
      setMessage(err.response?.data?.message || "Gagal mencatat kendaraan.");
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h3>Catat Kendaraan Masuk</h3>
      {message && <div className="alert">{message}</div>}

      <label>Nomor Polisi</label>
      <input
        required
        value={form.vehicleNumber}
        onChange={e => setForm({ ...form, vehicleNumber: e.target.value })}
        placeholder="B 1234 XYZ"
      />

      <label>Jenis Kendaraan</label>
      <select
        value={form.vehicleType}
        onChange={e => setForm({ ...form, vehicleType: e.target.value, slotId: "" })}
      >
        <option value="car">Mobil</option>
        <option value="motorcycle">Motor</option>
      </select>

      <label>Slot</label>
      <select
        required
        value={form.slotId}
        onChange={e => setForm({ ...form, slotId: e.target.value })}
      >
        <option value="">Pilih slot</option>
        {available.map(slot => (
          <option key={slot._id} value={slot._id}>{slot.slotNumber}</option>
        ))}
      </select>

      <button className="primary">Simpan Kendaraan Masuk</button>
    </form>
  );
}

function ExitForm({ onDone }) {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setResult(null);
    setError("");
    try {
      const { data } = await api.post("/parking/exit", { vehicleNumber: plate });
      setResult(data);
      setPlate("");
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memproses kendaraan keluar.");
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h3>Catat Kendaraan Keluar</h3>
      {error && <div className="alert error">{error}</div>}
      {result && (
        <div className="receipt">
          <strong>Transaksi selesai</strong>
          <span>{result.vehicleNumber}</span>
          <span>Durasi: {result.durationMinutes} menit</span>
          <strong>{formatRupiah(result.amount)}</strong>
        </div>
      )}

      <label>Nomor Polisi</label>
      <input
        required
        value={plate}
        onChange={e => setPlate(e.target.value)}
        placeholder="B 1234 XYZ"
      />
      <button className="primary">Proses Kendaraan Keluar</button>
    </form>
  );
}

function Parking({ slots, refresh }) {
  return (
    <section>
      <div className="page-head">
        <div>
          <h2>Parking Operations</h2>
          <p>Kelola kendaraan masuk dan keluar.</p>
        </div>
      </div>

      <div className="two-col">
        <EntryForm slots={slots} onDone={refresh} />
        <ExitForm onDone={refresh} />
      </div>

      <div className="panel">
        <h3>Status Slot</h3>
        <div className="slot-grid">
          {slots.map(slot => (
            <div className={`slot ${slot.status}`} key={slot._id}>
              <CircleParking size={19}/>
              <strong>{slot.slotNumber}</strong>
              <span>{slot.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Transactions() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  async function load() {
    const { data } = await api.get("/parking/history", {
      params: { search }
    });
    setItems(data);
  }

  useEffect(() => { load(); }, []);

  return (
    <section>
      <div className="page-head">
        <div>
          <h2>Transaction History</h2>
          <p>Riwayat kendaraan dan pembayaran parkir.</p>
        </div>
      </div>

      <div className="toolbar">
        <Search size={18}/>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && load()}
          placeholder="Cari nomor polisi..."
        />
        <button className="secondary" onClick={load}>Cari</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nomor Polisi</th>
              <th>Jenis</th>
              <th>Slot</th>
              <th>Masuk</th>
              <th>Keluar</th>
              <th>Status</th>
              <th>Biaya</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td><strong>{item.vehicleNumber}</strong></td>
                <td>{item.vehicleType}</td>
                <td>{item.slot?.slotNumber || "-"}</td>
                <td>{formatDate(item.entryTime)}</td>
                <td>{formatDate(item.exitTime)}</td>
                <td><span className={`badge ${item.status}`}>{item.status}</span></td>
                <td>{formatRupiah(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Slots({ slots, refresh, user }) {
  const [form, setForm] = useState({ slotNumber: "", type: "car" });
  const [error, setError] = useState("");

  async function addSlot(e) {
    e.preventDefault();
    try {
      await api.post("/slots", form);
      setForm({ slotNumber: "", type: "car" });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambah slot.");
    }
  }

  async function maintenance(slot) {
    const next = slot.status === "maintenance" ? "available" : "maintenance";
    try {
      await api.put(`/slots/${slot._id}`, { status: next });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah status.");
    }
  }

  return (
    <section>
      <div className="page-head">
        <div>
          <h2>Parking Slots</h2>
          <p>Pengelolaan kapasitas dan status slot.</p>
        </div>
      </div>

      {user.role === "admin" && (
        <form className="toolbar add-slot" onSubmit={addSlot}>
          <input required placeholder="Contoh A21" value={form.slotNumber}
            onChange={e => setForm({...form, slotNumber: e.target.value})}/>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="car">Mobil</option>
            <option value="motorcycle">Motor</option>
          </select>
          <button className="primary">Tambah Slot</button>
        </form>
      )}

      {error && <div className="alert error">{error}</div>}

      <div className="slot-grid large">
        {slots.map(slot => (
          <div className={`slot ${slot.status}`} key={slot._id}>
            <CircleParking size={21}/>
            <strong>{slot.slotNumber}</strong>
            <span>{slot.type}</span>
            <span>{slot.status}</span>
            {user.role === "admin" && slot.status !== "occupied" &&
              <button className="mini" onClick={() => maintenance(slot)}>
                <Settings2 size={14}/>
              </button>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("parking_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState("dashboard");
  const [stats, setStats] = useState({
    totalSlots: 0, availableSlots: 0, occupiedSlots: 0,
    maintenanceSlots: 0, activeParking: 0, todayTransactions: 0, todayRevenue: 0
  });
  const [slots, setSlots] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  async function refresh() {
    const [statsRes, slotsRes] = await Promise.all([
      api.get("/dashboard/statistics"),
      api.get("/slots")
    ]);
    setStats(statsRes.data);
    setSlots(slotsRes.data);
  }

  useEffect(() => {
    if (user) refresh().catch(() => logout());
  }, [user]);

  function logout() {
    localStorage.removeItem("parking_token");
    localStorage.removeItem("parking_user");
    setUser(null);
  }

  if (!user) return <Login onLogin={setUser}/>;

  const nav = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["parking", "Parking Operations", CarFront],
    ["slots", "Parking Slots", CircleParking],
    ["transactions", "Transactions", DoorOpen]
  ];

  return (
    <div className="app">
      <aside className={mobileMenu ? "sidebar open" : "sidebar"}>
        <div className="logo"><CircleParking/> <span>Parkify</span></div>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button key={id} className={page === id ? "active" : ""}
              onClick={() => { setPage(id); setMobileMenu(false); }}>
              <Icon size={19}/>{label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-box"><Users size={18}/><div><strong>{user.name}</strong><small>{user.role}</small></div></div>
          <button onClick={logout}><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu/></button>
          <div>
            <strong>Parking Management</strong>
            <small>Smart parking administration</small>
          </div>
          <div className="top-user">{user.name}</div>
        </header>

        <div className="content">
          {page === "dashboard" && <Dashboard stats={stats} refresh={refresh}/>}
          {page === "parking" && <Parking slots={slots} refresh={refresh}/>}
          {page === "slots" && <Slots slots={slots} refresh={refresh} user={user}/>}
          {page === "transactions" && <Transactions/>}
        </div>
      </main>
    </div>
  );
}
