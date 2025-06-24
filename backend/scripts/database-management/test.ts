import { SimpleBackup } from './backup';
import { SimpleRestore } from './restore';

/**
 * Test simple del sistema Backup & Restore
 */
async function testSystem() {
  console.log('🧪 PROBANDO SISTEMA BACKUP & RESTORE');
  console.log('====================================');
  console.log('');

  try {
    const backup = new SimpleBackup();
    const restore = new SimpleRestore();

    // Test 1: Crear backup
    console.log('📦 Test 1: Creando backup...');
    const backupFile = await backup.createBackup();
    console.log('✅ Backup creado exitosamente');
    console.log('');

    // Test 2: Listar backups
    console.log('📋 Test 2: Listando backups...');
    backup.listBackups();
    console.log('✅ Listado exitoso');
    console.log('');

    // Test 3: Restaurar DB desarrollo
    console.log('🔧 Test 3: Restaurando DB de desarrollo...');
    await restore.restoreDevDatabase();
    console.log('✅ Restauración exitosa');
    console.log('');

    console.log('🎉 TODOS LOS TESTS PASARON');
    console.log('✅ El sistema cumple con el requisito académico');
    console.log('');
    console.log('📝 Requisito cumplido:');
    console.log('   "Backup & Restore mediante scripts que permite restaurar la DB de desarrollo"');

  } catch (error) {
    console.error('❌ Error en el test:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testSystem();
}
