import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, ShieldCheck, MessageCircle, CreditCard } from 'lucide-react';

export default function Homepage() {
    return (
        <main className="px-4 min-h-screen bg-linear-to-br from-emerald-100 via-white to-emerald-50">
            <section className="px-6 py-24 text-center max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-emerald-700 mb-4">Your Trusted Online Pharmacy</h1>
                <p className="text-gray-600 max-w-xl mx-auto mb-8">
                    Order genuine medicines, upload prescriptions, and get fast delivery to your door.
                </p>
                <div className="flex justify-center gap-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
                    <Button variant="outline" className="border-emerald-600 text-emerald-600">Upload Prescription</Button>
                </div>
            </section>

            <section className="px-6 py-20 bg-white">
                <h2 className="text-3xl font-semibold text-center text-emerald-700 mb-12">How MediStore Works</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {['Search or Upload', 'Verify & Pack', 'Fast Delivery'].map((t, i) => (
                        <Card key={i} className="rounded-2xl shadow-md">
                            <CardContent className="p-6 text-center">
                                <h3 className="font-semibold text-lg mb-2">{t}</h3>
                                <p className="text-gray-500 text-sm">Simple, secure and quick process.</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="px-6 py-20">
                <h2 className="text-3xl font-semibold text-center text-emerald-700 mb-12">Why Choose MediStore</h2>
                <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {[ShieldCheck, Truck, CreditCard, MessageCircle].map((Icon, i) => (
                        <Card key={i} className="rounded-2xl shadow-sm">
                            <CardContent className="p-6 text-center">
                                <Icon className="mx-auto text-emerald-600 mb-3" />
                                <p className="text-sm text-gray-600">Trusted Feature</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>


            <section className="px-6 py-24 bg-emerald-700 text-white text-center">
                <h2 className="text-4xl font-bold mb-4">Your health shouldn’t wait</h2>
                <p className="mb-8">Join MediStore today and get medicines delivered fast.</p>
                <Button className="bg-white text-emerald-700 hover:bg-emerald-100">Sign Up Free</Button>
            </section>
        </main>
    );
}
