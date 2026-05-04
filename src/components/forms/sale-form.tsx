"use client";
import { useActionState, useState, useMemo, useEffect } from "react";
import { SaleAction } from "@/lib/action/sale";

export const CLASS = [
  "X-1",
  "X-2",
  "X-3",
  "X-4",
  "X-5",
  "X-6",
  "X-7",
  "X-8",
  "X-9",
  "X-10",
];

interface Props {
  students: {
    id: string;
    name: string;
    class: string | null;
  }[];
  products: {
    id: string;
    name: string;
    price: number;
  }[];
}

const initState = {
  success: false,
  errorMsg: null,
};

export default function SaleForm({ students, products }: Props) {
  const [state, action, isPending] = useActionState(SaleAction, initState);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState("")
  const [paidAmount, setPaidAmount] = useState(0)
  const [isEditPaid, setIsEditPaid] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const filteredStudents = useMemo(() => {
    if (!selectedClass) return students;
    const filtered = students.filter((student) => student.class === selectedClass);
    console.log([selectedClass])
    return filtered
  }, [students, selectedClass]);

  useEffect(() => {
   if (!selectedProductId) {
    setSelectedPrice(null)
    setPaidAmount(0)
    return;
   }

   const product = products.find(p => p.id === selectedProductId)

   setSelectedPrice(product!.price)
   if (!isEditPaid) {
    setPaidAmount(product!.price)
   }
  }, [selectedProductId])

  useEffect(() => {
    if (state.success) {
      setFormKey((k) => k + 1)
      setSelectedClass("")
      setSelectedProductId("")
      setSelectedPrice(null)
      setPaidAmount(0)
      setIsEditPaid(false)
    }
  }, [state.success])


  return (
    <>
      <form key={formKey} action={action} className="p-3 flex flex-col gap-4">
        <h1 className="text-2xl md:text-4xl text-center text-sky-600">Form Pengambilan Paket</h1>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="class" className="font-semibold text-lg">
            Pilih Kelas:
          </label>
          <select
            id="class"
            name="class"
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-2.5 rounded-md border border-gray-500 text-sm dark:text-neutral-500"
          >
            <option value={""}>pilih kelas</option>
            {CLASS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="student" className="font-semibold texl-lg">
            Pilih Murid
          </label>
          <select
            id="student"
            name="student"
            className="p-2.5 rounded-md border border-gray-500 text-sm dark:text-neutral-500"
          >
            <option value={""}>pilih murid</option>
            {filteredStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="product" className="font-semibold text-lg">
            Pilih Paket:
          </label>
          <select
            id="product"
            name="product"
            className="p-2.5 rounded-md border border-gray-500 text-sm dark:text-neutral-500"
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">pilih paket</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-lg">Harga</label>
          <input
            value={
              selectedPrice ? `Rp ${selectedPrice.toLocaleString("id-ID")}` : ""
            }
            placeholder="pilih paket dahulu"
            onChange={(e) => setSelectedPrice(+e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="paid" className="font-semibold text-lg">
            Bayar
          </label>
          <input type="number" min={0} value={paidAmount} onChange={(e) => {
            setIsEditPaid(true)
            setPaidAmount(Number(e.target.value))
          }} id="paid" name="paid" className="p-2.5 rounded-md border border-gray-500 dark:text-neutral-100" />
        </div>
        <div className="flex justify-center">
          <button
            disabled={isPending}
            className="bg-blue-500 disabled:bg-gray-500 py-2 px-4 text-neutral-100 rounded-md font-semibold text-lg"
          >
            {isPending ? "Processing..." : "Simpan"}
          </button>
        </div>
      </form>
      {state.errorMsg && (
        <span className="text-sm font-light text-red-500 text-center">
          {state.errorMsg}
        </span>
      )}
    </>
  );
}
