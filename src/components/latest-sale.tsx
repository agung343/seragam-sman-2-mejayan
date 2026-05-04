interface Props {
    sales: {
        id: string
        name: string
        product: string
        paid: number
        status:"BELUM DIBAYAR" | "CICILAN" | "LUNAS" 
    }[]
}

export default function LastestSale({sales}: Props) {
    return (
        <div className="max-h-80 md:max-h-150 mt-2.5 md:mt-5">
            <h2 className="text-xl md:text-2xl">Pembayaran Terakhir</h2>
            <table>
                <thead className="font-semibold">
                    <tr>
                        <th className="p-1 md:p-2.5 border dark:border-neutral-200">Nama</th>
                        <th className="p-1 md:p-2.5 border dark:border-neutral-200 text-center">Paket</th>
                        <th className="p-1 md:p-2.5 border dark:border-neutral-200 text-center">Bayar</th>
                        <th className="p-1 md:p-2.5 border dark:border-neutral-200 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(sale => (
                        <tr key={sale.id} className="font-light text-sm md:text-base odd:bg-sky-200 even:bg-sky-100">
                            <td className="p-1 md:p-2 border dark:text-neutral-800 dark:border-neutral-200 ">{sale.name}</td>
                            <td className="p-1 md:p-2 border dark:text-neutral-800 dark:border-neutral-200 ">{sale.product}</td>
                            <td className="p-1 md:p-2 border dark:text-neutral-800 dark:border-neutral-200 text-right">{sale.paid}</td>
                            <td className="p-1 md:p-2 border dark:text-neutral-800 dark:border-neutral-200 text-center">{sale.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}