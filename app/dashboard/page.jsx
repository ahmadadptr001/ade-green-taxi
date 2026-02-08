'use client';
export default function DashboardPage() {
  const user = localStorage.getItem('user');
  const userParser = JSON.parse(user);
  if (!user) {
    return (
      <div className="w-full h-full grid place-items-center">
        <p className="text-slate-500">Tidak menemukan data user apapun</p>
      </div>
    );
  }
  console.log(userParser)

  return (
    <main className="p-4 w-full h-full z-30">
      <h1 className="text-2xl font-bold">Ringkasan Dashboard</h1>
      <p>Selamat datang kembali, {userParser?.fullname}</p>
    </main>
  );
}
