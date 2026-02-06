import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "lucide-react";

const products = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Medicine ${i + 1}`,
    price: 12 + i,
    category: "Health",
}));

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-emerald-700">Shop Medicines</h1>
                    <Input placeholder="Search medicines..." className="max-w-sm" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <Card key={p.id} className="rounded-2xl shadow hover:shadow-lg transition">
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="h-32 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                                    IMG
                                </div>
                                <h3 className="font-semibold">{p.name}</h3>
                                <Badge className="w-fit bg-emerald-100 text-emerald-700">{p.category}</Badge>
                                <p className="text-lg font-bold text-emerald-700">${p.price}</p>
                                <Button className="bg-emerald-600 hover:bg-emerald-700">Add to Cart</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
