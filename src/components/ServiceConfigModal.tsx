import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  File, 
  Trash2, 
  CheckCircle, 
  Info, 
  Calculator, 
  Clock, 
  Layers, 
  Sparkles,
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Service, ServiceConfiguration, UploadedFileItem } from '../types';
import { calculateServicePrice, formatPKR } from '../utils/priceCalculator';
import { useApp } from '../context/AppContext';

interface ServiceConfigModalProps {
  service: Service;
  onClose: () => void;
}

export const ServiceConfigModal: React.FC<ServiceConfigModalProps> = ({ service, onClose }) => {
  const { addToCartService, setActiveTab } = useApp();

  // Configuration state
  const [widthFeet, setWidthFeet] = useState<number>(service.priceUnit === 'per_square_foot' ? 4 : 1);
  const [heightFeet, setHeightFeet] = useState<number>(service.priceUnit === 'per_square_foot' ? 3 : 1);
  const [pages, setPages] = useState<number>(service.priceUnit === 'per_page' ? 10 : 1);
  const [copies, setCopies] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [isColor, setIsColor] = useState<boolean>(service.id === 'srv-13');
  const [hasLamination, setHasLamination] = useState<boolean>(false);
  const [designRequired, setDesignRequired] = useState<boolean>(false);
  const [materialType, setMaterialType] = useState<string>('Frontlit High Quality (Standard 350g)');
  const [stampType, setStampType] = useState<string>('Standard Handle Stamp');
  const [cardQuantity, setCardQuantity] = useState<number>(100);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Addons for design services
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number }[]>([]);

  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const designAddonChoices = [
    { name: 'Urgent 2-Hour Express Delivery', price: 200 },
    { name: 'Editable Source Files (CorelDRAW CDR / PSD)', price: 300 },
    { name: 'Multiple Color & Layout Variations', price: 150 },
  ];

  const toggleAddon = (addon: { name: string; price: number }) => {
    if (selectedAddons.some(a => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Compile active configuration tailored strictly to this service unit
  const currentConfig: ServiceConfiguration = {
    uploadedFiles,
    specialInstructions: specialInstructions.trim() || undefined,
    ...(service.priceUnit === 'per_square_foot' ? {
      widthFeet,
      heightFeet,
      materialType,
      designRequired,
    } : {}),
    ...(service.priceUnit === 'per_page' ? {
      pages,
      copies,
      isColor,
      hasLamination,
    } : {}),
    ...(service.priceUnit === 'per_stamp' ? {
      stampType,
    } : {}),
    ...(service.priceUnit === 'per_card' ? {
      cardQuantity,
    } : {}),
    ...(service.priceUnit === 'per_design' ? {
      selectedAddons,
    } : {}),
  };

  const calculatedTotal = calculateServicePrice(
    service.basePrice,
    service.priceUnit,
    currentConfig,
    quantity
  );

  // Simulated 25MB file upload with progress bar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSizeBytes = 25 * 1024 * 1024; // 25 MB limit
    if (file.size > maxSizeBytes) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 25 MB.`);
      return;
    }

    setUploadProgress(20);
    const timer1 = setTimeout(() => setUploadProgress(70), 180);
    const timer2 = setTimeout(() => {
      setUploadProgress(100);
      const newFileItem: UploadedFileItem = {
        id: 'file-' + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
      };
      setUploadedFiles(prev => [...prev, newFileItem]);
      setTimeout(() => setUploadProgress(null), 250);
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleAddToCart = () => {
    if (service.requiresFileUpload && uploadedFiles.length === 0 && !designRequired) {
      setUploadError('This service requires an artwork file or selecting "Make design for me".');
      return;
    }

    addToCartService(service, currentConfig, quantity);
    onClose();
    setActiveTab('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto font-body">
      <div className="bg-white rounded-[24px] w-full max-w-lg shadow-float border border-[#E5E7EB] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#1B3A6B] text-white px-5 py-4 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#FF7A00] text-[#111827] text-[10px] font-heading font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {service.priceUnit.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-slate-200 flex items-center font-medium">
                <Clock className="w-3.5 h-3.5 mr-1 text-[#FF7A00]" />
                {service.estimatedTime}
              </span>
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold mt-1 text-white leading-tight">
              {service.name}
            </h2>
            <p className="text-xs text-amber-200 urdu-font">{service.urduName}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-[#264E8C] transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-[#111827] flex-1">
          {/* Base rate chip */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-[14px] p-3 flex items-center justify-between text-xs text-[#1B3A6B]">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#1B3A6B] shrink-0" />
              <span>Base Rate: <strong className="font-bold text-[#1B3A6B]">{formatPKR(service.basePrice)}</strong> / {service.priceUnit.replace(/_/g, ' ')}</span>
            </div>
            <span className="text-[#16A34A] font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
              Live Price
            </span>
          </div>

          {/* 1. FLEX / BANNER SQUARE FOOT CALCULATOR */}
          {service.priceUnit === 'per_square_foot' && (
            <div className="bg-[#F6F7FB] border border-[#E5E7EB] rounded-[18px] p-4 space-y-3">
              <div className="flex items-center space-x-2 text-[#111827] font-heading font-bold text-sm">
                <Calculator className="w-4 h-4 text-[#1B3A6B]" />
                <span>Flex / Banner Size (Feet)</span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Formula: Width (ft) × Height (ft) × {formatPKR(service.basePrice)} × Quantity
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Width (Feet)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={widthFeet}
                    onChange={(e) => setWidthFeet(Math.max(0.5, parseFloat(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-[12px] bg-white focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Height (Feet)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(Math.max(0.5, parseFloat(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-[12px] bg-white focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Area summary chip */}
              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-[12px] border border-[#E5E7EB]">
                <span className="text-[#6B7280]">Total Square Footage:</span>
                <span className="font-heading font-bold text-[#1B3A6B]">{widthFeet * heightFeet} sq ft</span>
              </div>

              {/* Material choice */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Flex Material Grade
                </label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-[12px] bg-white focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
                >
                  <option value="Frontlit High Quality (Standard 350g)">Frontlit High Quality (Standard 350g)</option>
                  <option value="Star Flex Premium Thick">Star Flex Premium Heavy Glossy (+Rs. 10/sqft)</option>
                  <option value="Backlit Translucent (for Lightbox Signboard)">Backlit Translucent (for Lightbox Signboard)</option>
                </select>
              </div>

              {/* Design Required toggle */}
              <label className="flex items-center space-x-2 text-xs font-medium text-[#111827] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={designRequired}
                  onChange={(e) => setDesignRequired(e.target.checked)}
                  className="rounded text-[#1B3A6B] focus:ring-[#1B3A6B] w-4 h-4"
                />
                <span>I don't have artwork. Make design for me (+Rs. 300 composing fee)</span>
              </label>
            </div>
          )}

          {/* 2. PHOTOCOPY / PRINTING CALCULATOR */}
          {service.priceUnit === 'per_page' && (
            <div className="bg-[#F6F7FB] border border-[#E5E7EB] rounded-[18px] p-4 space-y-3">
              <div className="flex items-center space-x-2 text-[#111827] font-heading font-bold text-sm">
                <Layers className="w-4 h-4 text-[#1B3A6B]" />
                <span>Document Pages &amp; Copies</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Number of Pages
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={pages}
                    onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-[12px] bg-white focus:ring-2 focus:ring-[#1B3A6B] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Copies / Sets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={copies}
                    onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-[12px] bg-white focus:ring-2 focus:ring-[#1B3A6B] font-mono"
                  />
                </div>
              </div>

              {/* Color vs B&W toggle */}
              <div className="flex items-center justify-between p-2.5 bg-white border border-[#E5E7EB] rounded-[12px]">
                <span className="text-xs font-semibold text-[#111827]">Print Type:</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsColor(false)}
                    className={`px-3 py-1.5 text-xs rounded-[10px] font-semibold transition-all ${
                      !isColor 
                        ? 'bg-[#111827] text-white shadow-xs' 
                        : 'bg-slate-100 text-[#6B7280] hover:bg-slate-200'
                    }`}
                  >
                    Black &amp; White
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsColor(true)}
                    className={`px-3 py-1.5 text-xs rounded-[10px] font-semibold transition-all ${
                      isColor 
                        ? 'bg-[#1B3A6B] text-white shadow-xs' 
                        : 'bg-slate-100 text-[#6B7280] hover:bg-slate-200'
                    }`}
                  >
                    Color (+Rs. 20)
                  </button>
                </div>
              </div>

              {/* Lamination option */}
              <label className="flex items-center space-x-2 text-xs font-medium text-[#111827] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLamination}
                  onChange={(e) => setHasLamination(e.target.checked)}
                  className="rounded text-[#1B3A6B] focus:ring-[#1B3A6B] w-4 h-4"
                />
                <span>Add Thermal Hot Lamination (+Rs. 25/page)</span>
              </label>
            </div>
          )}

          {/* 3. VISITING / PVC CARD QUANTITY */}
          {service.priceUnit === 'per_card' && (
            <div className="bg-[#F6F7FB] border border-[#E5E7EB] rounded-[18px] p-4 space-y-3">
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                Select Card Quantity
              </label>
              <select
                value={cardQuantity}
                onChange={(e) => setCardQuantity(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-[12px] bg-white focus:ring-2 focus:ring-[#1B3A6B]"
              >
                <option value="100">100 Cards Pack</option>
                <option value="250">250 Cards Pack</option>
                <option value="500">500 Cards Pack (Economical)</option>
                <option value="1000">1,000 Cards Box (Best Value)</option>
              </select>
            </div>
          )}

          {/* 4. STAMP TYPE SELECTION */}
          {service.priceUnit === 'per_stamp' && (
            <div className="bg-[#F6F7FB] border border-[#E5E7EB] rounded-[18px] p-4 space-y-3">
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                Stamp Mount &amp; Mechanism
              </label>
              <select
                value={stampType}
                onChange={(e) => setStampType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-[12px] bg-white focus:ring-2 focus:ring-[#1B3A6B]"
              >
                <option value="Standard Handle Stamp">Standard Wooden / Acrylic Handle (Manual Ink Pad) - Rs. 800</option>
                <option value="Self Inking / Shiny">Shiny Automatic Self-Inking Mount (+Rs. 400)</option>
              </select>
            </div>
          )}

          {/* 5. DESIGN SERVICES ADD-ONS */}
          {service.priceUnit === 'per_design' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#111827]">
                Design Add-ons &amp; Fast Track
              </label>
              <div className="space-y-2">
                {designAddonChoices.map((addon) => {
                  const isChecked = selectedAddons.some(a => a.name === addon.name);
                  return (
                    <label
                      key={addon.name}
                      className={`flex items-center justify-between p-2.5 rounded-[12px] border text-xs cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-blue-50 border-[#1B3A6B] text-[#1B3A6B] font-medium' 
                          : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddon(addon)}
                          className="rounded text-[#1B3A6B] focus:ring-[#1B3A6B] w-4 h-4"
                        />
                        <span>{addon.name}</span>
                      </div>
                      <span className="font-bold text-[#1B3A6B]">+{formatPKR(addon.price)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector for other units */}
          {service.priceUnit !== 'per_card' && service.priceUnit !== 'per_page' && (
            <div className="flex items-center justify-between bg-[#F6F7FB] p-3 rounded-[16px] border border-[#E5E7EB]">
              <span className="text-xs font-semibold text-[#111827]">Order Quantity</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-[10px] bg-white border border-[#E5E7EB] font-bold text-[#111827] hover:bg-slate-100 flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-[#111827] font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-[10px] bg-white border border-[#E5E7EB] font-bold text-[#111827] hover:bg-slate-100 flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* FILE UPLOAD SECTION */}
          <div className="space-y-2 pt-2 border-t border-[#F3F4F6]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111827] flex items-center space-x-1.5">
                <UploadCloud className="w-4 h-4 text-[#1B3A6B]" />
                <span>Upload Printing File</span>
                {service.requiresFileUpload && (
                  <span className="text-[#DC2626] text-xs font-bold">*Required</span>
                )}
              </label>
              <span className="text-[11px] text-[#6B7280]">Max 25 MB</span>
            </div>

            {/* Drag & Drop Upload Container */}
            <div className="relative border-2 border-dashed border-[#1B3A6B]/30 hover:border-[#1B3A6B] bg-blue-50/30 rounded-[18px] p-4 text-center cursor-pointer transition-colors group">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.cdr,.psd,.zip"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-[#1B3A6B] mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-[#111827]">
                Tap to browse or drop file here
              </p>
              <p className="text-[10px] text-[#6B7280] mt-0.5">
                PDF, JPG, PNG, DOCX, CDR, PSD (Up to 25 MB)
              </p>
            </div>

            {/* Upload progress */}
            {uploadProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-[#1B3A6B]">
                  <span>Uploading file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1B3A6B] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="flex items-center space-x-1.5 text-xs text-[#DC2626] bg-red-50 border border-red-200 rounded-[12px] p-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-2 rounded-[12px] bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <File className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span className="font-medium text-[#111827] truncate">{file.name}</span>
                      <span className="text-[10px] text-[#16A34A] shrink-0 font-mono">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Special Instructions Field */}
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">
              Special Instructions / Notes
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Urdu text to compose, specific colors, phone numbers on flex..."
              className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-[12px] focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
            />
          </div>

          {/* Legal Disclaimer Pill */}
          <div className="bg-[#F6F7FB] border border-[#E5E7EB] p-2.5 rounded-[12px] text-[11px] text-[#6B7280] flex items-start space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1B3A6B] shrink-0 mt-0.5" />
            <span>Final price may be confirmed by Mukhtar Ahmed after inspecting custom artwork or composing volume.</span>
          </div>
        </div>

        {/* Modal Footer with Live Estimated Price & Add to Cart button */}
        <div className="bg-slate-50 border-t border-[#E5E7EB] px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">
              Estimated Total
            </p>
            <p className="font-heading text-xl font-extrabold text-[#1B3A6B]">
              {formatPKR(calculatedTotal)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center space-x-2 bg-[#FF7A00] hover:bg-[#E56D00] text-[#111827] font-heading font-bold px-6 py-3 rounded-[14px] shadow-sm transition-all active:scale-95 min-h-[48px]"
          >
            <Sparkles className="w-4 h-4 text-[#111827]" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
