import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Receipt, X, Printer, Download, Dumbbell, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, paymentId }) => {
  const [receipt, setReceipt] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && paymentId) {
      setLoading(true);
      api.getPaymentReceipt(paymentId)
        .then((res) => setReceipt(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, paymentId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-modal-backdrop overflow-y-auto">
      <div className="animate-modal-card relative w-full max-w-xl bg-[#0F172A] border border-amber-500/40 rounded-3xl shadow-2xl p-6 my-8 text-slate-100">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 no-print">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-lg text-white font-display">Official Tax Invoice & Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        {loading || !receipt ? (
          <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
            Generating secure receipt...
          </div>
        ) : (
          <div id="printable-receipt" className="bg-[#090D15] border border-white/10 rounded-2xl p-6 shadow-inner text-slate-200">
            {/* Header branding */}
            <div className="flex items-start justify-between border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-slate-950 stroke-[3]" />
                  </div>
                  <h2 className="text-base font-black tracking-wider text-white font-display">
                    {receipt.gym.gym_name}
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-tight">
                  {receipt.gym.address}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Phone: {receipt.gym.phone} • Email: {receipt.gym.email}
                </p>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  PAID IN FULL
                </span>
                <p className="text-xs font-mono font-bold text-amber-400 mt-2">
                  {receipt.receipt_number}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Date: {formatDate(receipt.issued_at)}
                </p>
              </div>
            </div>

            {/* Billed To & Payment Meta */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-white/10 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Billed To (Member)</p>
                <p className="font-bold text-white text-sm mt-0.5">{receipt.member.full_name}</p>
                <p className="text-amber-300 font-mono text-[11px]">{receipt.member.member_code}</p>
                {receipt.member.phone && <p className="text-slate-400">{receipt.member.phone}</p>}
                {receipt.member.email && <p className="text-slate-400">{receipt.member.email}</p>}
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payment Details</p>
                <p className="font-semibold text-white capitalize mt-0.5">Method: {receipt.payment.payment_method}</p>
                <p className="text-[11px] text-slate-400 font-mono">Ref: {receipt.payment.transaction_reference}</p>
                <p className="text-[11px] text-slate-400">Processed by: {receipt.created_by}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[10px] uppercase tracking-wider text-left">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr>
                    <td className="py-2.5 font-medium text-white">
                      {receipt.breakdown.plan_name}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        Full gym facility & wellness access
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">
                      ₹{receipt.breakdown.subtotal.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal (Excl. GST):</span>
                <span>₹{receipt.breakdown.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST ({receipt.breakdown.tax_rate}%):</span>
                <span>₹{receipt.breakdown.tax_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-amber-400 pt-2 border-t border-white/10">
                <span>Total Amount Paid:</span>
                <span className="font-display">₹{receipt.breakdown.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-6 pt-4 border-t border-dashed border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Digitally Generated Receipt</span>
              </div>
              <span>Thank you for training with ApexFit Club</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
