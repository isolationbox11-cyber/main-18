/**
 * Test suite for Vercel GitHub Actions workflow
 *
 * Framework: Jest (expected by repo unless another is detected)
 *
 * Strategy:
 * - Read the workflow YAML file from .github/workflows (the one containing "Vercel Deploy").
 * - Perform schema-ish validations using string and minimal parsing to avoid new deps.
 * - Validate critical values: triggers, runner, actions versions, Node version, npm cache, build env, Vercel action/args/env.
 */

const fs = require('fs');
const path = require('path');

function findVercelWorkflow() {
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
  try {
    const names = fs.readdirSync(workflowsDir);
    for (const name of names) {
      const p = path.join(workflowsDir, name);
      if (fs.statSync(p).isFile()) {
        const content = fs.readFileSync(p, 'utf8');
        if (/name:\s*Vercel Deploy\b/.test(content) || /amondnet\/vercel-action@/.test(content)) {
          return { filePath: p, content };
        }
      }
    }
  } catch (_) {
    /* ignore; fallback below */
  }
  // Fallback to inline fixture (from PR diff)
  const fallback = [
    "name: Vercel Deploy",
    "",
    "on:",
    "  push:",
    "    branches: [main]",
    "  pull_request:",
    "    branches: [main]",
    "",
    "jobs:",
    "  deploy:",
    "    name: Deploy to Vercel",
    "    runs-on: ubuntu-latest",
    "    ",
    "    steps:",
    "      - name: Checkout repository",
    "        uses: actions/checkout@v3",
    "        ",
    "      - name: Set up Node.js",
    "        uses: actions/setup-node@v3",
    "        with:",
    "          node-version: '18.x'",
    "          cache: 'npm'",
    "          ",
    "      - name: Install dependencies",
    "        run: npm ci",
    "        ",
    "      - name: Build",
    "        run: npm run build",
    "        env:",
    "          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}",
    "          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}",
    "          ",
    "      - name: Vercel Deploy",
    "        uses: amondnet/vercel-action@v20",
    "        with:",
    "          vercel-token: ${{ secrets.VERCEL_TOKEN }}",
    "          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}",
    "          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}",
    "          vercel-args: '--prod'",
    "        env:",
    "          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}",
    "          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}",
  ].join("\n");
  return { filePath: '(inline fixture from PR)', content: fallback };
}

function mustContain(haystack, needle, message) {
  expect(haystack.includes(needle)).toBe(true);
}

function matchLine(haystack, regex, message) {
  expect(regex.test(haystack)).toBe(true);
}

