// Componente de ejemplo que muestra la implementación de la paleta de colores
import React from 'react';

const ColorPaletteDemo: React.FC = () => {
  return (
    <div className="container-main py-8 space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl">
        <h1 className="heading-1 text-primary-800">
          🎨 Nueva Paleta de Colores BookShelf Manager
        </h1>
        <p className="text-xl text-text-light max-w-2xl mx-auto">
          Diseño moderno y elegante con colores que transmiten calma, naturaleza y concentración
        </p>
      </section>

      {/* Botones */}
      <section className="space-y-6">
        <h2 className="heading-2">🎯 Botones</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary">Botón Principal</button>
          <button className="btn-secondary">Botón Secundario</button>
          <button className="btn-accent">Llamada a la Acción</button>
          <button className="btn-outline">Botón Outline</button>
        </div>
      </section>

      {/* Tarjetas */}
      <section className="space-y-6">
        <h2 className="heading-2">📋 Tarjetas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="heading-3 text-primary">Verde Salvia</h3>
            <p className="text-text-light">#A3B18A - Color principal que transmite calma y naturaleza.</p>
            <div className="w-full h-12 bg-primary rounded-lg mt-3"></div>
          </div>
          
          <div className="card">
            <h3 className="heading-3 text-accent">Coral Cálido</h3>
            <p className="text-text-light">#F28482 - Para llamadas a la acción e interacciones importantes.</p>
            <div className="w-full h-12 bg-accent rounded-lg mt-3"></div>
          </div>
          
          <div className="card">
            <h3 className="heading-3 text-sky">Azul Cielo</h3>
            <p className="text-text-light">#8ECAE6 - Para elementos secundarios interactivos y hover.</p>
            <div className="w-full h-12 bg-sky rounded-lg mt-3"></div>
          </div>
        </div>
      </section>

      {/* Formulario de ejemplo */}
      <section className="space-y-6">
        <h2 className="heading-2">📝 Formularios</h2>
        <div className="card max-w-md">
          <h3 className="heading-3 mb-4">Contacto</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Nombre</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Email</label>
              <input 
                type="email" 
                className="input" 
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Mensaje</label>
              <textarea 
                className="input h-24 resize-none" 
                placeholder="Tu mensaje aquí..."
              ></textarea>
            </div>
            <button type="submit" className="btn-primary w-full">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </section>

      {/* Alertas y Estados */}
      <section className="space-y-6">
        <h2 className="heading-2">⚠️ Estados y Alertas</h2>
        <div className="space-y-4">
          <div className="bg-primary-50 border-l-4 border-primary p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-primary mr-2">ℹ️</span>
              <p className="text-primary-800 font-medium">Información importante</p>
            </div>
          </div>
          
          <div className="bg-accent-50 border-l-4 border-accent p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-accent mr-2">⚠️</span>
              <p className="text-accent-800 font-medium">Advertencia o acción requerida</p>
            </div>
          </div>
          
          <div className="bg-sky-50 border-l-4 border-sky p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-sky-700 mr-2">✅</span>
              <p className="text-sky-800 font-medium">Operación completada exitosamente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enlaces */}
      <section className="space-y-6">
        <h2 className="heading-2">🔗 Enlaces</h2>
        <div className="space-y-2">
          <p>
            Este es un <a href="#" className="link">enlace normal</a> en el texto.
          </p>
          <p>
            También puedes ver <a href="#" className="link font-bold">enlaces destacados</a> para mayor énfasis.
          </p>
        </div>
      </section>

      {/* Paleta de colores completa */}
      <section className="space-y-6">
        <h2 className="heading-2">🎨 Paleta Completa</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Primary', color: 'bg-primary', hex: '#A3B18A' },
            { name: 'Secondary', color: 'bg-secondary', hex: '#FFECCC' },
            { name: 'Accent', color: 'bg-accent', hex: '#F28482' },
            { name: 'Neutral', color: 'bg-neutral', hex: '#F5F5F5' },
            { name: 'Text', color: 'bg-text', hex: '#333333' },
            { name: 'Sky', color: 'bg-sky', hex: '#8ECAE6' },
          ].map((color) => (
            <div key={color.name} className="text-center">
              <div className={`w-full h-16 ${color.color} rounded-lg border border-neutral-300`}></div>
              <p className="text-sm font-semibold text-text mt-2">{color.name}</p>
              <p className="text-xs text-text-lighter">{color.hex}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ColorPaletteDemo;
