import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Printer, Download, FileText, 
  User, Zap, Building2, CreditCard, ClipboardList, 
  Settings, Info, ChevronRight, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuotationData, ItemRow, ScopeItem } from './types';

const INITIAL_DATA: QuotationData = {
  documentType: 'QUOTATION',
  quoteNo: 'KN/2024/001',
  date: new Date().toISOString().split('T')[0],
  customerName: '',
  customerAddress: '',
  customerPhone: '',
  customerEmail: '',
  siteLocation: '',
  systemSize: '3KW On-Grid',
  systemType: 'On-Grid Solar PV System',
  roofType: 'RCC Concrete',
  numPanels: '6',
  panelWattage: '550W',
  inverterModel: '3KW Single Phase',
  netMetering: 'Yes',
  subsidyApplicable: 'Yes',
  items: [
    { id: '1', description: 'On-grid roof-top solar system containing panels, inverter, mounting structure, installation', unitRate: 150000, qty: 1, amount: 150000 }
  ],
  subtotal: 150000,
  taxRate: 0,
  taxAmount: 0,
  totalAmount: 150000,
  govSubsidy: 45000,
  netPrice: 105000,
  bankName: 'HDFC BANK',
  accHolderName: 'KN POWERGEN PVT LTD',
  accNumber: '50200012345678',
  ifscCode: 'HDFC0001234',
  branch: 'Hyderabad Main',
  structureType: 'Hot Dip Galvanized / Aluminum',
  windSpeed: '150 km/hr',
  structureWarranty: '10 Years',
  scopeOfWork: [
    { description: 'Supply of all components as per BOM', knResponsibility: true, clientResponsibility: false },
    { description: 'Installation of solar system up to main panel', knResponsibility: true, clientResponsibility: false },
    { description: 'Staircase/ladder access to roof', knResponsibility: false, clientResponsibility: true },
    { description: 'Civil works for structures', knResponsibility: true, clientResponsibility: false },
    { description: 'Earthing on non-concrete flooring', knResponsibility: true, clientResponsibility: false },
    { description: 'Internet access near inverter location', knResponsibility: false, clientResponsibility: true },
    { description: 'Testing & commissioning including net metering', knResponsibility: true, clientResponsibility: false },
    { description: 'Net metering & subsidy application process', knResponsibility: true, clientResponsibility: false },
  ],
  paymentTerms: '60% advance, 40% after installation',
  timeline: 'Project starts after advance receipt',
  completionDays: '15-20',
  warrantyTerms: 'As per manufacturer policy',
  moduleManufacturer: 'Waaree / Adani / Equivalent',
  moduleWattage: '550W Mono PERC',
  moduleWarranty: '25 Years Performance Warranty',
  inverterManufacturer: 'Solis / Growatt / Sungrow',
  inverterWarranty: '5-10 Years',
  signatoryName: 'K. Nageshwar Rao',
  signatoryDesignation: 'Managing Director'
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
    window.focus();
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Header - Hidden on Print */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            KN
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">KN PowerGen</h1>
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
    <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blue KN Background */}
      <path d="M10 15H35L50 45L65 15H90V85H65V55L50 85L35 55V85H10V15Z" fill="#002E5D" />
      {/* Yellow Bolt */}
      <path d="M45 15L32 50H42L35 80L62 42H52L65 15H45Z" fill="#FDB913" />
    </svg>
  );
}