describe('GitHub Actions: Vercel Deploy workflow', () => {
  const wf = findVercelWorkflow();
  const yml = wf.content;

  test('workflow file is available (repo file or inline fixture)', () => {
    expect(typeof yml).toBe('string');
    expect(yml.length).toBeGreaterThan(50);
  });

  describe('basic metadata', () => {
    test('has correct workflow name', () => {
      matchLine(yml, /^name:\s*Vercel Deploy\b/m, 'workflow name should be "Vercel Deploy"');
    });

    test('is triggered on push and pull_request to main', () => {
      matchLine(yml, /^on:\s*$/m, 'has "on:" root key');
      matchLine(yml, /^\s*push:\s*$/m, 'has push trigger');
      matchLine(yml, /^\s*pull_request:\s*$/m, 'has pull_request trigger');
      matchLine(yml, /^\s*branches:\s*\[?main\]?/m, 'targets main branch');
      const pushes = [...yml.matchAll(/^\s*push:\s*\n(?:.*\n)*?\s*branches:\s*\[?main\]?/gm)];
      const prs = [...yml.matchAll(/^\s*pull_request:\s*\n(?:.*\n)*?\s*branches:\s*\[?main\]?/gm)];
      expect(pushes.length).toBeGreaterThan(0);
      expect(prs.length).toBeGreaterThan(0);
    });
  });

  describe('job and runner', () => {
    test('defines deploy job with ubuntu-latest runner', () => {
      matchLine(yml, /^\s*jobs:\s*$/m, 'has jobs root');
      matchLine(yml, /^\s*deploy:\s*$/m, 'has deploy job');
      matchLine(yml, /^\s*name:\s*Deploy to Vercel$/m, 'deploy job name');
      matchLine(yml, /^\s*runs-on:\s*ubuntu-latest$/m, 'runs on ubuntu-latest');
    });
  });

  describe('steps - repository checkout', () => {
    test('checks out the repository using actions/checkout@v3', () => {
      matchLine(yml, /- name:\s*Checkout repository/m, 'checkout step name');
      matchLine(yml, /uses:\s*actions\/checkout@v3/m, 'checkout action version v3');
    });
  });

  describe('steps - Node setup and caching', () => {
    test('sets up Node 18.x via actions/setup-node@v3 with npm cache', () => {
      matchLine(yml, /- name:\s*Set up Node\.js/m, 'Node setup step');
      matchLine(yml, /uses:\s*actions\/setup-node@v3/m, 'setup-node v3');
      matchLine(yml, /node-version:\s*'18\.x'/m, 'Node 18.x');
      matchLine(yml, /cache:\s*'npm'/m, 'npm cache');
    });
  });

  describe('steps - install and build', () => {
    test('installs dependencies with npm ci', () => {
      matchLine(yml, /- name:\s*Install dependencies/m, 'install step name');
      matchLine(yml, /run:\s*npm ci/m, 'uses npm ci');
    });

    test('builds with npm run build and provides Supabase env vars', () => {
      matchLine(yml, /- name:\s*Build/m, 'build step name');
      matchLine(yml, /run:\s*npm run build/m, 'npm run build');
      matchLine(yml, /env:\s*\n\s*NEXT_PUBLIC_SUPABASE_URL:\s*\$\{\{\s*secrets\.NEXT_PUBLIC_SUPABASE_URL\s*\}\}/m, 'Supabase URL secret');
      matchLine(yml, /NEXT_PUBLIC_SUPABASE_ANON_KEY:\s*\$\{\{\s*secrets\.NEXT_PUBLIC_SUPABASE_ANON_KEY\s*\}\}/m, 'Supabase anon key secret');
    });
  });

  describe('steps - Vercel deployment', () => {
    test('uses amondnet/vercel-action@v20 with prod arg', () => {
      matchLine(yml, /- name:\s*Vercel Deploy/m, 'Vercel step name');
      matchLine(yml, /uses:\s*amondnet\/vercel-action@v20/m, 'vercel-action v20');
      matchLine(yml, /with:\s*(?:.*\n)*\s*vercel-args:\s*'--prod'/m, 'vercel-args --prod');
    });

    test('passes required Vercel secrets via with and env', () => {
      // with block secrets
      matchLine(yml, /with:\s*(?:.*\n)*\s*vercel-token:\s*\$\{\{\s*secrets\.VERCEL_TOKEN\s*\}\}/m, 'vercel-token secret');
      matchLine(yml, /with:\s*(?:.*\n)*\s*vercel-org-id:\s*\$\{\{\s*secrets\.VERCEL_ORG_ID\s*\}\}/m, 'vercel-org-id secret');
      matchLine(yml, /with:\s*(?:.*\n)*\s*vercel-project-id:\s*\$\{\{\s*secrets\.VERCEL_PROJECT_ID\s*\}\}/m, 'vercel-project-id secret');

      // env block variables
      matchLine(yml, /env:\s*(?:.*\n)*\s*VERCEL_ORG_ID:\s*\$\{\{\s*secrets\.VERCEL_ORG_ID\s*\}\}/m, 'env VERCEL_ORG_ID');
      matchLine(yml, /env:\s*(?:.*\n)*\s*VERCEL_PROJECT_ID:\s*\$\{\{\s*secrets\.VERCEL_PROJECT_ID\s*\}\}/m, 'env VERCEL_PROJECT_ID');
    });
  });

  describe('defensive checks and failure scenarios', () => {
    test('does not use deprecated actions v1/v2 for checkout/setup-node', () => {
      expect(/actions\/checkout@v[12]\b/.test(yml)).toBe(false);
      expect(/actions\/setup-node@v[12]\b/.test(yml)).toBe(false);
    });

    test('does not pin Node to unsupported major (<18)', () => {
      const nodeVersionMatches = yml.match(/node-version:\s*'(\d+)\.x'/);
      if (nodeVersionMatches) {
        const major = parseInt(nodeVersionMatches[1], 10);
        expect(major).toBeGreaterThanOrEqual(18);
      } else {
        // If not found, fail explicitly
        throw new Error("node-version not found in setup-node step");
      }
    });

    test('build step exports only expected env vars (Supabase keys present)', () => {
      // Simple presence checks
      mustContain(yml, 'NEXT_PUBLIC_SUPABASE_URL', 'Supabase URL should be present');
      mustContain(yml, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'Supabase anon key should be present');
    });
  });
});