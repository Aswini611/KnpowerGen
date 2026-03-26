import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Printer, Download, FileText, 
  User, Zap, Building2, CreditCard, ClipboardList, 
  Settings, Info, ChevronRight, ChevronDown,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuotationData, ItemRow, ScopeItem } from './types';

const INITIAL_DATA: QuotationData = {
  documentType: 'QUOTATION',
  quoteNo: 'KN/2025-26/054',
  date: '2026-03-09',
  customerName: 'B.V.U. KIRAN KUMAR',
  customerAddress: 'D.No. 8-199, Mallayapeta, Katheru, Rajahmundry, East Godavari, Andhra Pradesh – 533105',
  customerPhone: '',
  customerEmail: '',
  gstNumber: '37AAMCK3560G1ZC',
  siteLocation: '',
  systemSize: '3KW ON GRID',
  systemType: 'On-Grid Solar PV System',
  roofType: 'RCC Concrete',
  numPanels: '6',
  panelWattage: '550 WP',
  inverterModel: '3KV',
  netMetering: 'Yes',
  subsidyApplicable: 'Yes',
  items: [
    { id: '1', description: '3KW ON GRID ROOF -TOP SOLAR SYSTEM CONTAINING 550 WP SOLAR PANELS AND 3KV INCLUDING WITH MOUNTING STRUCTURE INSTALLATION', unitRate: 220000, qty: 1, amount: 220000 }
  ],
  subtotal: 220000,
  taxRate: 0,
  taxAmount: 0,
  totalAmount: 220000,
  govSubsidy: 78000,
  netPrice: 142000,
  bankName: 'STATE BANK OF INDIA',
  accHolderName: 'KN POWERGEN PVT LTD',
  accNumber: '44083776625',
  ifscCode: 'SBIN0004355',
  branch: 'RAJAHMUNDRY',
  structureType: 'Flat Roof GI-Regular/Elevated',
  windSpeed: '160 kmph',
  structureWarranty: '5 years',
  scopeOfWork: [
    { description: 'Supply of An components for Solar System (as per BOM)', knResponsibility: true, clientResponsibility: false },
    { description: 'Installation of solar system up to the client Main Panel only', knResponsibility: true, clientResponsibility: false },
    { description: 'Staircase/ ladder access to the roof', knResponsibility: false, clientResponsibility: true },
    { description: 'Civil Works for structures', knResponsibility: true, clientResponsibility: false },
    { description: 'Earthing on non-concrete flooring', knResponsibility: true, clientResponsibility: false },
    { description: 'Concrete cutting & repair for earthling', knResponsibility: false, clientResponsibility: true },
    { description: 'Internet access with in band width of 1MBPS at inverter location', knResponsibility: false, clientResponsibility: true },
    { description: 'Removal or debris from site', knResponsibility: false, clientResponsibility: true },
    { description: 'Testing & Commissioning Including net metering', knResponsibility: true, clientResponsibility: false },
    { description: 'Net metering & subsidy application process', knResponsibility: true, clientResponsibility: false },
    { description: 'Regular cleaning of the system', knResponsibility: false, clientResponsibility: true },
    { description: 'Warranty documents', knResponsibility: true, clientResponsibility: false },
  ],
  paymentTerms: '90% Advance, 10% After installations',
  timeline: '45 days',
  completionDays: '45',
  warrantyTerms: '25 years on panels, 8 years on inverter',
  moduleManufacturer: 'WAAREE',
  moduleWattage: '550 WP',
  moduleWarranty: 'Model panels 25 year warranty and inverter 8 years Warranty . Warranty certificate issued by WAAREE.',
  inverterManufacturer: 'WAAREE',
  inverterWarranty: '8 years',
  signatoryName: '',
  signatoryDesignation: 'AUTHORISED SIGNATORY'
};

