import MedicineDetailsClient from "@/components/modules/shopPage/MedicineDetailsClient";
import { MedicineWithRelations } from "@/types/medicine.type";

export const revalidate = 60;

// Pre-build pages (SSG)
export async function generateStaticParams() {
    const res = await fetch(`${process.env.API_URL}/medicines`);
    const data = await res.json();

    return data?.data?.items.map((m: MedicineWithRelations) => ({
        id: m.id.toString(),
    }));
}

async function getMedicine(id: string) {
    const res = await fetch(`${process.env.API_URL}/medicines/${id}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        return null;
    }

    return res.json();
}

export default async function MedicineDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const medicine = await getMedicine(params.id);

    return (
        <MedicineDetailsClient
            medicineId={params.id}
            initialMedicine={medicine?.data || null}
        />
    );
}