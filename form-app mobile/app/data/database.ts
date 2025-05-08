// Localização: app/data/database.ts
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Tipos para os resultados (mantidos do seu código)
type SQLiteRunResult = SQLite.SQLiteRunResult; // Usar tipo exportado por expo-sqlite
type SQLiteRowsResult<T = any> = Array<T>; // getAllAsync retorna Array<T> diretamente

// Variáveis para gerir a instância e a promessa de inicialização
let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function openAndInitDatabase(): Promise<SQLite.SQLiteDatabase> {
    console.log("A abrir/criar banco de dados MasterErpApp.db...");
    let db: SQLite.SQLiteDatabase;

    if (Platform.OS === "web") {
        console.warn("SQLite não é totalmente suportado na web. Usando mock DB.");
        // Mock simples para evitar erros na web
        db = {
          execAsync: async () => { console.log("Mock DB execAsync"); },
          runAsync: async (): Promise<SQLiteRunResult> => { console.log("Mock DB runAsync"); return { lastInsertRowId: 0, changes: 0 }; },
          getFirstAsync: async <T>(): Promise<T | null> => { console.log("Mock DB getFirstAsync"); return null; },
          getAllAsync: async <T>(): Promise<SQLiteRowsResult<T>> => { console.log("Mock DB getAllAsync"); return []; },
          closeAsync: async () => { console.log("Mock DB closeAsync"); },
          withTransactionAsync: async (action: () => Promise<void>) => { console.log("Mock DB withTransactionAsync"); await action(); }, // Simula a transação
          prepareAsync: async (sql: string) => {
            console.log(`Mock DB prepareAsync: ${sql}`);
            const mockStatement = {
              executeAsync: async (params: any): Promise<SQLiteRunResult> => { console.log("Mock Statement executeAsync", params); return { lastInsertRowId: 1, changes: 1 }; },
              finalizeAsync: async () => { console.log("Mock Statement finalizeAsync"); }
            };
            return mockStatement as SQLite.SQLiteStatement; // Cast para o tipo esperado
          }
          // Adicione outros métodos mockados se necessário
        } as unknown as SQLite.SQLiteDatabase; // Usar 'as' para forçar o tipo no mock
    } else {
        // Abre ou cria o banco de dados físico
        db = await SQLite.openDatabaseAsync("MasterErpApp.db");
    }

    console.log("A inicializar schema do banco de dados...");
    try {
        // Usar execAsync para executar múltiplos comandos de criação/índice
        await db.execAsync(`
          PRAGMA journal_mode = WAL; -- Boa prática para performance e concorrência

          CREATE TABLE IF NOT EXISTS FilledFormInstances (
            id TEXT PRIMARY KEY NOT NULL,
            formTemplateId INTEGER NOT NULL,
            formTemplateVersion INTEGER NOT NULL,
            filledByUserId INTEGER,
            status TEXT CHECK(status IN ('DRAFT', 'PENDING_SYNC', 'SYNCED', 'ERROR')) NOT NULL,
            deviceCreatedAt TEXT NOT NULL,
            deviceSubmittedAt TEXT,
            serverReceivedAt TEXT,
            headerDataJson TEXT NOT NULL,
            generalObservations TEXT,
            signatureBase64 TEXT,
            syncErrorMessage TEXT
          );

          CREATE INDEX IF NOT EXISTS idx_filledforms_status
            ON FilledFormInstances (status);

          CREATE INDEX IF NOT EXISTS idx_filledforms_template_user
            ON FilledFormInstances (formTemplateId, filledByUserId);

          CREATE TABLE IF NOT EXISTS FilledItemResponses (
            id TEXT PRIMARY KEY NOT NULL,
            filledFormInstanceId TEXT NOT NULL,
            formTemplateItemId INTEGER NOT NULL,
            responseValue TEXT,
            observationText TEXT,
            signatureValueBase64 TEXT,
            FOREIGN KEY (filledFormInstanceId)
              REFERENCES FilledFormInstances(id) ON DELETE CASCADE
          );

          CREATE INDEX IF NOT EXISTS idx_filleditemresponses_instance
            ON FilledItemResponses (filledFormInstanceId);
        `);
        console.log("Schema do banco de dados inicializado com sucesso!");
        dbInstance = db; // Armazena a instância inicializada
        return db;
    } catch (error) {
        console.error("Falha na inicialização do schema do banco de dados:", error);
        dbInstance = null; // Garante que a instância não seja usada se a inicialização falhar
        throw error; // Re-lança o erro
    }
}

// Função exportada para obter a instância do DB, garantindo que está inicializada
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (dbInstance) {
        // Se já temos uma instância pronta, retorna-a
        return dbInstance;
    }
    if (!initPromise) {
        // Se a inicialização ainda não começou, inicia-a
        console.log("Iniciando a inicialização do banco de dados pela primeira vez...");
        initPromise = openAndInitDatabase();
    }
    // Aguarda a conclusão da inicialização (se já estiver em andamento ou acabou de começar)
    // e retorna a instância ou lança erro se falhou
    try {
        const initializedDb = await initPromise;
        if (!dbInstance) { // Dupla verificação caso a promise resolva mas a instância não foi definida
             throw new Error("Falha crítica: Banco de dados não inicializado após aguardar.");
        }
        return initializedDb;
    } catch (error) {
         console.error("Erro durante a espera da inicialização do DB:", error);
         initPromise = null; // Permite tentar inicializar novamente na próxima chamada
         throw error; // Re-lança o erro para o chamador
    }
}

// Função explícita para chamar na inicialização do app (opcional, mas boa prática)
export const initDB = async (): Promise<void> => {
    try {
        await getDatabase(); // Chama getDatabase para garantir que a inicialização ocorra
        console.log("initDB: Banco de dados pronto para uso.");
    } catch (error) {
        console.error("initDB: Erro durante a inicialização explícita do banco de dados.", error);
        // Decida como lidar com este erro crítico na inicialização do app
        // Pode ser um Alert, ou um estado de erro global
    }
};
