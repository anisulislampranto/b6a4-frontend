import MedicineDetailsClient from "@/components/modules/shopPage/MedicineDetailsClient";

interface MedicineDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MedicineDetailsPage({ params }: MedicineDetailsPageProps) {
    const { id } = await params;

    return <MedicineDetailsClient medicineId={id} />;
}
