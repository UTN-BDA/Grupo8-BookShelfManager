import React, { useState } from 'react';
import type { User } from '../services/userService';

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

export default function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [form, setForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    role: 'USER' as User['role'],
  });

  React.useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Editar usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Usuario"
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <select
            className="w-full border rounded px-3 py-2"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
