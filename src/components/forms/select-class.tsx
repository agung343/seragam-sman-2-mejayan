'use client'

const CLASS = [
    "X-1", "X-2", "X-3", "X-4", "X-5", "X-6", "X-7", "X-8", "X-9", "X-10"
]

interface Props {
    students: {
        id: string
        name: string
    }[]
}

export function SelectStudent({students}: Props) {
    return (<>
        <div className="flex flex-col gap-1.5">
            <label htmlFor="class">Pilih Kelas:</label>
            <select id="class" name="class">
                <option value={""}>pilih kelas</option>
                {CLASS.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
        </div>
        <div className="flex flex-col gap-1.5">
            <label htmlFor="student">Pilih Murid</label>
            <select id="student" name="student">
                <option value={""}>pilih murid</option>
                {students.map(s => (
                    <option key={s.id}>{s.name}</option>
                ))}
            </select>
        </div>
    </>)
}