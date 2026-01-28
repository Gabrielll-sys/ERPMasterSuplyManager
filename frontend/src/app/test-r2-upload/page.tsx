"use client";

import React, { useState } from "react";
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Image, 
  Input, 
  Spinner,
  Divider,
  Tabs,
  Tab
} from "@nextui-org/react";
import { Upload, ImageIcon, CheckCircle2, AlertCircle, ExternalLink, Camera } from "lucide-react";
import { uploadImageToR2, uploadFileToR2, uploadImageViaProxy } from "../services/R2Images.Services";

// ==========================================================
// PÁGINA: TestR2Upload
// ==========================================================
// Esta página serve para testar a integração com o Cloudflare R2.
// Demonstra o uso do serviço R2Images.Services em um cenário real.

export default function TestR2Upload() {
  // Estados para gerenciar o arquivo e o status
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState<{ publicUrl: string; fileKey: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"direct" | "proxy">("direct");

  // Refs para câmera
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // ============================================================
  // MÉTODO 1: Seleção de Arquivo
  // ============================================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho
      if (file.size > 10 * 1024 * 1024) {
        setError("Arquivo muito grande (máximo 10MB)");
        return;
      }

      // Validar tipo
      const validMimes = ["image/jpeg", "image/png", "image/webp"];
      if (!validMimes.includes(file.type)) {
        setError("Tipo de arquivo não permitido. Use JPG, PNG ou WEBP");
        return;
      }

      setSelectedFile(file);
      setError(null);
      setUploadedData(null);

      // Gera um preview local antes do upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ============================================================
  // MÉTODO 2: Captura de Câmera
  // ============================================================
  const handleCameraCapture = async () => {
    try {
      if (!cameraActive) {
        // Abrir câmera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          setError(null);
        }
      } else {
        // Tirar foto
        if (videoRef.current && canvasRef.current) {
          const context = canvasRef.current.getContext("2d");
          if (context) {
            context.drawImage(videoRef.current, 0, 0);
            const imageBase64 = canvasRef.current.toDataURL("image/jpeg");

            // Criar arquivo mock
            const blob = await fetch(imageBase64).then(r => r.blob());
            const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });

            setSelectedFile(file);
            setPreviewUrl(imageBase64);
            setError(null);
            setUploadedData(null);

            // Fechar câmera
            if (videoRef.current.srcObject instanceof MediaStream) {
              videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            setCameraActive(false);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao acessar câmera");
    }
  };

  // ============================================================
  // MÉTODO 3: Upload Direto (via Presigned URL)
  // ============================================================
  const handleUploadDirect = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsUploading(true);
    setError(null);

    try {
      console.log("[TestPage] Iniciando upload direto...");
      
      const result = await uploadFileToR2(selectedFile);
      
      setUploadedData(result);
      console.log("[TestPage] Upload bem-sucedido:", result);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err.message || "Erro no upload direto (CORS/Signature)";
      setError(errorMsg);
      console.error("[TestPage] Erro:", err);
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================
  // MÉTODO 4: Upload via Proxy (Backend faz tudo)
  // ============================================================
  const handleUploadProxy = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsUploading(true);
    setError(null);

    try {
      console.log("[TestPage] Iniciando upload via Proxy...");
      
      const result = await uploadImageViaProxy(previewUrl, selectedFile.name);
      
      setUploadedData(result);
      console.log("[TestPage] Upload via Proxy bem-sucedido:", result);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err.message || "Erro no upload via Proxy";
      setError(errorMsg);
      console.error("[TestPage] Erro:", err);
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================
  // Resetar para novo upload
  // ============================================================
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8">
        {/* ========== CABEÇALHO ========== */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Teste de Upload Cloudflare R2
          </h1>
          <p className="text-gray-600 mt-2">
            Valide a integração do Backend .NET com o Frontend Next.js/React
          </p>
        </div>

        {/* ========== CARD PRINCIPAL ========== */}
        <Card className="shadow-2xl border border-blue-200">
          <CardHeader className="flex gap-3 p-6 bg-gradient-to-r from-blue-500 to-indigo-500">
            <div className="p-2 bg-white/20 rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold text-white">Upload de Imagens</p>
              <p className="text-sm text-blue-100">Selecione, capture ou arraste uma imagem</p>
            </div>
          </CardHeader>

          <CardBody className="p-8 space-y-6">
            {/* ========== ABAS DE SELEÇÃO ========== */}
            {!uploadedData && (
              <Tabs 
                aria-label="Métodos de seleção"
                color="primary"
                className="mb-4"
              >
                {/* ABA 1: Arquivo */}
                <Tab key="file" title={<span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" />Arquivo</span>}>
                  <div className="space-y-4 pt-4">
                    <div 
                      className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-300 rounded-2xl hover:bg-blue-50 transition-all cursor-pointer relative group"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add("bg-blue-50", "border-blue-500");
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove("bg-blue-50", "border-blue-500");
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("bg-blue-50", "border-blue-500");
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          const event = {
                            target: { files: e.dataTransfer.files }
                          } as React.ChangeEvent<HTMLInputElement>;
                          handleFileChange(event);
                        }
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <ImageIcon className="w-16 h-16 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-gray-700 font-medium text-center">
                        {selectedFile 
                          ? `✓ ${selectedFile.name}` 
                          : "Clique para selecionar ou arraste um arquivo"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">JPG, PNG ou WEBP (máx 10MB)</p>
                    </div>
                  </div>
                </Tab>

                {/* ABA 2: Câmera */}
                <Tab key="camera" title={<span className="flex items-center gap-2"><Camera className="w-4 h-4" />Câmera</span>}>
                  <div className="space-y-4 pt-4">
                    {!cameraActive && !selectedFile && (
                      <Button
                        color="primary"
                        size="lg"
                        className="w-full font-bold"
                        startContent={<Camera className="w-5 h-5" />}
                        onClick={handleCameraCapture}
                      >
                        🎥 Abrir Câmera
                      </Button>
                    )}

                    {cameraActive && (
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-xl bg-black shadow-lg"
                        />
                        <div className="flex gap-3">
                          <Button
                            color="primary"
                            size="lg"
                            className="flex-1 font-bold"
                            onClick={handleCameraCapture}
                          >
                            📸 Capturar Foto
                          </Button>
                          <Button
                            variant="bordered"
                            size="lg"
                            onClick={() => {
                              if (videoRef.current?.srcObject instanceof MediaStream) {
                                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                              }
                              setCameraActive(false);
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            )}

            {/* Canvas oculto */}
            <canvas ref={canvasRef} style={{ display: "none" }} width={400} height={300} />

            {/* ========== PREVIEW ========== */}
            {previewUrl && !uploadedData && (
              <div className="space-y-4">
                <Divider />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">📷 Preview Local</p>
                <Image
                  alt="Preview"
                  className="w-full rounded-xl shadow-lg border-2 border-blue-200"
                  src={previewUrl}
                />

                {/* ========== OPÇÕES DE UPLOAD ========== */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Escolha o método:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      color="primary"
                      size="lg"
                      className="font-bold"
                      startContent={!isUploading && <CheckCircle2 className="w-5 h-5" />}
                      isLoading={isUploading && uploadMethod === "proxy"}
                      onClick={() => {
                        setUploadMethod("proxy");
                        handleUploadProxy();
                      }}
                      isDisabled={isUploading}
                    >
                      {isUploading && uploadMethod === "proxy" ? "Enviando..." : "✅ Via Servidor"}
                    </Button>

                    <Button
                      variant="bordered"
                      color="primary"
                      size="lg"
                      className="font-bold"
                      startContent={!isUploading && <Upload className="w-5 h-5" />}
                      isLoading={isUploading && uploadMethod === "direct"}
                      onClick={() => {
                        setUploadMethod("direct");
                        handleUploadDirect();
                      }}
                      isDisabled={isUploading}
                    >
                      {isUploading && uploadMethod === "direct" ? "Enviando..." : "⚡ Direto"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Via Servidor é mais seguro. Direto é mais rápido (pode ter CORS).
                  </p>
                </div>
              </div>
            )}

            {/* ========== SUCESSO ========== */}
            {uploadedData && (
              <div className="space-y-6 pt-4">
                <div className="p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-start gap-3 animate-in">
                  <CheckCircle2 className="w-7 h-7 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-green-900 text-lg">✅ Upload Concluído com Sucesso!</h3>
                    <p className="text-sm text-green-700">A imagem foi salva no Cloudflare R2.</p>
                  </div>
                </div>

                <Divider />

                <div className="space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">🖼️ Resultado Final</p>
                  <Image
                    alt="Imagem no R2"
                    className="w-full rounded-xl shadow-xl border-2 border-green-200"
                    src={uploadedData.publicUrl}
                  />

                  <div className="space-y-2">
                    <Input
                      readOnly
                      value={uploadedData.publicUrl}
                      label="URL Pública"
                      variant="bordered"
                      className="font-mono text-xs"
                      endContent={
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={() => {
                            navigator.clipboard.writeText(uploadedData.publicUrl);
                          }}
                        >
                          📋
                        </Button>
                      }
                    />
                    <Input
                      readOnly
                      value={uploadedData.fileKey}
                      label="File Key (ID no R2)"
                      variant="bordered"
                      className="font-mono text-xs"
                    />
                  </div>

                  <Button
                    as="a"
                    href={uploadedData.publicUrl}
                    target="_blank"
                    variant="flat"
                    color="primary"
                    className="w-full"
                    startContent={<ExternalLink className="w-4 h-4" />}
                  >
                    Abrir em Nova Aba
                  </Button>

                  <Button
                    variant="bordered"
                    className="w-full"
                    onClick={handleReset}
                  >
                    Fazer Outro Upload
                  </Button>
                </div>
              </div>
            )}

            {/* ========== ERRO ========== */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-7 h-7 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900">❌ Erro no Processo</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <Button
                    size="sm"
                    variant="light"
                    className="mt-2"
                    onClick={() => setError(null)}
                  >
                    Descartar
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* ========== INFORMAÇÕES ========== */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg">
          <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5" /> Checklist de Configuração:
          </h4>
          <ul className="text-sm text-amber-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">✓</span>
              <span>Backend tem credenciais R2 no <code className="bg-amber-100 px-2 py-1 rounded text-xs font-mono">appsettings.json</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">✓</span>
              <span>CORS configurado no bucket R2 (aguardou 60 segundos após salvar)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">✓</span>
              <span>NuGet <code className="bg-amber-100 px-2 py-1 rounded text-xs font-mono">AWSSDK.S3</code> instalado no .NET</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">✓</span>
              <span>Serviço <code className="bg-amber-100 px-2 py-1 rounded text-xs font-mono">R2Images.Services.ts</code> importado corretamente</span>
            </li>
          </ul>
        </div>

        {/* ========== STATS ========== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/50 backdrop-blur border border-blue-200">
            <CardBody className="py-3 text-center">
              <p className="text-2xl font-bold text-blue-600">2</p>
              <p className="text-xs text-gray-600">Métodos de Upload</p>
            </CardBody>
          </Card>
          <Card className="bg-white/50 backdrop-blur border border-green-200">
            <CardBody className="py-3 text-center">
              <p className="text-2xl font-bold text-green-600">10MB</p>
              <p className="text-xs text-gray-600">Tamanho Máximo</p>
            </CardBody>
          </Card>
          <Card className="bg-white/50 backdrop-blur border border-purple-200">
            <CardBody className="py-3 text-center">
              <p className="text-2xl font-bold text-purple-600">30m</p>
              <p className="text-xs text-gray-600">URL Expira em</p>
            </CardBody>
          </Card>
          <Card className="bg-white/50 backdrop-blur border border-orange-200">
            <CardBody className="py-3 text-center">
              <p className="text-2xl font-bold text-orange-600">3</p>
              <p className="text-xs text-gray-600">Tipos Aceitos</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
