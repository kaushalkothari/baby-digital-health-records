import { useState } from 'react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Baby, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  format,
  differenceInMonths,
  differenceInDays,
  parseISO,
  isAfter,
  isBefore,
  startOfDay,
  subYears,
} from 'date-fns';
import { Child } from '@/types';
import { toast } from 'sonner';

const STANDARD_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

function isStandardBloodGroup(s: string | undefined): s is (typeof STANDARD_BLOOD_GROUPS)[number] {
  return !!s && STANDARD_BLOOD_GROUPS.includes(s as (typeof STANDARD_BLOOD_GROUPS)[number]);
}

/** Dropdown value when editing an existing child (custom types map to `other`). */
function bloodGroupDropdownFromSaved(bg: string | undefined): string | undefined {
  if (!bg?.trim()) return undefined;
  if (isStandardBloodGroup(bg)) return bg;
  return 'other';
}

const emptyChild = (): Partial<Child> => ({
  name: '',
  dateOfBirth: '',
  bloodGroup: '',
  notes: '',
});

const todayStart = () => startOfDay(new Date());
const minDobStart = () => startOfDay(subYears(new Date(), 30));

function formatGender(g: Child['gender']) {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

export default function Children() {
  const { children, addChild, updateChild, deleteChild, setSelectedChildId } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Child | null>(null);
  const [form, setForm] = useState<Partial<Child>>(emptyChild());
  /** Tracks dropdown selection so "Other" stays selected while the text field is still empty. */
  const [bloodGroupDropdown, setBloodGroupDropdown] = useState<string | undefined>(undefined);

  const handleSave = async () => {
    if (!form.name || !form.dateOfBirth || !form.gender) {
      toast.error('Name, date of birth, and gender are required.');
      return;
    }
    if (editing) {
      updateChild({ ...editing, ...form } as Child);
      toast.success('Child updated!');
    } else {
      const child: Child = { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as Child;
      const ok = await addChild(child);
      if (!ok) return;
      setSelectedChildId(child.id);
      toast.success('Child added!');
    }
    setOpen(false);
    setEditing(null);
    setForm(emptyChild());
  };

  const openEdit = (child: Child) => {
    setEditing(child);
    setForm(child);
    setBloodGroupDropdown(bloodGroupDropdownFromSaved(child.bloodGroup));
    setOpen(true);
  };

  const handleDelete = (child: Child) => {
    if (confirm(`Delete ${child.name} and all associated records?`)) {
      deleteChild(child.id);
      toast.success('Deleted.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Children</h1>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) {
              setEditing(null);
              setForm(emptyChild());
              setBloodGroupDropdown(undefined);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Child</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? 'Edit Child' : 'Add Child'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="child-name">Name *</Label>
                <Input
                  id="child-name"
                  autoComplete="name"
                  placeholder="Child's name"
                  value={form.name || ''}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-dob-trigger">Date of Birth *</Label>
                <DatePicker
                  id="child-dob-trigger"
                  value={form.dateOfBirth || ''}
                  onChange={(v) => setForm((p) => ({ ...p, dateOfBirth: v }))}
                  placeholder="Pick date of birth"
                  disabled={(d) =>
                    isAfter(startOfDay(d), todayStart()) || isBefore(startOfDay(d), minDobStart())
                  }
                  defaultMonth={form.dateOfBirth ? parseISO(form.dateOfBirth) : new Date()}
                  fromYear={new Date().getFullYear() - 30}
                  toYear={new Date().getFullYear()}
                />
                {/* <p className="text-xs text-muted-foreground">
                  Use the month and year labels at the top of the calendar to jump quickly. Future dates are disabled.
                </p> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-gender">Gender *</Label>
                <Select
                  value={form.gender}
                  onValueChange={v => setForm(p => ({ ...p, gender: v as Child['gender'] }))}
                >
                  <SelectTrigger id="child-gender">
                    <SelectValue placeholder="Choose one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-blood">Blood group</Label>
                <Select
                  value={bloodGroupDropdown}
                  onValueChange={(v) => {
                    setBloodGroupDropdown(v);
                    if (v === 'other') {
                      setForm((p) => ({
                        ...p,
                        bloodGroup: isStandardBloodGroup(p.bloodGroup) ? '' : p.bloodGroup || '',
                      }));
                    } else {
                      setForm((p) => ({ ...p, bloodGroup: v }));
                    }
                  }}
                >
                  <SelectTrigger id="child-blood">
                    <SelectValue placeholder="Choose blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {STANDARD_BLOOD_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {bloodGroupDropdown === 'other' && (
                  <Input
                    id="child-blood-other"
                    className="mt-2"
                    value={form.bloodGroup || ''}
                    onChange={(e) => setForm((p) => ({ ...p, bloodGroup: e.target.value }))}
                    placeholder="Enter blood group"
                    aria-label="Blood group (other)"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-notes">Notes</Label>
                <Textarea
                  id="child-notes"
                  value={form.notes || ''}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                />
              </div>
              <Button type="button" onClick={() => void handleSave()} className="w-full">
                {editing ? 'Update' : 'Add Child'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {children.length === 0 ? (
        <div className="text-center py-20">
          <Baby className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No children added yet. Click "Add Child" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map(child => {
            const ageMonths = differenceInMonths(new Date(), new Date(child.dateOfBirth));
            const ageDays = differenceInDays(new Date(), new Date(child.dateOfBirth));
            const ageText = ageMonths >= 1 ? `${ageMonths} month${ageMonths > 1 ? 's' : ''}` : `${ageDays} day${ageDays > 1 ? 's' : ''}`;
            return (
              <Card key={child.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedChildId(child.id)}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Baby className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-display">{child.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{ageText} old</p>
                    </div>
                  </div>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(child)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(child)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">DOB:</span> {format(new Date(child.dateOfBirth), 'PP')}</p>
                    <p><span className="text-muted-foreground">Gender:</span> {formatGender(child.gender)}</p>
                    {child.bloodGroup && <p><span className="text-muted-foreground">Blood Group:</span> {child.bloodGroup}</p>}
                    {child.notes?.trim() && (
                      <p className="pt-1 text-muted-foreground">
                        <span className="font-medium text-foreground/80">Notes: </span>
                        <span className="block mt-0.5 whitespace-pre-wrap break-words line-clamp-4">{child.notes.trim()}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
