"use client";

import { useOptimistic, useState, useRef } from "react";

// --- STEP 1: Simulasi Fungsi Simpan ke Database (Server Action) ---
async function simpanKeDatabase(formData: FormData) {
  const tugasBaru = formData.get("tugas") as string;

  // Kita sengaja bikin loading 2 detik biar kelihatan "Optimistic"-nya
  await new Promise((res) => setTimeout(res, 2000));

  if (!tugasBaru) return { error: "Isi dulu tugasnya!" };

  return { success: true, data: tugasBaru };
}

// --- STEP 2: Komponen Utama ---
export default function TodoPage() {
  const formRef = useRef<HTMLFormElement>(null);

  // State asli (data yang beneran ada di database)
  const [listTugas, setListTugas] = useState<string[]>([
    "Belajar React",
    "Beli Kopi",
  ]);

  // useOptimistic: (DataAsli, FungsiUpdate)
  const [optimisticTugas, tambahOptimistic] = useOptimistic(
    listTugas,
    (state, tugasBaru: string) => [...state, tugasBaru], // Cara nambahin ke list sementara
  );

  async function handleAction(formData: FormData) {
    const teksTugas = formData.get("tugas") as string;

    // A. RESET INPUT LANGSUNG (Biar UX enak)
    formRef.current?.reset();

    // B. UPDATE OPTIMISTIC (Langsung muncul di layar!)
    tambahOptimistic(teksTugas);

    // C. PROSES KE SERVER (Sebenarnya)
    const result = await simpanKeDatabase(formData);

    // D. UPDATE STATE ASLI (Kalau server udah OK)
    if (result.success) {
      setListTugas((prev) => [...prev, result.data]);
    }
  }

  return (
    <div
      style={{ padding: "20px", maxWidth: "400px", fontFamily: "sans-serif" }}
    >
      <h2>Daftar Tugas Gue</h2>

      <form
        ref={formRef}
        action={handleAction}
        style={{ marginBottom: "20px" }}
      >
        <input
          name="tugas"
          placeholder="Tulis tugas baru..."
          style={{ padding: "8px", width: "70%" }}
        />
        <button type="submit" style={{ padding: "8px" }}>
          Tambah
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {optimisticTugas.map((tugas, index) => (
          <li
            key={index}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              // Kalau data masih "optimistic" (belum masuk setListTugas), kita kasih warna abu-abu
              color: listTugas.includes(tugas) ? "black" : "gray",
            }}
          >
            {tugas} {!listTugas.includes(tugas) && "(Sedang mengirim...)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