export default function App() {
  const [data, setData] = useState<QuotationData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const previewRef = useRef<HTMLDivElement>(null);

  // Calculate totals whenever items or tax changes
  useEffect(() => {
    const subtotal = data.items.reduce((acc, item) => acc + item.amount, 0);
    const taxAmount = (subtotal * data.taxRate) / 100;
    const totalAmount = subtotal + taxAmount;
    const netPrice = totalAmount - data.govSubsidy;

    setData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount,
      netPrice
    }));
  }, [data.items, data.taxRate, data.govSubsidy]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, field: keyof ItemRow, value: any) => {
    setData(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'unitRate' || field === 'qty') {
            updatedItem.amount = updatedItem.unitRate * updatedItem.qty;
          }
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    const newItem: ItemRow = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      unitRate: 0,
      qty: 1,
      amount: 0
    };
    setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const toggleScope = (index: number, field: 'knResponsibility' | 'clientResponsibility') => {
    setData(prev => {
      const newScope = [...prev.scopeOfWork];
      newScope[index] = { ...newScope[index], [field]: !newScope[index][field] };
      return { ...prev, scopeOfWork: newScope };
    });
  };

  const handlePrint = () => {
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.error("Print failed:", e);
      alert("Print failed. Please try opening the app in a new tab using the button in the top right.");
    }
  };

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `quotation_${data.quoteNo.replace(/\//g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const isIframe = window.self !== window.top;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Header - Hidden on Print */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KN PowerGen Logo" className="h-16 w-auto" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Quotation Builder</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('edit')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Edit Details
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Live Preview
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isIframe && (
            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              title="Open in new tab for better printing"
            >
              <ExternalLink size={18} />
              <span className="hidden sm:inline">Open in New Tab</span>
            </a>
          )}
          <button 
            onClick={handleDownloadData}
            className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Download Data (JSON)"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-200"
          >
            <Printer size={18} />
            Print / Save PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className={`lg:col-span-7 space-y-8 print:hidden ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4 flex items-start gap-3">
            <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> If the "Print" button doesn't open the dialog, try opening the app in a <strong>New Tab</strong> using the button in the top right of the preview window.
            </p>
          </div>
          
          {/* Document Meta */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <FileText size={20} />
              <h2 className="font-bold text-lg">Document Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Type</label>
                <select 
                  name="documentType"
                  value={data.documentType}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="QUOTATION">QUOTATION</option>
                  <option value="INVOICE">INVOICE</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Number</label>
                <input 
                  type="text" 
                  name="quoteNo"
                  value={data.quoteNo}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={data.date}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Customer Details */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <User size={20} />
              <h2 className="font-bold text-lg">Customer Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="customerName"
                  placeholder="Enter customer name"
                  value={data.customerName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
                <input 
                  type="text" 
                  name="customerPhone"
                  placeholder="+91 00000 00000"
                  value={data.customerPhone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  name="customerEmail"
                  placeholder="customer@example.com"
                  value={data.customerEmail}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Billing Address</label>
                <textarea 
                  name="customerAddress"
                  rows={2}
                  value={data.customerAddress}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Site Location</label>
                <input 
                  type="text" 
                  name="siteLocation"
                  placeholder="Installation site address"
                  value={data.siteLocation}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">GST Number</label>
                <input 
                  type="text" 
                  name="gstNumber"
                  placeholder="e.g., 37AAMCK3560G1ZC"
                  value={data.gstNumber}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* System Details */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Zap size={20} />
              <h2 className="font-bold text-lg">System Specifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">System Size</label>
                <input type="text" name="systemSize" value={data.systemSize} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">System Type</label>
                <input type="text" name="systemType" value={data.systemType} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Roof Type</label>
                <input type="text" name="roofType" value={data.roofType} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">No. of Panels</label>
                <input type="text" name="numPanels" value={data.numPanels} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Panel Wattage</label>
                <input type="text" name="panelWattage" value={data.panelWattage} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Inverter Model</label>
                <input type="text" name="inverterModel" value={data.inverterModel} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Pricing Table */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-blue-600">
                <CreditCard size={20} />
                <h2 className="font-bold text-lg">Itemized Pricing</h2>
              </div>
              <button 
                onClick={addItem}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-bold"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {data.items.map((item, index) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unit Rate</label>
                      <input 
                        type="number" 
                        value={item.unitRate}
                        onChange={(e) => handleItemChange(item.id, 'unitRate', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Qty</label>
                      <input 
                        type="number" 
                        value={item.qty}
                        onChange={(e) => handleItemChange(item.id, 'qty', parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-center"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Amount</label>
                      <div className="w-full bg-slate-100 border border-transparent rounded-lg px-3 py-2 text-sm font-bold text-slate-700">
                        ₹{item.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tax Rate (%)</label>
                  <input type="number" name="taxRate" value={data.taxRate} onChange={handleInputChange} className="w-32 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Govt. Subsidy (₹)</label>
                  <input type="number" name="govSubsidy" value={data.govSubsidy} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold">₹{data.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax ({data.taxRate}%)</span>
                  <span className="font-semibold">₹{data.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-blue-600">₹{data.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Less Subsidy</span>
                  <span>- ₹{data.govSubsidy.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2 border-t-2 border-slate-200 text-slate-900">
                  <span>Net Payable</span>
                  <span>₹{data.netPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Scope of Work */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <ClipboardList size={20} />
              <h2 className="font-bold text-lg">Scope of Work Matrix</h2>
            </div>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase text-[10px]">Description</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase text-[10px] w-24">KN PowerGen</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase text-[10px] w-24">Client</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.scopeOfWork.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-700">{item.description}</td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={item.knResponsibility} 
                          onChange={() => toggleScope(idx, 'knResponsibility')}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={item.clientResponsibility} 
                          onChange={() => toggleScope(idx, 'clientResponsibility')}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bank & Terms */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Building2 size={20} />
              <h2 className="font-bold text-lg">Bank & Terms</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Bank Details</h3>
                <div className="grid grid-cols-1 gap-3">
                  <input type="text" name="bankName" placeholder="Bank Name" value={data.bankName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                  <input type="text" name="accNumber" placeholder="Account Number" value={data.accNumber} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                  <input type="text" name="ifscCode" placeholder="IFSC Code" value={data.ifscCode} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Terms Summary</h3>
                <div className="grid grid-cols-1 gap-3">
                  <input type="text" name="paymentTerms" placeholder="Payment Terms" value={data.paymentTerms} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                  <input type="text" name="completionDays" placeholder="Completion Days" value={data.completionDays} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Signatory */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Settings size={20} />
              <h2 className="font-bold text-lg">Authorized Signatory</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Name</label>
                <input type="text" name="signatoryName" value={data.signatoryName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Designation</label>
                <input type="text" name="signatoryDesignation" value={data.signatoryDesignation} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
              </div>
            </div>
          </section>
        </div>

        {/* Preview Section */}
        <div className={`lg:col-span-5 sticky top-28 h-[calc(100vh-140px)] overflow-y-auto bg-slate-200 rounded-2xl p-4 shadow-inner print:block print:static print:h-auto print:p-0 print:bg-white ${activeTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-[15mm] origin-top scale-100 lg:scale-[0.85] xl:scale-100 transition-transform print:shadow-none print:m-0 print:p-0 print:scale-100" id="printable-document">
            <QuotationTemplate data={data} />
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          #printable-document { 
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: none !important;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}} />
    </div>
  );
}

function KNLogo() {
  return (
    <div className="flex justify-center mb-2">
      <img src="/logo.png" alt="KN PowerGen Logo" className="max-w-full" style={{maxHeight: '80px', objectFit: 'contain'}} />
    </div>
  );
}

function QuotationTemplate({ data }: { data: QuotationData }) {
  return (
    <div className="document-container text-[12pt] leading-tight text-black font-sans bg-white">
      {/* PAGE 1 */}
      <div className="min-h-[297mm] pl-[8mm] pr-[12mm] pt-[8mm] pb-[10mm] flex flex-col print:page-break-after-always">
        {/* Header */}
        <div className="flex flex-col items-center justify-center border-b border-slate-300 pb-4 mb-6">
          <KNLogo />
          <p className="text-[11pt] font-bold text-[#002E5D] text-center mt-2">
            D.No. 8-199, Mallayapeta, Katheru, Rajahmundry, East Godavari, Andhra Pradesh – 533105
          </p>
          <p className="text-[10pt] font-bold text-[#002E5D] text-center mt-1">
            GST NO: {data.gstNumber}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between mb-8 font-medium">
          <div>QUOT NO: {data.quoteNo}</div>
          <div>Date: {new Date(data.date).toLocaleDateString('en-GB').replace(/\//g, '.')}</div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-[14pt] font-bold underline decoration-1 underline-offset-4 uppercase">QUOTATION</h2>
        </div>

        {/* Customer Details */}
        <div className="space-y-4 mb-8 uppercase">
          <div className="flex gap-2">
            <span className="font-bold w-24">NAME :</span>
            <span className="flex-1">{data.customerName}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold w-24">ADDRESS :</span>
            <span className="flex-1">{data.customerAddress}</span>
          </div>
        </div>

        {/* System Size */}
        <div className="font-bold mb-4 uppercase">
          SYSTEM SIZE: {data.systemSize}
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse border border-black mb-8">
          <thead>
            <tr className="uppercase font-bold text-[11pt]">
              <th className="border border-black p-2 text-left w-[60%]">ITEM & DESCRIPTION</th>
              <th className="border border-black p-2 text-center w-32">UNIT RATE</th>
              <th className="border border-black p-2 text-center w-24">QTY (KW)</th>
              <th className="border border-black p-2 text-center w-32">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-black p-2 align-top min-h-[120px]">
                  <div className="uppercase mb-1">{item.description}</div>
                  <div className="text-[10pt]">{data.panelWattage} * {data.numPanels} NO'S</div>
                </td>
                <td className="border border-black p-2 align-top text-center">
                  {item.unitRate.toLocaleString('en-IN')}/-
                </td>
                <td className="border border-black p-2 align-top text-center">
                  {item.qty}
                </td>
                <td className="border border-black p-2 align-top text-right">
                  {item.amount.toLocaleString('en-IN')}/-
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-black p-2 uppercase" colSpan={3}>TOTAL (Tax inclusive)</td>
              <td className="border border-black p-2 text-right">Rs.{data.totalAmount.toLocaleString('en-IN')}/-</td>
            </tr>
          </tbody>
        </table>

        {/* Bank Details */}
        <div className="mt-2 pt-2">
          <h3 className="font-bold underline mb-2 uppercase text-[11pt]">OUT BANK DETAILS:</h3>
          <div className="grid grid-cols-[140px_1fr] gap-y-1 uppercase text-[10pt]">
            <div className="font-bold">BANK NAME</div>
            <div>: {data.bankName}</div>
            <div className="font-bold">COMPANY NAME</div>
            <div>: {data.accHolderName}</div>
            <div className="font-bold">ACCOUNT NUMBER</div>
            <div>: {data.accNumber}</div>
            <div className="font-bold">IFSC CODE</div>
            <div>: {data.ifscCode}</div>
            <div className="font-bold">BRANCH</div>
            <div>: {data.branch}</div>
          </div>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className="min-h-[297mm] pl-[8mm] pr-[12mm] pt-[8mm] pb-[10mm] flex flex-col print:page-break-after-always">
        <div className="mb-12">
          <h3 className="font-bold uppercase mb-6">MOUNTING STRUCTURE DETAILS:</h3>
          <div className="grid grid-cols-[220px_1fr] gap-y-4 text-[12pt]">
            <div>Type</div>
            <div>{data.structureType}</div>
            <div>Wind speed resistance</div>
            <div>{data.windSpeed}</div>
            <div>Warranty</div>
            <div>{data.structureWarranty}</div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-medium mb-4">Scope of work</h3>
          <table className="w-full text-[12pt]">
            <thead>
              <tr className="font-bold">
                <th className="text-left py-2 w-[55%]">Description</th>
                <th className="text-center py-2 uppercase text-[10pt]">KN POWERGEN</th>
                <th className="text-center py-2 w-24">Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent">
              {data.scopeOfWork.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1.5 pr-4">{item.description}</td>
                  <td className="text-center py-1.5 font-bold">{item.knResponsibility ? '*' : ''}</td>
                  <td className="text-center py-1.5 font-bold">{item.clientResponsibility ? '*' : ''}</td>
                </tr>
              ))}
              <tr>
                <td className="py-1.5 pr-4">Name Chart in Electricity bill/Phase change/Load enhancement etc.</td>
                <td className="text-center py-1.5 font-bold">Extra</td>
                <td className="text-center py-1.5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-24 mb-12">
          <div className="text-center">
            <p className="font-bold uppercase tracking-wider">AUTHORISED SIGNATORY</p>
          </div>
        </div>
      </div>

      {/* PAGE 3 */}
      <div className="min-h-[297mm] pl-[8mm] pr-[12mm] pt-[8mm] pb-[10mm] flex flex-col">
        <div className="mb-12">
          <h3 className="font-bold mb-4">Terms and Conditions</h3>
          <p className="font-medium mb-2">Payment forms:</p>
          <ul className="list-none space-y-1 mb-6">
            {data.paymentTerms.split(',').map((term, i) => (
              <li key={i}>• {term.trim()}</li>
            ))}
          </ul>
          
          <div className="space-y-6 text-[12pt]">
            <div className="grid grid-cols-[40px_1fr] gap-2">
              <div className="font-bold">I.</div>
              <p>In case the system Installation requires components or quantities beyond what is Included In the proposal, the prices may change. The customer will be informed In advance or the same.</p>
            </div>
            <div className="grid grid-cols-[40px_1fr] gap-2">
              <div className="font-bold">II.</div>
              <p>Project execution time line will begin after advance receipt or feasibility approval, whichever Is later.</p>
            </div>
            <div className="grid grid-cols-[40px_1fr] gap-2">
              <div className="font-bold">III.</div>
              <p>Final commission in got the project depends on supply of net meter by the local DISCOM</p>
            </div>
            <div className="grid grid-cols-[40px_1fr] gap-2">
              <div className="font-bold">IV.</div>
              <p>Project Completion Duration: {data.completionDays} days</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="font-bold mb-4">Customer Payment:</h3>
          <div className="grid grid-cols-[220px_1fr] gap-y-2 text-[12pt]">
            <div className="font-bold">• Total Payment</div>
            <div>: Rs.{data.totalAmount.toLocaleString('en-IN')}/-</div>
            <div className="font-bold">• Subsidy from Gov</div>
            <div>: {data.govSubsidy.toLocaleString('en-IN')}</div>
            <div className="font-bold">• Net price of customer</div>
            <div className="font-bold">: {data.netPrice.toLocaleString('en-IN')}/.</div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="font-bold uppercase mb-4">SOLAR PV MODULE DETAILS:</h3>
          <div className="grid grid-cols-[220px_1fr] gap-y-2 text-[12pt]\">
            <div className="font-bold">• Manufacturer</div>
            <div className="uppercase">: {data.moduleManufacturer}</div>
            <div className="font-bold">• Wattage of each module</div>
            <div>: {data.moduleWattage}</div>
            <div className="font-bold">• Warranty</div>
            <div className="italic">: {data.moduleWarranty}</div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="font-bold uppercase mb-4">SOLARGTI DETAILS:</h3>
          <div className="grid grid-cols-[220px_1fr] gap-y-2 text-[12pt]">
            <div className="font-bold">• Marketed by</div>
            <div className="uppercase">: {data.inverterManufacturer}</div>
            <div className="font-bold">• Warranty</div>
            <div>: {data.inverterWarranty}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center text-[9pt] text-slate-400 border-t border-slate-100">
          <p>Delivering Sustainable Energy Solutions</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .document-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1a1a1a;
        }
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
          }
          .document-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}} />
    </div>
  );
}
