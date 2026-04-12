import { useState, useRef } from 'react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Receipt, Trash2, Pencil, Image } from 'lucide-react';
import { format, startOfDay, isAfter } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { BillingRecord } from '@/types';
import { toast } from 'sonner';
import { useFilePickerDialogGuard } from '@/hooks/useFilePickerDialogGuard';
import { normalizeImageDataUrl } from '@/lib/imageUtils';

const emptyBill = (): Partial<BillingRecord> => ({
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  hospitalName: '',
  description: '',
  receiptImage: '',
});

export default function Billing() {
  const { selectedChild, billing, addBilling, updateBilling, deleteBilling } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BillingRecord | null>(null);
  const [form, setForm] = useState<Partial<BillingRecord>>(emptyBill());
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { pickingFile, beforePick, afterPick } = useFilePickerDialogGuard();

  if (!selectedChild) return <p className="text-muted-foreground text-center py-20">Please select or add a child first.</p>;

  const childBills = billing
    .filter(b => b.childId === selectedChild.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = childBills.reduce((s, b) => s + b.amount, 0);

  const resetDialog = () => {
    setEditing(null);
    setForm(emptyBill());
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = () => {
    if (!form.hospitalName || !form.amount) { toast.error('Hospital and amount are required.'); return; }
    if (editing) {
      updateBilling({ ...editing, ...form } as BillingRecord);
      toast.success('Updated!');
    } else {
      addBilling({
        ...form,
        id: crypto.randomUUID(),
        childId: selectedChild.id,
        createdAt: new Date().toISOString(),
      } as BillingRecord);
      toast.success('Bill added!');
    }
    setOpen(false);
    resetDialog();
  };

  const patchForm = (key: string, val: unknown) => setForm(p => ({ ...p, [key]: val }));

  const triggerFilePick = () => {
    beforePick();
    fileRef.current?.click();
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    afterPick();
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Receipt image must be under 5 MB');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const raw = reader.result;
      if (typeof raw !== 'string') return;
      try {
        const { data } = await normalizeImageDataUrl(raw, file.name);
        patchForm('receiptImage', data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not process this image.');
      }
      input.value = '';
    };
    reader.readAsDataURL(file);
  };

  const blockCloseWhilePicking = (e: Event) => {
    if (pickingFile.current) e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold">Billing & Receipts</h1>
          <p className="text-muted-foreground">Total spent: <span className="font-bold text-foreground">₹{total.toLocaleString()}</span></p>
        </div>
        <Dialog
          open={open}
          onOpenChange={o => {
            if (!o && pickingFile.current) return;
            setOpen(o);
            if (!o) resetDialog();
          }}
        >
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Bill</Button></DialogTrigger>
          <DialogContent
            onFocusOutside={blockCloseWhilePicking}
            onPointerDownOutside={blockCloseWhilePicking}
          >
            <DialogHeader><DialogTitle className="font-display">{editing ? 'Edit' : 'Add'} Bill</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bill-date">Date</Label>
                <DatePicker
                  id="bill-date"
                  value={form.date || ''}
                  onChange={(v) => patchForm('date', v)}
                  disabled={(d) => isAfter(startOfDay(d), startOfDay(new Date()))}
                />
              </div>
              <div><Label>Hospital *</Label><Input value={form.hospitalName || ''} onChange={e => patchForm('hospitalName', e.target.value)} /></div>
              <div><Label>Amount (₹) *</Label><Input type="number" value={form.amount || ''} onChange={e => patchForm('amount', parseFloat(e.target.value) || 0)} /></div>
              <div><Label>Description</Label><Textarea value={form.description || ''} onChange={e => patchForm('description', e.target.value)} /></div>

              <div className="space-y-2">
                <Label>Receipt image</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  className="hidden"
                  onChange={handleReceiptUpload}
                />
                {form.receiptImage ? (
                  <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
                    <img
                      src={form.receiptImage}
                      alt="Receipt preview"
                      className="max-h-48 w-full object-contain bg-background"
                    />
                    <div className="border-t border-border px-3 py-2 flex gap-2 justify-end">
                      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={triggerFilePick}>
                        <Image className="h-4 w-4" /> Replace
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => patchForm('receiptImage', '')}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" variant="outline" className="w-full gap-2" onClick={triggerFilePick}>
                    <Image className="h-4 w-4" /> Upload receipt photo
                  </Button>
                )}
              </div>

              <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Add Bill'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {childBills.length === 0 ? (
        <div className="text-center py-20">
          <Receipt className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No billing records yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {childBills.map(b => (
            <Card key={b.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-display">{b.hospitalName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{format(new Date(b.date), 'PPP')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">₹{b.amount.toLocaleString()}</span>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(b); setForm({ ...b, receiptImage: b.receiptImage || '' }); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { deleteBilling(b.id); toast.success('Deleted.'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {b.description && <p className="text-sm">{b.description}</p>}
                {b.receiptImage && (
                  <img
                    src={b.receiptImage}
                    alt="Receipt"
                    className="max-w-md max-h-40 rounded-lg border border-border object-contain bg-muted/30 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setPreviewImg(b.receiptImage!)}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!previewImg} onOpenChange={() => setPreviewImg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Receipt</DialogTitle></DialogHeader>
          {previewImg && <img src={previewImg} alt="Receipt" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
