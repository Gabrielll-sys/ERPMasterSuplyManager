"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";

// Next UI
import { 
    Autocomplete, 
    AutocompleteItem, 
    Button, 
    Slider,
    Card,
    CardBody,
    Chip
} from "@nextui-org/react";

// Lucide Icons
import { 
    ArrowLeft, 
    QrCode, 
    Printer, 
    Trash2, 
    Plus, 
    Search,
    Package,
    Sparkles,
    Layers
} from "lucide-react";

// Services
import { fetcher } from "@/app/lib/api";

// Types
type Material = {
    id: number;
    descricao?: string;
    marca?: string;
    codigoFabricante?: string;
    localizacao?: string;
};

type Inventario = {
    id: number;
    material: Material;
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { 
        opacity: 0, 
        scale: 0.8, 
        transition: { duration: 0.2 } 
    }
};

// QR Code Card Component
const QRCodeCard = ({ 
    item, 
    onRemove,
    size,
    onSizeChange
}: { 
    item: Inventario; 
    onRemove: () => void;
    size: number;
    onSizeChange: (size: number) => void;
}) => (
    <motion.div
        variants={itemVariants}
        layout
        className="group"
    >
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-visible">
            <CardBody className="p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3 flex items-center justify-between rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold text-sm">
                            ID: {item.material.id}
                        </span>
                    </div>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-white/70 hover:text-red-400 hover:bg-red-500/20"
                        onPress={onRemove}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* QR Code */}
                <div className="p-6 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-gray-100">
                        <QRCodeSVG
                            value={`https://mastererp.vercel.app/qrcode-to-material/${item.material.id}`}
                            size={size}
                            level="M"
                            marginSize={2}
                        />
                    </div>

                    {/* Material Info */}
                    <div className="mt-4 text-center w-full">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2 px-2">
                            {item.material.descricao || "Sem descrição"}
                        </p>
                        {item.material.marca && (
                            <Chip 
                                size="sm" 
                                variant="flat" 
                                color="primary"
                                className="mt-2"
                            >
                                {item.material.marca}
                            </Chip>
                        )}
                    </div>

                    {/* Size Slider */}
                    <div className="w-full mt-4 px-2">
                        <Slider
                            size="sm"
                            step={10}
                            maxValue={200}
                            minValue={80}
                            value={size}
                            onChange={(val) => onSizeChange(val as number)}
                            className="max-w-full"
                            label="Tamanho"
                            showTooltip
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    </motion.div>
);

