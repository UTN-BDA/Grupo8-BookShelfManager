#!/usr/bin/env ts-node

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../.env') });

const execAsync = promisify(exec);

/**
 * Script simple de Backup para Base de Datos
 * Cumple con el requisito: "Backup & Restore mediante scripts"
 */
class SimpleBackup {
  private backupDir: string;

  constructor() {
    this.backupDir = path.join(__dirname, './backups');
    
    // Crear directorio de backups si no existe
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Crear backup completo de la base de datos
   */
  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupDir, `backup_${timestamp}.sql`);

    console.log('🔄 Creando backup de la base de datos...');
    console.log(`📁 Archivo: ${path.basename(backupFile)}`);

    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL no configurada');
      }

      const url = new URL(databaseUrl);
      const command = `pg_dump --host=${url.hostname} --port=${url.port || 5432} --username=${url.username} --dbname=${url.pathname.slice(1)} --file="${backupFile}" --verbose --no-owner --no-privileges`;

      // Configurar contraseña si existe
      const env = { ...process.env };
      if (url.password) {
        env.PGPASSWORD = url.password;
      }

      await execAsync(command, { env });
      
      const stats = fs.statSync(backupFile);
      console.log('✅ Backup creado exitosamente');
      console.log(`📊 Tamaño: ${this.formatFileSize(stats.size)}`);
      
      return backupFile;
    } catch (error) {
      console.error('❌ Error creando backup:', error);
      throw error;
    }
  }

  /**
   * Listar backups disponibles
   */
  listBackups(): string[] {
    console.log('📋 Backups disponibles:');
    console.log('======================');
    
    const files = fs.readdirSync(this.backupDir)
      .filter(file => file.startsWith('backup_') && file.endsWith('.sql'))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.log('❌ No se encontraron backups');
      return [];
    }

    files.forEach((file, index) => {
      const filePath = path.join(this.backupDir, file);
      const stats = fs.statSync(filePath);
      const date = stats.mtime.toLocaleString();
      const size = this.formatFileSize(stats.size);
      
      console.log(`${index + 1}. ${file}`);
      console.log(`   📅 ${date} | 📊 ${size}`);
    });

    return files.map(file => path.join(this.backupDir, file));
  }

  /**
   * Limpiar backups antiguos (mantener solo los N más recientes)
   */
  cleanOldBackups(keepCount: number = 5): void {
    console.log(`🧹 Limpiando backups antiguos (manteniendo los ${keepCount} más recientes)...`);

    if (!fs.existsSync(this.backupDir)) {
      console.log('📁 No existe directorio de backups');
      return;
    }

    const files = fs.readdirSync(this.backupDir)
      .filter(file => file.startsWith('backup_') && file.endsWith('.sql'))
      .map(file => ({
        name: file,
        path: path.join(this.backupDir, file),
        mtime: fs.statSync(path.join(this.backupDir, file)).mtime
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    if (files.length <= keepCount) {
      console.log(`✅ Solo hay ${files.length} backups, no es necesario limpiar`);
      return;
    }

    const toDelete = files.slice(keepCount);
    let deletedCount = 0;
    let totalSizeDeleted = 0;

    toDelete.forEach(file => {
      try {
        const stats = fs.statSync(file.path);
        totalSizeDeleted += stats.size;
        fs.unlinkSync(file.path);
        console.log(`🗑️  Eliminado: ${file.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error eliminando ${file.name}:`, error);
      }
    });

    console.log(`✅ Limpieza completada:`);
    console.log(`   📊 ${deletedCount} archivos eliminados`);
    console.log(`   💾 ${this.formatFileSize(totalSizeDeleted)} liberados`);
    console.log(`   📁 ${keepCount} backups más recientes conservados`);
  }

  /**
   * Eliminar todos los backups
   */
  clearAllBackups(): void {
    console.log('🗑️  Eliminando TODOS los backups...');

    if (!fs.existsSync(this.backupDir)) {
      console.log('📁 No existe directorio de backups');
      return;
    }

    const files = fs.readdirSync(this.backupDir)
      .filter(file => file.startsWith('backup_') && file.endsWith('.sql'));

    if (files.length === 0) {
      console.log('✅ No hay backups para eliminar');
      return;
    }

    let deletedCount = 0;
    let totalSizeDeleted = 0;

    files.forEach(file => {
      try {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        totalSizeDeleted += stats.size;
        fs.unlinkSync(filePath);
        console.log(`🗑️  Eliminado: ${file}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error eliminando ${file}:`, error);
      }
    });

    console.log(`✅ Eliminación completada:`);
    console.log(`   📊 ${deletedCount} archivos eliminados`);
    console.log(`   💾 ${this.formatFileSize(totalSizeDeleted)} liberados`);
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Script principal
async function main() {
  try {
    const backup = new SimpleBackup();
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'create':
        await backup.createBackup();
        break;
      case 'list':
        backup.listBackups();
        break;
      case 'clean':
        const keepCount = parseInt(args[1], 10) || 5;
        if (isNaN(keepCount) || keepCount < 1) {
          console.error('❌ El número de backups a mantener debe ser un número válido mayor a 0');
          process.exit(1);
        }
        backup.cleanOldBackups(keepCount);
        break;
      case 'clear':
        // Requiere confirmación para seguridad
        if (args[1] === '--force') {
          backup.clearAllBackups();
        } else {
          console.log('⚠️  Para eliminar TODOS los backups, usa:');
          console.log('   npx ts-node scripts/database-management/backup.ts clear --force');
          console.log('');
          console.log('⚠️  Esta acción NO se puede deshacer');
        }
        break;
      default:
        console.log('📖 Uso del script de backup:');
        console.log('');
        console.log('  npx ts-node backup.ts create       - Crear backup de la base de datos');
        console.log('  npx ts-node backup.ts list         - Listar backups disponibles');
        console.log('  npx ts-node backup.ts clean [N]    - Limpiar backups (mantener N más recientes, default: 5)');
        console.log('  npx ts-node backup.ts clear --force - Eliminar TODOS los backups');
        console.log('');
        console.log('Ejemplos:');
        console.log('  npx ts-node backup.ts clean 3      - Mantener solo los 3 más recientes');
        console.log('  npx ts-node backup.ts clear --force - Eliminar todo (requiere --force)');
        console.log('');
        console.log('📁 Los backups se guardan en: ./backups/');
    }
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { SimpleBackup };
