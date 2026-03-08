import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Pencil, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { HospitalVisit } from '@/types';
import { toast } from 'sonner';

const emptyVisit = (): Partial<HospitalVisit> => ({
  date: new Date().toISOString().split('T')[0], hospitalName: '', doctorName: '', reason: '', description: '',
});

export default function Visits() {
  const { selectedChild, visits, addVisit, updateVisit, deleteVisit } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HospitalVisit | null>(null);
  const [form, setForm] = useState<Partial<HospitalVisit>>(emptyVisit());
  const [search, setSearch] = useState('');

  if (!selectedChild) return <p className="text-muted-foreground text-center py-20">Please select or add a child first.</p>;

  const childVisits = visits
    .filter(v => v.childId === selectedChild.id)
    .filter(v => !search || v.reason.toLowerCase().includes(search.toLowerCase()) || v.hospitalName.toLowerCase().includes(search.toLowerCase()) || v.doctorName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSave = () => {
    if (!form.date || !form.hospitalName || !form.reason) {
      toast.error('Date, hospital, and reason are required.');
      return;
    }
    if (editing) {
      updateVisit({ ...editing, ...form } as HospitalVisit);
      toast.success('Visit updated!');
    } else {
      addVisit({ ...form, id: crypto.randomUUID(), childId: selectedChild.id, createdAt: new Date().toISOString() } as HospitalVisit);
      toast.success('Visit added!');
    }
    setOpen(false); setEditing(null); setForm(emptyVisit());
  };

  const openEdit = (v: HospitalVisit) => { setEditing(v); setForm(v); setOpen(true); };
  const set = (key: string, val: string | number) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-display font-bold">Hospital Visits</h1>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(emptyVisit()); } }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Visit</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? 'Edit Visit' : 'New Visit'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Date *</Label><Input type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} /></div>
              <div><Label>Hospital / Clinic *</Label><Input value={form.hospitalName || ''} onChange={e => set('hospitalName', e.target.value)} /></div>
              <div><Label>Doctor Name</Label><Input value={form.doctorName || ''} onChange={e => set('doctorName', e.target.value)} /></div>
              <div><Label>Reason *</Label><Input value={form.reason || ''} onChange={e => set('reason', e.target.value)} placeholder="e.g. Routine checkup" /></div>
              <div><Label>Description</Label><Textarea value={form.description || ''} onChange={e => set('description', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Weight (kg)</Label><Input type="number" step="0.01" value={form.weight || ''} onChange={e => set('weight', parseFloat(e.target.value) || 0)} /></div>
                <div><Label>Height (cm)</Label><Input type="number" step="0.1" value={form.height || ''} onChange={e => set('height', parseFloat(e.target.value) || 0)} /></div>
                <div><Label>Head Circ. (cm)</Label><Input type="number" step="0.1" value={form.headCircumference || ''} onChange={e => set('headCircumference', parseFloat(e.target.value) || 0)} /></div>
                <div><Label>Temp (°F)</Label><Input type="number" step="0.1" value={form.temperature || ''} onChange={e => set('temperature', parseFloat(e.target.value) || 0)} /></div>
              </div>
              <div><Label>Additional Notes</Label><Textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Add Visit'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Input placeholder="Search visits..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />

      {childVisits.length === 0 ? (
        <div className="text-center py-20">
          <Stethoscope className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No visits recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {childVisits.map(v => (
            <Card key={v.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-display">{v.reason}</CardTitle>
                  <p className="text-sm text-muted-foreground">{v.hospitalName} · Dr. {v.doctorName} · {format(new Date(v.date), 'PPP')}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { deleteVisit(v.id); toast.success('Deleted.'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                {v.description && <p className="text-sm mb-2">{v.description}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {v.weight && <span>⚖️ {v.weight} kg</span>}
                  {v.height && <span>📏 {v.height} cm</span>}
                  {v.headCircumference && <span>🧠 {v.headCircumference} cm</span>}
                  {v.temperature && <span>🌡️ {v.temperature}°F</span>}
                </div>
                {v.notes && <p className="text-xs text-muted-foreground mt-2 italic">{v.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