export default function GenerateQRCodePage() {
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [materials, setMaterials] = useState<Inventario[]>([]);
    const [selectedItems, setSelectedItems] = useState<Inventario[]>([]);
    const [qrSizes, setQrSizes] = useState<Record<number, number>>({});
    const [isSearching, setIsSearching] = useState(false);

    // Search materials
    useEffect(() => {
        const searchMaterials = async () => {
            if (searchTerm.length < 3) {
                setMaterials([]);
                return;
            }

            setIsSearching(true);
            try {
                const data = await fetcher<Inventario[]>(
                    `/Inventarios/buscaDescricaoInventario?descricao=${searchTerm.split("#").join(".")}`
                );
                setMaterials(data || []);
            } catch (error) {
                console.error("Erro ao buscar materiais:", error);
                setMaterials([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(searchMaterials, 400);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    // Print handler
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: "QR Codes - Master ERP",
    });

    // Add item to selection
    const addItem = (item: Inventario) => {
        if (!selectedItems.find(i => i.id === item.id)) {
            setSelectedItems(prev => [...prev, item]);
            setQrSizes(prev => ({ ...prev, [item.id]: 120 }));
        }
    };

    // Remove item from selection
    const removeItem = (id: number) => {
        setSelectedItems(prev => prev.filter(i => i.id !== id));
        setQrSizes(prev => {
            const newSizes = { ...prev };
            delete newSizes[id];
            return newSizes;
        });
    };

    // Update QR size
    const updateSize = (id: number, size: number) => {
        setQrSizes(prev => ({ ...prev, [id]: size }));
    };

    // Check if item is already selected
    const isSelected = (id: number) => selectedItems.some(i => i.id === id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Back button */}
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm">Voltar</span>
                        </button>

                        {/* Title */}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <QrCode className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">
                                    Gerador de QR Codes
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">
                                    Crie etiquetas com QR Code para seus materiais
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Card className="shadow-xl">
                        <CardBody className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Buscar Material
                                    </label>
                                    <Autocomplete
                                        placeholder="Digite o nome do material (mín. 3 caracteres)"
                                        startContent={<Search className="w-5 h-5 text-gray-400" />}
                                        isLoading={isSearching}
                                        inputValue={searchTerm}
                                        onInputChange={setSearchTerm}
                                        className="w-full"
                                        size="lg"
                                        variant="bordered"
                                    >
                                        {materials.map((item) => (
                                            <AutocompleteItem
                                                key={item.id}
                                                textValue={item.material.descricao || ""}
                                                endContent={
                                                    isSelected(item.id) ? (
                                                        <Chip size="sm" color="success" variant="flat">
                                                            Adicionado
                                                        </Chip>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            color="primary"
                                                            variant="flat"
                                                            startContent={<Plus className="w-3 h-3" />}
                                                            onPress={() => addItem(item)}
                                                        >
                                                            Adicionar
                                                        </Button>
                                                    )
                                                }
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        #{item.material.id} - {item.material.descricao}
                                                    </span>
                                                    {item.material.marca && (
                                                        <span className="text-xs text-gray-500">
                                                            Marca: {item.material.marca}
                                                        </span>
                                                    )}
                                                </div>
                                            </AutocompleteItem>
                                        ))}
                                    </Autocomplete>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button
                                        color="danger"
                                        variant="flat"
                                        startContent={<Trash2 className="w-4 h-4" />}
                                        onPress={() => {
                                            setSelectedItems([]);
                                            setQrSizes({});
                                        }}
                                        isDisabled={selectedItems.length === 0}
                                        className="flex-1 sm:flex-none"
                                    >
                                        Limpar
                                    </Button>
                                    <Button
                                        color="primary"
                                        startContent={<Printer className="w-4 h-4" />}
                                        onPress={handlePrint}
                                        isDisabled={selectedItems.length === 0}
                                        className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600"
                                    >
                                        Imprimir
                                    </Button>
                                </div>
                            </div>

                            {/* Stats */}
                            {selectedItems.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-4 pt-4 border-t border-gray-100"
                                >
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Layers className="w-4 h-4" />
                                        <span>
                                            <strong>{selectedItems.length}</strong> QR Code{selectedItems.length > 1 ? "s" : ""} selecionado{selectedItems.length > 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </CardBody>
                    </Card>
                </motion.div>

                {/* QR Codes Grid */}
                <AnimatePresence mode="popLayout">
                    {selectedItems.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Nenhum QR Code gerado
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Use a busca acima para encontrar materiais e adicionar QR Codes para impressão
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {selectedItems.map((item) => (
                                <QRCodeCard
                                    key={item.id}
                                    item={item}
                                    onRemove={() => removeItem(item.id)}
                                    size={qrSizes[item.id] || 120}
                                    onSizeChange={(size) => updateSize(item.id, size)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Print Container (hidden) */}
                <div className="hidden">
                    <div ref={printRef} className="p-8">
                        <div className="grid grid-cols-3 gap-8">
                            {selectedItems.map((item) => (
                                <div key={item.id} className="flex flex-col items-center p-4 border border-gray-300 text-center">
                                    <QRCodeSVG
                                        value={`https://mastererp.vercel.app/qrcode-to-material/${item.material.id}`}
                                        size={qrSizes[item.id] || 120}
                                        level="M"
                                        marginSize={2}
                                    />
                                    <p className="mt-3 font-bold text-sm">ID: {item.material.id}</p>
                                    <p className="text-xs mt-1 max-w-[150px]">{item.material.descricao}</p>
                                    {item.material.marca && (
                                        <p className="text-xs mt-1 font-medium">Marca: {item.material.marca}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}