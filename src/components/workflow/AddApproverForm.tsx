import { Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const NEW_APPROVER_FIELDS = [
  { id: 'approver-name',  label: 'Name *',   placeholder: 'John Doe',         type: 'text',  key: 'newName'  as const },
  { id: 'approver-role',  label: 'Role *',   placeholder: 'Manager',          type: 'text',  key: 'newRole'  as const },
  { id: 'approver-email', label: 'Email',    placeholder: 'john@example.com', type: 'email', key: 'newEmail' as const },
]

interface Props {
  newName: string; setNewName: (v: string) => void
  newRole: string; setNewRole: (v: string) => void
  newEmail: string; setNewEmail: (v: string) => void
  addApprover: () => void
}

export function AddApproverForm({ newName, setNewName, newRole, setNewRole, newEmail, setNewEmail, addApprover }: Props) {
  const fieldValues  = { newName, newRole, newEmail }
  const fieldSetters = { newName: setNewName, newRole: setNewRole, newEmail: setNewEmail }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Add New Approver</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {NEW_APPROVER_FIELDS.map(({ id, label, placeholder, type, key }) => (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="text-xs">{label}</Label>
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              value={fieldValues[key]}
              onChange={e => fieldSetters[key](e.target.value)}
            />
          </div>
        ))}
      </div>
      <Button size="sm" onClick={addApprover} disabled={!newName || !newRole}>
        <Plus className="mr-2" size={16} />Add Approver
      </Button>
    </div>
  )
}