function QuotationTemplate({ data }: { data: QuotationData }) {
  return (
    <div className="document-container text-[11pt] leading-tight text-slate-900 font-sans bg-white">
      {/* Page 1 Header */}
      <div className="flex items-center gap-6 mb-2">
        <div className="shrink-0">
          <KNLogo />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-[#004A99] tracking-tight">KN POWERGEN PVT LTD</h1>
          <p className="text-[10pt] text-slate-700 font-medium">
            Plot No. 123, Industrial Area, Phase-II, Hyderabad, Telangana - 500001
          </p>
        </div>
      </div>
      
      {/* Decorative Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#004A99] via-[#FDB913] to-[#004A99] mb-6"></div>

      {/* Meta Details */}
      <div className="flex justify-between mb-8 text-[11pt] font-medium">
        <p>QUOT NO: {data.quoteNo}</p>
        <p>Date: {new Date(data.date).toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-[14pt] font-bold underline decoration-1 underline-offset-4 uppercase">
          {data.documentType}
        </h2>
      </div>

      {/* Customer Info */}
      <div className="space-y-3 mb-8 text-[11pt]">
        <p><span className="font-bold">NAME :</span> {data.customerName || '—'}</p>
        <p><span className="font-bold">ADDRESS :</span> {data.customerAddress || '—'}</p>
        <p><span className="font-bold uppercase">SYSTEM SIZE:</span> {data.systemSize} ON GRID</p>
      </div>

      {/* Item Table */}
      <table className="w-full border-collapse mb-8 text-[11pt]">
        <thead>
          <tr className="uppercase font-bold">
            <th className="border border-slate-400 p-2 text-left">ITEM & DESCRIPTION</th>
            <th className="border border-slate-400 p-2 text-left w-32">UNIT RATE</th>
            <th className="border border-slate-400 p-2 text-left w-24">QTY (KW)</th>
            <th className="border border-slate-400 p-2 text-left w-32">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id}>
              <td className="border border-slate-400 p-2 align-top min-h-[100px]">
                <div className="font-medium uppercase">{item.description}</div>
              </td>
              <td className="border border-slate-400 p-2 align-top">
                {item.unitRate.toLocaleString()}/-
              </td>
              <td className="border border-slate-400 p-2 align-top text-center">
                {item.qty}
              </td>
              <td className="border border-slate-400 p-2 align-top text-right">
                {item.amount.toLocaleString()}/-
              </td>
            </tr>
          ))}
          {/* Empty rows to match screenshot height if needed */}
          <tr>
            <td className="border border-slate-400 p-2 h-12"></td>
            <td className="border border-slate-400 p-2"></td>
            <td className="border border-slate-400 p-2"></td>
            <td className="border border-slate-400 p-2"></td>
          </tr>
          <tr className="font-bold">
            <td className="border border-slate-400 p-2">TOTAL (Tax inclusive)</td>
            <td className="border border-slate-400 p-2"></td>
            <td className="border border-slate-400 p-2"></td>
            <td className="border border-slate-400 p-2 text-right">Rs.{data.totalAmount.toLocaleString()}/-</td>
          </tr>
        </tbody>
      </table>

      {/* Bank Details */}
      <div className="mb-12">
        <h3 className="font-bold underline mb-4 uppercase">OUT BANK DETAILS:</h3>
        <div className="grid grid-cols-[180px_1fr] gap-y-2 text-[11pt]">
          <span className="font-medium">BANK NAME</span> <span>: {data.bankName}</span>
          <span className="font-medium">COMPANY NAME</span> <span>: KN POWERGEN PVT LTD</span>
          <span className="font-medium">ACCOUNT NUMBER</span> <span>: {data.accNumber}</span>
          <span className="font-medium">IFSC CODE</span> <span>: {data.ifscCode}</span>
          <span className="font-medium">BRANCH</span> <span>: {data.branch}</span>
        </div>
      </div>

      {/* Page Break for Print */}
      <div className="print:page-break-after-always h-8"></div>

      {/* Page 2: Mounting Structure & Scope */}
      <div className="mb-12">
        <h3 className="font-bold uppercase mb-4">MOUNTING STRUCTURE DETAILS:</h3>
        <div className="grid grid-cols-[200px_1fr] gap-y-2 text-[11pt]">
          <span className="font-medium">Type</span> <span>{data.structureType}</span>
          <span className="font-medium">Wind speed resistance</span> <span>{data.windSpeed}</span>
          <span className="font-medium">Warranty</span> <span>{data.structureWarranty}</span>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="font-medium mb-4">Scope of work</h3>
        <table className="w-full text-[11pt]">
          <thead>
            <tr className="font-bold">
              <th className="text-left py-2">Description</th>
              <th className="text-center py-2 w-48 uppercase">KN POWERGEN</th>
              <th className="text-center py-2 w-32">Client</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {data.scopeOfWork.map((item, idx) => (
              <tr key={idx}>
                <td className="py-1.5 pr-4">{item.description}</td>
                <td className="text-center py-1.5">{item.knResponsibility ? '*' : ''}</td>
                <td className="text-center py-1.5">{item.clientResponsibility ? '*' : ''}</td>
              </tr>
            ))}
            <tr>
              <td className="py-1.5 pr-4">Name Chart in Electricity bill/Phase change/Load enhancement etc.</td>
              <td className="text-center py-1.5 font-medium">Extra</td>
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

      {/* Page Break for Print */}
      <div className="print:page-break-after-always h-8"></div>

      {/* Page 3: Terms & Payment */}
      <div className="mb-12">
        <h3 className="font-bold mb-4">Terms and Conditions</h3>
        <p className="font-medium mb-2">Payment forms:</p>
        <ul className="list-none space-y-2 mb-6">
          <li>• {data.paymentTerms.split(',')[0]}</li>
          <li>• {data.paymentTerms.split(',')[1] || ''}</li>
        </ul>
        <div className="space-y-4 text-[11pt]">
          <div className="flex gap-4">
            <span className="font-medium w-8">I.</span>
            <p>In case the system Installation requires components or quantities beyond what is Included In the proposal, the prices may change. The customer will be informed In advance or the same.</p>
          </div>
          <div className="flex gap-4">
            <span className="font-medium w-8">II.</span>
            <p>Project execution time line will begin after advance receipt or feasibility approval, whichever Is later.</p>
          </div>
          <div className="flex gap-4">
            <span className="font-medium w-8">III.</span>
            <p>Final commission in got the project depends on supply of net meter by the local DISCOM</p>
          </div>
          <div className="flex gap-4">
            <span className="font-medium w-8">IV.</span>
            <p>Project Completion Duration: {data.completionDays} days</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="font-bold mb-4">Customer Payment:</h3>
        <div className="grid grid-cols-[200px_1fr] gap-y-2 text-[11pt]">
          <span className="font-medium">• Total Payment</span> <span>: Rs.{data.totalAmount.toLocaleString()}/-</span>
          <span className="font-medium">• Subsidy from Gov</span> <span>: {data.govSubsidy.toLocaleString()}</span>
          <span className="font-medium">• Net price of customer</span> <span>: {data.netPrice.toLocaleString()}/.</span>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="font-bold uppercase mb-4">SOLAR PV MODULE DETAILS:</h3>
        <div className="grid grid-cols-[200px_1fr] gap-y-2 text-[11pt]">
          <span className="font-medium">• Manufacturer</span> <span>: {data.moduleManufacturer}</span>
          <span className="font-medium">• Wattage of each module</span> <span>: {data.moduleWattage}</span>
          <span className="font-medium">• Warranty</span> <span>: {data.moduleWarranty}</span>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="font-bold uppercase mb-4">SOLARGTI DETAILS:</h3>
        <div className="grid grid-cols-[200px_1fr] gap-y-2 text-[11pt]">
          <span className="font-medium">Marketed by</span> <span>: {data.inverterManufacturer}</span>
          <span className="font-medium">Warranty</span> <span>: {data.inverterWarranty}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-12 text-center text-[9pt] text-slate-400 border-t border-slate-100">
        <p>KN POWERGEN PVT LTD | Delivering Sustainable Energy Solutions</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .document-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1a1a1a;
        }
        @media print {
          .document-container {
            width: 210mm;
            min-height: 297mm;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}} />
    </div>
  );
}
