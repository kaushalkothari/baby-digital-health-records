import { useState } from 'react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Receipt, Trash2, Pencil } from 'lucide-react';
import { format, startOfDay, isAfter } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { BillingRecord } from '@/types';
import { toast } from 'sonner';

const emptyBill = (): Partial<BillingRecord> => ({
  date: new Date().toISOString().split('T')[0], amount: 0, hospitalName: '', description: '',
});

export default function Billing() {
  const { selectedChild, billing, addBilling, updateBilling, deleteBilling } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BillingRecord | null>(null);
  const [form, setForm] = useState<Partial<BillingRecord>>(emptyBill());

  if (!selectedChild) return <p className="text-muted-foreground text-center py-20">Please select or add a child first.</p>;

  const childBills = billing
    .filter(b => b.childId === selectedChild.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = childBills.reduce((s, b) => s + b.amount, 0);

  const handleSave = () => {
    if (!form.hospitalName || !form.amount) { toast.error('Hospital and amount are required.'); return; }
    if (editing) {
      updateBilling({ ...editing, ...form } as BillingRecord);
      toast.success('Updated!');
    } else {
      addBilling({ ...form, id: crypto.randomUUID(), childId: selectedChild.id, createdAt: new Date().toISOString() } as BillingRecord);
      toast.success('Bill added!');
    }
    setOpen(false); setEditing(null); setForm(emptyBill());
  };

  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold">Billing & Receipts</h1>
          <p className="text-muted-foreground">Total spent: <span className="font-bold text-foreground">₹{total.toLocaleString()}</span></p>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(emptyBill()); } }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Bill</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">{editing ? 'Edit' : 'Add'} Bill</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bill-date">Date</Label>
                <DatePicker
                  id="bill-date"
                  value={form.date || ''}
                  onChange={(v) => set('date', v)}
                  disabled={(d) => isAfter(startOfDay(d), startOfDay(new Date()))}
                />
              </div>
              <div><Label>Hospital *</Label><Input value={form.hospitalName || ''} onChange={e => set('hospitalName', e.target.value)} /></div>
              <div><Label>Amount (₹) *</Label><Input type="number" value={form.amount || ''} onChange={e => set('amount', parseFloat(e.target.value) || 0)} /></div>
              <div><Label>Description</Label><Textarea value={form.description || ''} onChange={e => set('description', e.target.value)} /></div>
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
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(b); setForm(b); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { deleteBilling(b.id); toast.success('Deleted.'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              {b.description && <CardContent><p className="text-sm">{b.description}</p></CardContent>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
