"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, CheckCircle2, AlertCircle, ShoppingCart, Search, FileWarning } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { addItem } from "@/redux/features/cart/cartSlice";
import { medicineService } from "@/services/medicine.service";
import { MedicineWithRelations } from "@/types/medicine.type";
import { toast } from "sonner";
import Tesseract from "tesseract.js";

interface PrescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PrescriptionModal({ isOpen, onClose }: PrescriptionModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "scanning" | "results" | "error">("idle");
    const [detectedMedicines, setDetectedMedicines] = useState<{ name: string; found: MedicineWithRelations | null }[]>([]);
    const [ocrPercent, setOcrPercent] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setStatus("idle");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus("uploading");

        await new Promise(resolve => setTimeout(resolve, 800));

        setStatus("scanning");
        setOcrPercent(0);

        try {
            const result = await Tesseract.recognize(
                file,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setOcrPercent(Math.floor(m.progress * 100));
                        }
                    }
                }
            );

            const extractedText = result.data.text;
            console.log("OCR Extracted Text:", extractedText);

            const words = extractedText
                .split(/[\s,.\n]+/)
                .map(word => word.replace(/[^a-zA-Z]/g, ''))
                .filter(word => word.length > 3);
            const uniqueWords = Array.from(new Set(words));

            if (uniqueWords.length === 0) {
                setStatus("error");
                return;
            }

            const matches: { name: string; found: MedicineWithRelations | null }[] = [];

            for (const word of uniqueWords.slice(0, 15)) {
                try {
                    const searchRes = await medicineService.getMedicines({ search: word, limit: "1" });
                    if (searchRes.data?.items && searchRes.data.items.length > 0) {
                        const foundMed = searchRes.data.items[0];
                        if (foundMed.name.toLowerCase().includes(word.toLowerCase()) ||
                            word.toLowerCase().includes(foundMed.name.toLowerCase())) {
                            matches.push({ name: foundMed.name, found: foundMed });
                        }
                    }
                } catch (err) {
                    console.error(`Error verifying word "${word}":`, err);
                }
            }

            if (matches.length === 0) {
                setStatus("error");
            } else {
                const uniqueMatches = Array.from(new Map(matches.map(m => [m.found?.id, m])).values());
                setDetectedMedicines(uniqueMatches);
                setStatus("results");
                toast.success("Prescription scanned successfully!");
            }

        } catch (err) {
            console.error("OCR Error:", err);
            toast.error("Failed to process the image. Please try again.");
            setStatus("idle");
        }
    };

    const handleAddToCart = (medicine: MedicineWithRelations) => {
        dispatch(addItem(medicine));
        toast.success(`${medicine.name} added to cart!`);
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setStatus("idle");
        setDetectedMedicines([]);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && reset()}>
            <DialogContent className="sm:max-w-[600px] rounded-3xl overflow-hidden border-none p-0 bg-card">
                <div className="bg-emerald-600 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Upload Prescription</DialogTitle>
                        <DialogDescription className="text-emerald-100 italic">
                            Upload your prescription and we'll find the medicines for you.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {status === "idle" && (
                        <div
                            className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-3xl p-12 bg-emerald-50/30 hover:bg-emerald-50 transition-all cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {preview ? (
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-emerald-200">
                                    <img src={preview} alt="Prescription preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <Upload className="w-5 h-5" /> Change Image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <p className="text-lg font-semibold text-emerald-900">Click to upload or drag & drop</p>
                                    <p className="text-sm text-emerald-600/70 mt-1">Supports JPG, PNG (Max 5MB)</p>
                                </>
                            )}
                        </div>
                    )}

                    {(status === "uploading" || status === "scanning") && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Search className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-emerald-900 mt-6">
                                {status === "uploading" ? "Uploading Prescription..." : "Analyzing Medicines..."}
                            </h3>
                            <p className="text-muted-foreground mt-2 text-center max-w-xs">
                                {status === "uploading"
                                    ? "Securely transferring your document to our pharmacy experts."
                                    : "We are using AI to identify the medicines listed in your prescription."}
                            </p>

                            {status === "scanning" && (
                                <div className="mt-8 w-full max-w-xs space-y-2">
                                    <div className="flex justify-between text-xs font-semibold text-emerald-700">
                                        <span>Recognizing Text...</span>
                                        <span>{ocrPercent}%</span>
                                    </div>
                                    <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-emerald-600 h-full transition-all duration-300 ease-out"
                                            style={{ width: `${ocrPercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                                <FileWarning className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No Medicines Detected</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                                We couldn't find any medicine names in the uploaded image. Please ensure the prescription is clear and readable.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-8 border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                                onClick={() => setStatus("idle")}
                            >
                                Try Another Image
                            </Button>
                        </div>
                    )}

                    {status === "results" && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>We found {detectedMedicines.length} medicines in your prescription</span>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                {detectedMedicines.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-white shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.found ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                {item.found ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-emerald-900">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.found ? `Available: $${item.found.price}` : "Not found in our store"}
                                                </p>
                                            </div>
                                        </div>
                                        {item.found && (
                                            <Button
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2"
                                                onClick={() => item.found && handleAddToCart(item.found)}
                                            >
                                                <ShoppingCart className="w-4 h-4" /> Add
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="bg-slate-50 p-6 flex items-center justify-between sm:justify-between border-t border-slate-100">
                    <Button variant="ghost" className="text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-xl px-6" onClick={reset}>
                        Cancel
                    </Button>
                    {status === "idle" ? (
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8 shadow-lg shadow-emerald-200"
                            disabled={!file}
                            onClick={handleUpload}
                        >
                            Process Now
                        </Button>
                    ) : status === "results" || status === "error" ? (
                        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8 shadow-lg shadow-emerald-200" onClick={reset}>
                            Done
                        </Button>
                    ) : null}
                </DialogFooter>
            </DialogContent>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
            `}</style>
        </Dialog>
    );
}
