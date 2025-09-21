#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs/promises');
const path = require('path');

// Load environment variables from .env.local
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const TYPES_OUTPUT_FILE = path.join(
  __dirname,
  '..',
  'types',
  'database.types.ts'
);

// Configuration interface
interface GenerateTypesConfig {
  projectId?: string;
  outputDir?: string;
  schema?: string;
  linked?: boolean;
  local?: boolean;
  debug?: boolean;
}

// Default configuration
const defaultConfig: Required<GenerateTypesConfig> = {
  projectId: undefined,
  outputDir: path.join(process.cwd(), 'types'),
  schema: 'public',
  linked: true,
  local: false,
  debug: false
};

/**
 * Extracts project ID from Supabase URL
 */
function extractProjectId(supabaseUrl: string): string {
  try {
    const url = new URL(supabaseUrl);
    const hostname = url.hostname;
    const projectId = hostname.split('.')[0];
    return projectId;
  } catch (error) {
    throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
  }
}

/**
 * Validates environment variables
 */
function validateEnvironment(): { url: string; key: string } {
  const env = process.env;
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Make sure your .env.local file is configured and Next.js has loaded the environment variables.'
    );
  }

  if (!serviceKey && !anonKey) {
    throw new Error(
      'Missing API key. Make sure your .env.local file has either SUPABASE_SERVICE_ROLE_KEY ' +
      'or NEXT_PUBLIC_SUPABASE_ANON_KEY configured.'
    );
  }

  return { url, key: serviceKey || anonKey! };
}

/**
 * Generates Supabase database types
 */
async function generateTypes(config: GenerateTypesConfig = {}): Promise<boolean> {
  const mergedConfig = { ...defaultConfig, ...config };
  const { url, key } = validateEnvironment();

  console.log('🚀 Starting Supabase type generation...');
  console.log(`📁 Output directory: ${mergedConfig.outputDir}`);
  console.log(`🔗 Linked mode: ${mergedConfig.linked}`);
  console.log(`🎯 Schema: ${mergedConfig.schema}`);

  if (mergedConfig.debug) {
    console.log(`🐛 Debug mode enabled`);
    console.log(`🌐 Supabase URL: ${url}`);
    console.log(`🔑 Using ${key === process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role' : 'Anon'} key`);
  }

  try {
    // Create output directory
    await fs.mkdir(mergedConfig.outputDir, { recursive: true });
    console.log(`✅ Created output directory: ${mergedConfig.outputDir}`);

    // Determine project ID
    let projectId = mergedConfig.projectId;
    if (!projectId) {
      projectId = extractProjectId(url);
      console.log(`🔍 Extracted project ID: ${projectId}`);
    }

    // Build command
    const baseCommand = 'npx supabase gen types typescript';
    const commandParts = [
      baseCommand,
      `--project-id ${projectId}`,
      `--schema ${mergedConfig.schema}`,
      mergedConfig.linked ? '--linked' : '',
      mergedConfig.local ? '--local' : '',
      `> ${TYPES_OUTPUT_FILE}`
    ].filter(Boolean);

    const command = commandParts.join(' ');
    console.log(`⚡ Executing: ${command}`);

    // Set environment for command
    const originalToken = process.env.SUPABASE_ACCESS_TOKEN;
    process.env.SUPABASE_ACCESS_TOKEN = key;

    try {
      // Execute command
      execSync(command, {
        stdio: 'inherit',
        env: { ...process.env, SUPABASE_ACCESS_TOKEN: key }
      });

      // Verify file was created and has content
      const stats = await fs.stat(TYPES_OUTPUT_FILE);
      if (stats.size === 0) {
        throw new Error('Generated types file is empty');
      }

      console.log(`✅ Types generated successfully!`);
      console.log(`📄 File size: ${stats.size} bytes`);
      console.log(`📍 Location: ${TYPES_OUTPUT_FILE}`);

      // Show file preview in debug mode
      if (mergedConfig.debug) {
        const content = await fs.readFile(TYPES_OUTPUT_FILE, 'utf-8');
        const lines = content.split('\n');
        console.log(`📋 File preview (first 10 lines):`);
        lines.slice(0, 10).forEach((line, index) => {
          console.log(`   ${index + 1}: ${line}`);
        });
      }

      return true;
    } finally {
      // Restore original environment
      if (originalToken !== undefined) {
        process.env.SUPABASE_ACCESS_TOKEN = originalToken;
      }
    }
  } catch (error) {
    console.error('❌ Failed to generate types:');
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
      if (mergedConfig.debug && error.stack) {
        console.error(`   Stack trace: ${error.stack}`);
      }
    } else {
      console.error(`   Unknown error: ${error}`);
    }
    return false;
  }
}

/**
 * CLI argument parsing
 */
function parseArgs(): GenerateTypesConfig {
  const args = process.argv.slice(2);
  const config: GenerateTypesConfig = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--project-id':
        config.projectId = args[++i];
        break;
      case '--output-dir':
        config.outputDir = args[++i];
        break;
      case '--schema':
        config.schema = args[++i];
        break;
      case '--no-linked':
        config.linked = false;
        break;
      case '--local':
        config.local = true;
        break;
      case '--debug':
        config.debug = true;
        break;
      case '--help':
      case '-h':
        console.log(`\n📖 Supabase Type Generator\n\nUsage: npx tsx scripts/generate-types.ts [options]\n\nOptions:\n  --project-id <id>    Supabase project ID (auto-detected from URL if not provided)\n  --output-dir <dir>   Output directory for types (default: types/)\n  --schema <name>      Database schema to generate types for (default: public)\n  --no-linked         Disable linked types\n  --local             Use local Supabase instance\n  --debug             Enable debug mode with verbose logging\n  --help, -h          Show this help message\n\nEnvironment Variables:\n  NEXT_PUBLIC_SUPABASE_URL         Your Supabase project URL\n  SUPABASE_SERVICE_ROLE_KEY        Service role key (optional, falls back to anon key)\n  NEXT_PUBLIC_SUPABASE_ANON_KEY    Anonymous/public key\n`);
        process.exit(0);
    }
  }

  return config;
}

// Main execution
if (require.main === module) {
  const config = parseArgs();
  generateTypes(config)
    .then((success) => {
      if (!success) {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { generateTypes, extractProjectId, validateEnvironment };
