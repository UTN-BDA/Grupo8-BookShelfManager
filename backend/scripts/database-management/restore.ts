import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../.env') });

const execAsync = promisify(exec);

/**
 * Script simple de Restore para Base de Datos de Desarrollo
 * Cumple con el requisito: "permite restaurar la DB de desarrollo"
 */
class SimpleRestore {
  private backupDir: string;

  constructor() {
    this.backupDir = path.join(__dirname, './backups');
  }

  /**
   * Restaurar base de datos de desarrollo desde backup más reciente
   */
  async restoreDevDatabase(): Promise<void> {
    console.log('🔧 Restaurando base de datos de desarrollo...');

    try {
      // Buscar el backup más reciente
      const latestBackup = this.getLatestBackup();
      if (!latestBackup) {
        throw new Error('No se encontraron backups disponibles');
      }

      console.log(`📁 Usando backup: ${path.basename(latestBackup)}`);

      // Configurar conexión
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL no configurada');
      }

      const url = new URL(databaseUrl);
      
      // Resetear base de datos actual
      console.log('🧹 Reseteando base de datos actual...');
      await execAsync('npx prisma migrate reset --force --skip-seed', {
        cwd: path.join(__dirname, '..')
      });

      // Restaurar desde backup
      console.log('📥 Restaurando datos desde backup...');
      const command = `psql --host=${url.hostname} --port=${url.port || 5432} --username=${url.username} --dbname=${url.pathname.slice(1)} --file="${latestBackup}" --quiet`;

      const env = { ...process.env };
      if (url.password) {
        env.PGPASSWORD = url.password;
      }

      await execAsync(command, { env });

      console.log('✅ Base de datos de desarrollo restaurada exitosamente');
      
    } catch (error) {
      console.error('❌ Error restaurando base de datos:', error);
      throw error;
    }
  }

  /**
   * Restaurar desde archivo específico
   */
  async restoreFromFile(backupFile: string): Promise<void> {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Archivo de backup no encontrado: ${backupFile}`);
    }

    console.log('🔧 Restaurando desde archivo específico...');
    console.log(`📁 Archivo: ${path.basename(backupFile)}`);

    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL no configurada');
      }

      const url = new URL(databaseUrl);
      
      // Resetear base de datos actual
      console.log('🧹 Reseteando base de datos actual...');
      await execAsync('npx prisma migrate reset --force --skip-seed', {
        cwd: path.join(__dirname, '..')
      });

      // Restaurar desde backup
      console.log('📥 Restaurando datos desde backup...');
      const command = `psql --host=${url.hostname} --port=${url.port || 5432} --username=${url.username} --dbname=${url.pathname.slice(1)} --file="${backupFile}" --quiet`;

      const env = { ...process.env };
      if (url.password) {
        env.PGPASSWORD = url.password;
      }

      await execAsync(command, { env });

      console.log('✅ Restauración completada exitosamente');
      
    } catch (error) {
      console.error('❌ Error en la restauración:', error);
      throw error;
    }
  }

  private getLatestBackup(): string | null {
    if (!fs.existsSync(this.backupDir)) {
      return null;
    }

    const files = fs.readdirSync(this.backupDir)
      .filter(file => file.startsWith('backup_') && file.endsWith('.sql'))
      .map(file => ({
        name: file,
        path: path.join(this.backupDir, file),
        mtime: fs.statSync(path.join(this.backupDir, file)).mtime
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    return files.length > 0 ? files[0].path : null;
  }
}

// Script principal
async function main() {
  try {
    const restore = new SimpleRestore();
    const args = process.argv.slice(2);
    const command = args[0];
    const backupFile = args[1];

    switch (command) {
      case 'dev':
        await restore.restoreDevDatabase();
        break;
      case 'file':
        if (!backupFile) {
          console.error('❌ Error: Debe especificar un archivo de backup');
          console.log('Uso: npm run restore:file <archivo>');
          process.exit(1);
        }
        await restore.restoreFromFile(path.resolve(backupFile));
        break;
      default:
        console.log('📖 Uso del script de restore:');
        console.log('');
        console.log('  npm run restore:dev          - Restaurar DB de desarrollo desde backup más reciente');
        console.log('  npm run restore:file <archivo> - Restaurar desde archivo específico');
        console.log('');
        console.log('Ejemplos:');
        console.log('  npm run restore:dev');
        console.log('  npm run restore:file backups/backup_2024-01-01.sql');
    }
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { SimpleRestore };
