const { execSync } = require('child_process');
const fs = require('fs/promises');
const path = require('path');

const TYPES_OUTPUT_FILE = path.join(
  __dirname,
  '..',
  'types',
  'database.types.ts'
);

async function generateTypes() {
  const env = process.env;
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing required environment variables');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
    process.exit(1);
  }

  try {
    // Create the output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'types');
    await fs.mkdir(outputDir, { recursive: true });

    // Generate types using Supabase CLI
    console.log('Generating types using Supabase CLI...');
    const projectId = new URL(supabaseUrl).hostname.split('.')[0];
    
    // Use npx to run supabase CLI without global installation
    const command = `npx supabase gen types typescript --project-id ${projectId} > ${TYPES_OUTPUT_FILE}`;
    console.log(`Running: ${command}`);
    
    // Set environment variables for the command
    process.env.SUPABASE_ACCESS_TOKEN = supabaseKey;
    
    // Run the command
    execSync(command, { stdio: 'inherit' });
    
    console.log(`Types generated successfully at: ${TYPES_OUTPUT_FILE}`);
    
    // Read the generated file to verify it's not empty
    const stats = await fs.stat(TYPES_OUTPUT_FILE);
    if (stats.size === 0) {
      throw new Error('Generated types file is empty');
    }
    
    console.log('Type generation completed successfully!');
    return true;
  } catch (error) {
    console.error('Failed to generate types:', error);
    process.exit(1);
  }
}

generateTypes();
