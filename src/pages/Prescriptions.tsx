import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/lib/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pill, Trash2, Pencil, Image, X } from 'lucide-react';
import { format, startOfDay, isAfter, isBefore, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { Prescription, Medicine } from '@/types';
import { toast } from 'sonner';
import { useFilePickerDialogGuard } from '@/hooks/useFilePickerDialogGuard';
import { normalizeImageDataUrl } from '@/lib/imageUtils';
import {
  MAX_IMAGE_PICK_BYTES,
  validateClientDataUrl,
  validatePickedFile,
} from '@/lib/security/uploads';
import { medsFromRx } from '@/lib/documents/linkedDocuments';
import { useHighlightScroll } from '@/hooks/useHighlightParam';
import { cn } from '@/lib/utils';

const emptyMedicine = (): Medicine => ({
  id: crypto.randomUUID(), name: '', dosage: '', frequency: '', duration: '',
});

const emptyRx = (): Partial<Prescription> & { medicines: Medicine[] } => ({
  medicines: [emptyMedicine()],
  prescribingDoctor: '',
  date: new Date().toISOString().split('T')[0],
  active: true,
  notes: '',
  prescriptionImage: '',
});

export default function Prescriptions() {
  const { selectedChild, prescriptions, addPrescription, updatePrescription, deletePrescription } = useApp();
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get('highlight');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [form, setForm] = useState<Partial<Prescription> & { medicines: Medicine[] }>(emptyRx());
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [detailRxId, setDetailRxId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { pickingFile, beforePick, afterPick } = useFilePickerDialogGuard();

  const childRx = useMemo(() => {
    if (!selectedChild) return [];
    const from = dateFrom?.trim() || '';
    const to = dateTo?.trim() || '';
    const rangeStart = from && to && from > to ? to : from;
    const rangeEnd = from && to && from > to ? from : to;

    const q = search.trim().toLowerCase();

    return prescriptions
      .filter((p) => p.childId === selectedChild.id)
      .filter((p) => {
        if (rangeStart && p.date < rangeStart) return false;
        if (rangeEnd && p.date > rangeEnd) return false;
        return true;
      })
      .filter((p) => {
        if (!q) return true;
        const meds = medsFromRx(p);
        const hay = [
          p.prescribingDoctor,
          p.notes,
          ...meds.flatMap((m) => [m.name, m.dosage, m.frequency, m.duration]),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedChild, prescriptions, dateFrom, dateTo, search]);

  const highlightReady = Boolean(highlight && childRx.some((p) => p.id === highlight));
  useHighlightScroll(highlight, highlightReady && highlight ? `rx-${highlight}` : null, highlightReady);

  useEffect(() => {
    if (!selectedChild) {
      setDetailRxId(null);
      return;
    }
    if (detailRxId && !childRx.some((p) => p.id === detailRxId)) {
      setDetailRxId(null);
    }
  }, [selectedChild, childRx, detailRxId]);

  if (!selectedChild) return <p className="text-muted-foreground text-center py-20">Please select or add a child first.</p>;

  const today = startOfDay(new Date());
  const setRange = (from: Date, to: Date) => {
    const a = startOfDay(from);
    const b = startOfDay(to);
    const start = isBefore(a, b) ? a : b;
    const end = isBefore(a, b) ? b : a;
    setDateFrom(format(start, 'yyyy-MM-dd'));
    setDateTo(format(end, 'yyyy-MM-dd'));
  };

  const detailRx = detailRxId ? childRx.find((p) => p.id === detailRxId) ?? null : null;
  const detailMeds = detailRx ? medsFromRx(detailRx) : [];
  const detailTitle = detailRx
    ? detailMeds.length === 1
      ? detailMeds[0].name
      : `${detailMeds.length} medicines`
    : '';

  const resetDialog = () => {
    setEditing(null);
    setForm(emptyRx());
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = () => {
    const validMeds = form.medicines.filter(m => m.name.trim());
    if (validMeds.length === 0) { toast.error('At least one medicine name is required.'); return; }
    const rxData = { ...form, medicines: validMeds };
    if (editing) {
      updatePrescription({ ...editing, ...rxData } as Prescription);
      toast.success('Updated!');
    } else {
      addPrescription({
        ...rxData,
        id: crypto.randomUUID(),
        childId: selectedChild.id,
        createdAt: new Date().toISOString(),
      } as Prescription);
      toast.success('Prescription added!');
    }
    setOpen(false);
    resetDialog();
  };

  const patchForm = (key: string, val: unknown) => setForm(p => ({ ...p, [key]: val }));

  const updateMedicine = (idx: number, key: keyof Medicine, val: string) => {
    setForm(p => {
      const meds = [...p.medicines];
      meds[idx] = { ...meds[idx], [key]: val };
      return { ...p, medicines: meds };
    });
  };

  const addMedicine = () => setForm(p => ({ ...p, medicines: [...p.medicines, emptyMedicine()] }));
  const removeMedicine = (idx: number) => {
    if (form.medicines.length <= 1) return;
    setForm(p => ({ ...p, medicines: p.medicines.filter((_, i) => i !== idx) }));
  };

  const triggerFilePick = () => {
    beforePick();
    fileRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    afterPick();
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    const pickErr = validatePickedFile(file, { maxBytes: MAX_IMAGE_PICK_BYTES, allowPdf: false });
    if (pickErr) {
      toast.error(pickErr);
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const raw = reader.result;
      if (typeof raw !== 'string') return;
      try {
        const { data } = await normalizeImageDataUrl(raw, file.name);
        const urlErr = validateClientDataUrl(data, MAX_IMAGE_PICK_BYTES, { allowPdf: false });
        if (urlErr) {
          toast.error(urlErr);
          return;
        }
        setForm(prev => ({ ...prev, prescriptionImage: data }));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not process this image.');
      }
      input.value = '';
    };
    reader.readAsDataURL(file);
  };

  const openEditRx = (rx: Prescription) => {
    setEditing(rx);
    setForm({ ...rx, medicines: medsFromRx(rx) });
    setOpen(true);
  };

  const blockCloseWhilePicking = (e: Event) => {
    if (pickingFile.current) e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-display font-bold">Prescriptions</h1>
        <Dialog
          open={open}
          onOpenChange={o => {
            if (!o && pickingFile.current) return;
            setOpen(o);
            if (!o) resetDialog();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Prescription</Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-lg max-h-[90vh] overflow-y-auto"
            onFocusOutside={blockCloseWhilePicking}
            onPointerDownOutside={blockCloseWhilePicking}
          >
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? 'Edit' : 'Add'} Prescription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Medicines list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Medicines</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMedicine} className="gap-1">
                    <Plus className="h-3 w-3" /> Add Medicine
                  </Button>
                </div>
                {form.medicines.map((med, idx) => (
                  <div key={med.id} className="rounded-lg border border-border p-3 space-y-2 relative bg-muted/30">
                    {form.medicines.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeMedicine(idx)}>
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    <div className="text-xs font-medium text-muted-foreground">Medicine {idx + 1}</div>
                    <Input placeholder="Medicine name *" value={med.name} onChange={e => updateMedicine(idx, 'name', e.target.value)} />
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="Dosage" value={med.dosage} onChange={e => updateMedicine(idx, 'dosage', e.target.value)} />
                      <Input placeholder="Frequency" value={med.frequency} onChange={e => updateMedicine(idx, 'frequency', e.target.value)} />
                      <Input placeholder="Duration" value={med.duration} onChange={e => updateMedicine(idx, 'duration', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>

              <div><Label>Prescribing Doctor</Label><Input value={form.prescribingDoctor || ''} onChange={e => patchForm('prescribingDoctor', e.target.value)} /></div>
              <div className="space-y-2">
                <Label htmlFor="rx-date">Date</Label>
                <DatePicker
                  id="rx-date"
                  value={form.date || ''}
                  onChange={(v) => patchForm('date', v)}
                  disabled={(d) => isAfter(startOfDay(d), startOfDay(new Date()))}
                />
              </div>
              <div><Label>Notes</Label><Textarea value={form.notes || ''} onChange={e => patchForm('notes', e.target.value)} /></div>

              {/* Prescription Image — hidden input + preview */}
              <div className="space-y-2">
                <Label>Prescription Image</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {form.prescriptionImage ? (
                  <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
                    <img
                      src={form.prescriptionImage}
                      alt="Prescription preview"
                      className="max-h-52 w-full object-contain bg-background"
                    />
                    <div className="border-t border-border px-3 py-2 flex gap-2 justify-end">
                      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={triggerFilePick}>
                        <Image className="h-4 w-4" /> Replace
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => patchForm('prescriptionImage', '')}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" variant="outline" className="w-full gap-2" onClick={triggerFilePick}>
                    <Image className="h-4 w-4" /> Upload Image
                  </Button>
                )}
              </div>

              <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Add'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="w-full sm:max-w-sm">
          <Label htmlFor="rx-search" className="text-xs text-muted-foreground">Search</Label>
          <Input
            id="rx-search"
            placeholder="Search prescriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setRange(today, today)}>
            Today
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setRange(subDays(today, 6), today)}>
            Last 7 days
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setRange(subDays(today, 29), today)}>
            Last 30 days
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setRange(startOfMonth(today), endOfMonth(today))}>
            This month
          </Button>
          {(dateFrom || dateTo || search.trim()) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setDateFrom('');
                setDateTo('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
        <div className="w-full sm:w-auto sm:min-w-[220px]">
          <Label htmlFor="rx-date-from" className="text-xs text-muted-foreground">From</Label>
          <DatePicker
            id="rx-date-from"
            value={dateFrom}
            onChange={setDateFrom}
            allowClear
            disabled={(d) => {
              const day = startOfDay(d);
              if (isAfter(day, today)) return true;
              if (dateTo) return isAfter(day, startOfDay(new Date(dateTo)));
              return false;
            }}
          />
        </div>
        <div className="w-full sm:w-auto sm:min-w-[220px]">
          <Label htmlFor="rx-date-to" className="text-xs text-muted-foreground">To</Label>
          <DatePicker
            id="rx-date-to"
            value={dateTo}
            onChange={setDateTo}
            allowClear
            disabled={(d) => {
              const day = startOfDay(d);
              if (isAfter(day, today)) return true;
              if (dateFrom) return isBefore(day, startOfDay(new Date(dateFrom)));
              return false;
            }}
          />
        </div>
      </div>

      {childRx.length === 0 ? (
        <div className="text-center py-20">
          <Pill className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No prescriptions recorded yet.</p>
        </div>
      ) : (
        <div className="relative space-y-4">
          {childRx.map(rx => {
            const meds = medsFromRx(rx);
            return (
              <Card
                key={rx.id}
                id={`rx-${rx.id}`}
                className={cn(
                  'cursor-pointer transition-[box-shadow,opacity] duration-200 hover:shadow-md',
                  !rx.active && 'opacity-60',
                )}
                onClick={() => setDetailRxId(rx.id)}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base font-display flex flex-wrap items-center gap-2">
                      <Pill className="h-4 w-4 text-primary" />
                      {meds.length === 1 ? meds[0].name : `${meds.length} Medicines`}
                      <Badge variant={rx.active ? 'default' : 'secondary'}>{rx.active ? 'Active' : 'Completed'}</Badge>
                    </CardTitle>
                    {meds.length === 1 ? (
                      <p className="text-sm text-muted-foreground">{meds[0].dosage} · {meds[0].frequency} · {meds[0].duration}</p>
                    ) : (
                      <div className="mt-1 space-y-0.5">
                        {meds.map((m, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{m.name}</span> — {m.dosage} · {m.frequency} · {m.duration}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => updatePrescription({ ...rx, active: !rx.active })}>
                        {rx.active ? 'Mark Done' : 'Reactivate'}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditRx(rx)} aria-label="Edit prescription">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          deletePrescription(rx.id);
                          toast.success('Deleted.');
                          setDetailRxId((id) => (id === rx.id ? null : id));
                        }}
                        aria-label="Delete prescription"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    {rx.prescriptionImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        title="View prescription image"
                        onClick={() => setPreviewImg(rx.prescriptionImage!)}
                      >
                        <Image className="h-4 w-4 shrink-0" />
                        View prescription image
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Dr. {rx.prescribingDoctor} · {format(new Date(rx.date), 'PP')}</p>
                  {rx.notes && <p className="text-xs text-muted-foreground mt-1 italic">{rx.notes}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Prescription detail (dimmed backdrop via Dialog overlay) */}
      <Dialog open={detailRx != null} onOpenChange={(o) => { if (!o) setDetailRxId(null); }}>
        <DialogContent className="max-w-2xl max-h-[min(90dvh,720px)] gap-0 p-0 sm:rounded-lg">
          {detailRx && (
            <>
              <div className="border-b border-border bg-muted/30 px-6 py-4 pr-14">
                <DialogHeader className="space-y-2 text-left">
                  <DialogTitle className="font-display text-xl leading-snug pr-2">{detailTitle}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Dr. {detailRx.prescribingDoctor || '—'} · {format(new Date(detailRx.date), 'PPP')}
                  </DialogDescription>
                  <div className="pt-1">
                    <Badge variant={detailRx.active ? 'default' : 'secondary'}>
                      {detailRx.active ? 'Active' : 'Completed'}
                    </Badge>
                  </div>
                </DialogHeader>
              </div>
              <div className="space-y-4 px-6 py-4">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Medicines
                  </h3>
                  <ul className="space-y-3">
                    {detailMeds.map((m) => (
                      <li
                        key={m.id}
                        className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                      >
                        <p className="font-medium text-foreground">{m.name}</p>
                        <p className="mt-1 text-muted-foreground text-xs sm:text-sm">
                          {m.dosage} · {m.frequency} · {m.duration}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                {detailRx.notes?.trim() && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Notes
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{detailRx.notes.trim()}</p>
                  </div>
                )}
                {detailRx.prescriptionImage && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Prescription image
                    </h3>
                    <button
                      type="button"
                      className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/20 text-left outline-none ring-offset-background transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onClick={() => setPreviewImg(detailRx.prescriptionImage!)}
                    >
                      <img
                        src={detailRx.prescriptionImage}
                        alt="Prescription attachment"
                        className="max-h-56 w-full object-contain bg-background"
                      />
                      <span className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-1 text-xs font-medium shadow-sm">
                        Tap to enlarge
                      </span>
                    </button>
                  </div>
                )}
              </div>
              <DialogFooter className="flex-col gap-2 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-between sm:space-x-0">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updatePrescription({ ...detailRx, active: !detailRx.active });
                      toast.success(detailRx.active ? 'Marked completed.' : 'Reactivated.');
                    }}
                  >
                    {detailRx.active ? 'Mark done' : 'Reactivate'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      setDetailRxId(null);
                      openEditRx(detailRx);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => setDetailRxId(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Full-screen image preview */}
      <Dialog open={!!previewImg} onOpenChange={() => setPreviewImg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Prescription Image</DialogTitle></DialogHeader>
          {previewImg && <img src={previewImg} alt="Prescription" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
