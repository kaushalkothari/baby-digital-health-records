import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pill, Trash2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { Prescription } from '@/types';
import { toast } from 'sonner';

const emptyRx = (): Partial<Prescription> => ({
  medicineName: '', dosage: '', frequency: '', duration: '', prescribingDoctor: '',
  date: new Date().toISOString().split('T')[0], active: true, notes: '',
});

export default function Prescriptions() {
  const { selectedChild, prescriptions, addPrescription, updatePrescription, deletePrescription } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [form, setForm] = useState<Partial<Prescription>>(emptyRx());

  if (!selectedChild) return <p className="text-muted-foreground text-center py-20">Please select or add a child first.</p>;

  const childRx = prescriptions
    .filter(p => p.childId === selectedChild.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSave = () => {
    if (!form.medicineName || !form.dosage) { toast.error('Medicine name and dosage are required.'); return; }
    if (editing) {
      updatePrescription({ ...editing, ...form } as Prescription);
      toast.success('Updated!');
    } else {
      addPrescription({ ...form, id: crypto.randomUUID(), childId: selectedChild.id, createdAt: new Date().toISOString() } as Prescription);
      toast.success('Prescription added!');
    }
    setOpen(false); setEditing(null); setForm(emptyRx());
  };

  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-display font-bold">Prescriptions</h1>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(emptyRx()); } }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Prescription</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="font-display">{editing ? 'Edit' : 'Add'} Prescription</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Medicine *</Label><Input value={form.medicineName || ''} onChange={e => set('medicineName', e.target.value)} /></div>
              <div><Label>Dosage *</Label><Input value={form.dosage || ''} onChange={e => set('dosage', e.target.value)} placeholder="e.g. 2.5ml" /></div>
              <div><Label>Frequency</Label><Input value={form.frequency || ''} onChange={e => set('frequency', e.target.value)} placeholder="e.g. Twice daily" /></div>
              <div><Label>Duration</Label><Input value={form.duration || ''} onChange={e => set('duration', e.target.value)} placeholder="e.g. 5 days" /></div>
              <div><Label>Prescribing Doctor</Label><Input value={form.prescribingDoctor || ''} onChange={e => set('prescribingDoctor', e.target.value)} /></div>
              <div><Label>Date</Label><Input type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} /></div>
              <div><Label>Notes</Label><Textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Add'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {childRx.length === 0 ? (
        <div className="text-center py-20">
          <Pill className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No prescriptions recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {childRx.map(rx => (
            <Card key={rx.id} className={!rx.active ? 'opacity-60' : ''}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <Pill className="h-4 w-4 text-primary" /> {rx.medicineName}
                    <Badge variant={rx.active ? 'default' : 'secondary'}>{rx.active ? 'Active' : 'Completed'}</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{rx.dosage} · {rx.frequency} · {rx.duration}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => updatePrescription({ ...rx, active: !rx.active })}>
                    {rx.active ? 'Mark Done' : 'Reactivate'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(rx); setForm(rx); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { deletePrescription(rx.id); toast.success('Deleted.'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Dr. {rx.prescribingDoctor} · {format(new Date(rx.date), 'PP')}</p>
                {rx.notes && <p className="text-xs text-muted-foreground mt-1 italic">{rx.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
