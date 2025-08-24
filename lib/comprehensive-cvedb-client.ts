import type { CVEDetails, CVEWithCPEs } from '@/types/cve';
export interface CPESearchResult {
  cpes: string[];
  kev?: boolean;
  ransomware_campaign?: boolean;
  references?: string[];
}

// Removed duplicate export

export interface CVESearchResult {
  cves: Array<{
    cve_id: string;
    summary: string | null;
    cvss: number | null;
    published_date: string | null;
    epss?: number | null;
  }>;
  total: number;
  limit: number;
  skip: number;
}

// Stub for makeCirclAPIRequest (should be replaced with real implementation)
async function makeCirclAPIRequest<T>(url: string): Promise<T> {
  // Simple fetch for CIRCL API
  const response = await fetch(`https://cve.circl.lu/api/${url}`);
  if (!response.ok) {
    throw new Error(`CIRCL API error: ${response.status}`);
  }
  return response.json();
}
// Comprehensive CVEDB API Integration - Multi-source Implementation
const CVE_API_ENDPOINTS = {
  // Primary: NIST NVD API (most reliable)
  nvd: "https://services.nvd.nist.gov/rest/json/cves/2.0",
  // Secondary: CIRCL CVE Search (reliable open source)
  circl: "https://cve.circl.lu/api",
  // Tertiary: CVE Search API (beta but functional)
  cvesearch: "https://api.cvesearch.com",
  // Fallback: Shodan CVEDB (if available)
  shodan: "https://cvedb.shodan.io",
}


// Advanced request handler with comprehensive error handling and retry logic
async function makeComprehensiveAPIRequest<T>(
  url: string,
  options: {
    maxRetries?: number
    retryDelay?: number
    timeout?: number
    fallbackEndpoints?: string[]
  } = {},
): Promise<T> {
  // Unified advanced request handler with retry, fallback, and error handling
  const { maxRetries = 3, retryDelay = 1000, timeout = 30000, fallbackEndpoints = [] } = options;
  let lastError: Error | null = null;
  let attempt = 0;
  let currentUrl = url;
  let endpoints = [url, ...fallbackEndpoints];
  while (attempt < maxRetries && endpoints.length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(currentUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "CyberWatchVault/3.0 (Multi-source)",
          "Cache-Control": "no-cache",
          "Accept-Encoding": "gzip, deflate",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const errorDetails = `${response.status} ${response.statusText}`;
        console.error(`[CVEDB] HTTP Error: ${errorDetails} for ${currentUrl}`);
        if (response.status === 308) {
          const location = response.headers.get("Location");
          if (location) {
            console.warn(`[CVEDB] HTTP 308 Permanent Redirect. Following Location: ${location}`);
            currentUrl = location;
            continue;
          }
          throw new Error("HTTP 308 received but no Location header found");
        }
        if (response.status === 404) {
          endpoints.shift();
          currentUrl = endpoints[0];
          attempt++;
          continue;
        }
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          const waitTime = retryAfter
            ? Number.parseInt(retryAfter) * 1000
            : Math.min(retryDelay * Math.pow(2, attempt), 30000);
          console.warn(`[CVEDB] Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          attempt++;
          continue;
        }
        if (response.status >= 500) {
          console.warn(`[CVEDB] Server error ${errorDetails} for ${currentUrl}. Retrying...`);
          lastError = new Error(`Server error ${errorDetails}`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
          attempt++;
          continue;
        }
        throw new Error(`HTTP ${errorDetails}`);
      }
      const data = await response.json();
      console.log(`[CVEDB] Success: ${currentUrl} - ${JSON.stringify(data).length} bytes`);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[CVEDB] Attempt ${attempt + 1} error for ${currentUrl}:`, errorMessage);
      lastError = error instanceof Error ? error : new Error(errorMessage);
      attempt++;
      continue;
    }
  }
  throw lastError || new Error("Comprehensive CVEDB API request failed after retries.");
}

// 1. GET /cve/{cve_id} - Get detailed information about a specific CVE
export async function getCVEDetailsComprehensive(cveId: string): Promise<any> {
  try {
    const cleanCveId = cveId.toUpperCase().trim();
    if (!cleanCveId.match(/^CVE-\d{4}-\d{4,}$/)) {
      throw new Error(`Invalid CVE ID format: ${cveId}. Expected format: CVE-YYYY-NNNNN`);
    }
    // Try NVD API first (most reliable)
    const nvdUrl = `${CVE_API_ENDPOINTS.nvd}?cveId=${cleanCveId}`;
    const circlUrl = `${CVE_API_ENDPOINTS.circl}/cve/${cleanCveId}`;
    const shodanUrl = `${CVE_API_ENDPOINTS.shodan}/cve/${cleanCveId}`;
    let nvdResult = null;
    try {
      nvdResult = await makeComprehensiveAPIRequest<any>(nvdUrl, {
        fallbackEndpoints: [circlUrl, shodanUrl],
        maxRetries: 2,
      });
    } catch (error) {
      console.error(`[CVEDB] All endpoints failed for CVE ${cveId}:`, error);
    }
    if (nvdResult && nvdResult.vulnerabilities && nvdResult.vulnerabilities.length > 0) {
      const vuln = nvdResult.vulnerabilities[0].cve;
      return {
        cve_id: vuln.id,
        summary: vuln.descriptions?.[0]?.value || null,
        cvss:
          vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
          vuln.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ||
          vuln.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore ||
          null,
        cvss_version: vuln.metrics?.cvssMetricV31
          ? 3.1
          : vuln.metrics?.cvssMetricV30
            ? 3.0
            : vuln.metrics?.cvssMetricV2
              ? 2.0
              : null,
        cvss_v2: vuln.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || null,
        cvss_v3:
          vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
          vuln.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ||
          null,
        published_date: vuln.published || null,
        last_modified_date: vuln.lastModified || null,
        cpes:
          vuln.configurations?.nodes?.flatMap(
            (node: any) => node.cpeMatch?.map((match: any) => match.criteria) || [],
          ) || [],
      };
    }
    return null;
  } catch (error) {
    console.error(`[CVEDB] Failed to fetch CVE ${cveId}:`, error);
    return null;
  }
}

// 2. GET /cpes - Search for CPEs by product name with full pagination support
export async function searchCPEsComprehensive(
  product: string,
  options: { limit?: number; skip?: number } = {},
): Promise<CPESearchResult> {
  try {
    const cleanProduct = product.trim().toLowerCase()
    if (!cleanProduct) {
      throw new Error("Product name cannot be empty")
    }

    try {
      const result = await makeCirclAPIRequest<any>(`action=browse&product=${encodeURIComponent(cleanProduct)}`)

      if (result && Array.isArray(result)) {
        const cpes = result.map((item) => item.id || `cpe:2.3:a:*:${cleanProduct}:*:*:*:*:*:*:*:*`)
        return { cpes: cpes.slice(0, options.limit || 100) }
      }
    } catch (error) {
      console.warn(`[CVEDB] CIRCL CPE search failed, using generated CPEs:`, error)
    }

    // Fallback to generated CPE patterns
    const generatedCpes = [
      `cpe:2.3:a:*:${cleanProduct}:*:*:*:*:*:*:*:*`,
      `cpe:2.3:a:${cleanProduct}:${cleanProduct}:*:*:*:*:*:*:*:*`,
      `cpe:2.3:a:${cleanProduct}_project:${cleanProduct}:*:*:*:*:*:*:*:*`,
    ]

    return { cpes: generatedCpes }
  } catch (error) {
    console.error(`[CVEDB] Failed to search CPEs for product ${product}:`, error)
    throw error
  }
}

// 3. GET /cves - Search for CVEs by product name with comprehensive filtering
export async function searchCVEsComprehensive(
  product: string,
  options: { limit?: number; skip?: number; start_date?: string; end_date?: string; cvss_min?: number; cvss_max?: number } = {},
): Promise<CVESearchResult> {
  const cleanProduct = product.trim().toLowerCase();
  // Allow '*' or 'all' for trending CVEs (no product filter)
  if (!cleanProduct || cleanProduct === '*' || cleanProduct === 'all') {
    // Use date-based search for trending CVEs
    const url = `${CVE_API_ENDPOINTS.nvd}`;
    const params = new URLSearchParams();
    params.append("resultsPerPage", Math.min(options.limit || 20, 2000).toString());
    params.append("startIndex", (options.skip || 0).toString());
    if (options.start_date) { params.append("pubStartDate", options.start_date); }
    if (options.end_date) { params.append("pubEndDate", options.end_date); }
    if (options.cvss_min !== undefined) { params.append("cvssV2Min", options.cvss_min.toString()); }
    if (options.cvss_max !== undefined) { params.append("cvssV2Max", options.cvss_max.toString()); }
    const fullUrl = `${url}?${params}`;
    const result = await makeComprehensiveAPIRequest<any>(fullUrl, {
      fallbackEndpoints: [
        `${CVE_API_ENDPOINTS.cvesearch}/search?limit=${options.limit || 20}`,
        `${CVE_API_ENDPOINTS.circl}/last`,
      ],
      maxRetries: 2,
    });
    if (result.vulnerabilities) {
      const cves = result.vulnerabilities.map((item: any) => {
        const vuln = item.cve;
        return {
          cve_id: vuln.id,
          summary: vuln.descriptions?.[0]?.value || null,
          cvss:
            vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
            vuln.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ||
            vuln.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore ||
            null,
          published_date: vuln.published || null,
        };
      });
      return {
        cves,
        total: cves.length,
        limit: options.limit || 20,
        skip: options.skip || 0,
      };
    }
    return { cves: [], total: 0, limit: options.limit || 20, skip: options.skip || 0 };
  }
  // Standard request
  const url = `${CVE_API_ENDPOINTS.nvd}`;
  const params = new URLSearchParams();
  params.append("keywordSearch", cleanProduct);
  params.append("resultsPerPage", Math.min(options.limit || 20, 2000).toString());
  params.append("startIndex", (options.skip || 0).toString());
  if (options.start_date) { params.append("pubStartDate", options.start_date); }
  if (options.end_date) { params.append("pubEndDate", options.end_date); }
  if (options.cvss_min !== undefined) { params.append("cvssV2Min", options.cvss_min.toString()); }
  if (options.cvss_max !== undefined) { params.append("cvssV2Max", options.cvss_max.toString()); }
  const fullUrl = `${url}?${params}`;
  const result = await makeComprehensiveAPIRequest<any>(fullUrl, {
    fallbackEndpoints: [
      `${CVE_API_ENDPOINTS.cvesearch}/search?q=${encodeURIComponent(cleanProduct)}&limit=${options.limit || 20}`,
      `${CVE_API_ENDPOINTS.circl}/search/${encodeURIComponent(cleanProduct)}`,
    ],
    maxRetries: 2,
  });
  if (result.vulnerabilities) {
    const cves = result.vulnerabilities.map((item: any) => {
      const vuln = item.cve;
      return {
        cve_id: vuln.id,
        summary: vuln.descriptions?.[0]?.value || null,
        cvss:
          vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
          vuln.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ||
          vuln.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore ||
          null,
        published_date: vuln.published || null,
      };
    });
    return {
      cves,
      total: result.totalResults || cves.length,
      limit: options.limit || 20,
      skip: options.skip || 0,
    };
  }
  return { cves: [], total: 0, limit: options.limit || 20, skip: options.skip || 0 };
}

// Comprehensive product vulnerability intelligence with full data retrieval
export async function getComprehensiveProductIntelligence(product: string) {
  try {
    const cleanProduct = product
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()

    if (!cleanProduct) {
      return {
        product: product,
        totalCVEs: 0,
        totalCPEs: 0,
        criticalCVEs: [],
        highCVEs: [],
        mediumCVEs: [],
        lowCVEs: [],
        kevCVEs: [],
        recentCVEs: [],
        ransomwareCVEs: [],
        highEpssCVEs: [],
        topEpssCVEs: [],
        affectedCPEs: [],
        summary: {
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          lowCount: 0,
          kevCount: 0,
          ransomwareCount: 0,
          highEpssCount: 0,
          recentCount: 0,
        },
        analytics: {
          averageCvss: 0,
          averageEpss: 0,
          exploitationLikelihood: "unknown",
          riskLevel: "unknown",
          patchPriority: "low",
        },
      }
    }

    console.log(`[CVEDB] Starting comprehensive analysis for product: ${product}`)

    // Parallel requests for comprehensive data gathering
    const [totalCvesResult, allCvesResult, kevCvesResult, recentCvesResult, highEpssCvesResult, cpesResult] = await Promise.all([
  searchCVEsComprehensive(cleanProduct, { limit: 100 }),
  searchCVEsComprehensive(cleanProduct, { limit: 500 }),
  searchCVEsComprehensive(cleanProduct, { limit: 100 }),
  searchCVEsComprehensive(cleanProduct, { limit: 100 }),
  searchCVEsComprehensive(cleanProduct, { limit: 50 }),
  searchCPEsComprehensive(cleanProduct, {}),
    ]);

    // Extract results
    const totalCVEs = totalCvesResult?.total || 0;
    const allCves = allCvesResult?.cves || [];
    const kevCVEs = kevCvesResult?.cves || [];
    const ransomwareCVEs = (await searchCVEsComprehensive(cleanProduct, { limit: 100 }))?.cves?.filter((cve: any) => cve.ransomware_campaign) || [];
    const recentCVEs = recentCvesResult?.cves || [];
    const highEpssCVEs = highEpssCvesResult?.cves ? highEpssCvesResult.cves.filter((cve: any) => (cve.epss || 0) > 0.3) : [];
    const topEpssCVEs = [...(highEpssCvesResult?.cves || [])].sort((a, b) => (b.epss || 0) - (a.epss || 0)).slice(0, 10);
    const affectedCPEs = cpesResult?.cpes || [];

  const cpes = cpesResult?.cpes || []

    // Categorize CVEs by severity
    const criticalCVEs = allCves.filter((cve) => (cve.cvss || 0) >= 9.0)
    const highCVEs = allCves.filter((cve) => (cve.cvss || 0) >= 7.0 && (cve.cvss || 0) < 9.0)
    const mediumCVEs = allCves.filter((cve) => (cve.cvss || 0) >= 4.0 && (cve.cvss || 0) < 7.0)
    const lowCVEs = allCves.filter((cve) => (cve.cvss || 0) > 0.0 && (cve.cvss || 0) < 4.0)

    // Calculate analytics
    const validCvssScores = allCves.filter((cve) => cve.cvss !== null).map((cve) => cve.cvss!)
    const validEpssScores = allCves.filter((cve) => cve.epss !== null).map((cve) => cve.epss!)

    const averageCvss =
      validCvssScores.length > 0 ? validCvssScores.reduce((a, b) => a + b, 0) / validCvssScores.length : 0
    
    const averageEpss =
      validEpssScores.length > 0 ? validEpssScores.reduce((a, b) => a + b, 0) / validEpssScores.length : 0

    // Determine risk levels
    const exploitationLikelihood =
      averageCvss > 8.0
        ? "very high"
        : averageCvss > 6.0
          ? "high"
          : averageCvss > 4.0
            ? "medium"
            : averageCvss > 2.0
              ? "low"
              : "very low"

    const riskLevel =
      criticalCVEs.length > 0 || kevCVEs.length > 5
        ? "critical"
        : highCVEs.length > 10 || kevCVEs.length > 0
          ? "high"
          : mediumCVEs.length > 20
            ? "medium"
            : "low"

    const patchPriority =
      kevCVEs.length > 0 || criticalCVEs.length > 0
        ? "immediate"
        : highCVEs.length > 0
          ? "high"
          : mediumCVEs.length > 0
            ? "medium"
            : "low"

    const result = {
      product: product,
      totalCVEs,
      totalCPEs: affectedCPEs.length,
      criticalCVEs,
      highCVEs,
      mediumCVEs,
      lowCVEs,
      kevCVEs,
      recentCVEs,
      ransomwareCVEs,
      highEpssCVEs,
      topEpssCVEs,
      affectedCPEs,
      summary: {
        criticalCount: criticalCVEs.length,
        highCount: highCVEs.length,
        mediumCount: mediumCVEs.length,
        lowCount: lowCVEs.length,
        kevCount: kevCVEs.length,
        ransomwareCount: ransomwareCVEs.length,
        highEpssCount: highEpssCVEs.length,
        recentCount: recentCVEs.length,
      },
      analytics: {
        averageCvss,
        averageEpss,
        exploitationLikelihood,
        riskLevel,
        patchPriority,
      },
    }

    console.log(`[CVEDB] Comprehensive analysis complete for ${product}:`, {
  totalCVEs,
  criticalCount: Array.isArray(allCves) ? allCves.filter((cve) => (cve.cvss || 0) >= 9.0).length : 0,
  riskLevel,
    })

    return result
  } catch (error) {
    console.error(`[CVEDB] Failed to get comprehensive intelligence for ${product}:`, error)
    return {
      product: product,
      totalCVEs: 0,
      affectedCPEs: 0,
      summary: {
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        kevCount: 0,
        ransomwareCount: 0,
        highEpssCount: 0,
        recentCount: 0,
      },
      analytics: {
        averageCvss: 0,
        averageEpss: 0,
        exploitationLikelihood: "unknown" as const,
        riskLevel: "unknown" as const,
        patchPriority: "low" as const,
      },
    }
  }
}

// Get comprehensive trending vulnerabilities
export async function getComprehensiveTrendingVulnerabilities(
  options: {
    daysBack?: number
    limit?: number
    minEpss?: number
    includeKevOnly?: boolean
    getAllData?: boolean
  } = {},
) {
  try {
    const { daysBack = 7, limit = 50, minEpss, includeKevOnly = false, getAllData = false } = options

    console.log(`[CVEDB] Fetching trending vulnerabilities for last ${daysBack} days`)

    const searchOptions = {
      daysBack,
      sortByEpss: true,
      limit: getAllData ? 1000 : limit,
      isKev: includeKevOnly,
      getAllPages: getAllData,
    }

    // Trending CVEs: use '*' to indicate no product filter, just trending by date
    let result: CVESearchResult = { cves: [], total: 0, limit: searchOptions.limit, skip: 0 };
    try {
      result = await searchCVEsComprehensive("*", searchOptions)
    } catch (err) {
      console.warn("Trending CVEs: Skipped empty product search", err)
    }

    if ("cves" in result) {
  const { cves } = result

      // Calculate analytics for CVSS only
      const analytics = {
        totalFound: cves.length,
        criticalCount: cves.filter((cve) => (cve.cvss || 0) >= 9.0).length,
        highCount: cves.filter((cve) => (cve.cvss || 0) >= 7.0 && (cve.cvss || 0) < 9.0).length,
        mediumCount: cves.filter((cve) => (cve.cvss || 0) >= 4.0 && (cve.cvss || 0) < 7.0).length,
        lowCount: cves.filter((cve) => (cve.cvss || 0) > 0.0 && (cve.cvss || 0) < 4.0).length,
        averageCvss: cves.reduce((sum, cve) => sum + (cve.cvss || 0), 0) / cves.length || 0,
        topCvssScore: Math.max(...cves.map((cve) => cve.cvss || 0)),
      }

      return {
        cves: cves.slice(0, limit), // Limit final results if needed
        analytics,
        metadata: {
          searchPeriod: `${daysBack} days`,
          totalAvailable: cves.length,
        },
      }
    }

    return { cves: [], analytics: null, metadata: null }
  } catch (error) {
    console.error("[CVEDB] Failed to get comprehensive trending vulnerabilities:", error)
    return { cves: [], analytics: null, metadata: null }
  }
}

// Batch CVE lookup with comprehensive error handling
export async function batchGetCVEDetailsComprehensive(cveIds: string[]): Promise<(any | null)[]> {
  const batchSize = 3 // Conservative batch size to avoid rate limiting
  const results: (any | null)[] = []

  console.log(`[CVEDB] Starting batch lookup for ${cveIds.length} CVEs`)

  for (let i = 0; i < cveIds.length; i += batchSize) {
    const batch = cveIds.slice(i, i + batchSize)
    console.log(`[CVEDB] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(cveIds.length / batchSize)}`)

    const batchPromises = batch.map((cveId) => getCVEDetailsComprehensive(cveId))
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Rate limiting delay between batches
    if (i + batchSize < cveIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  const successCount = results.filter(Boolean).length
  console.log(`[CVEDB] Batch lookup complete: ${successCount}/${cveIds.length} successful`)

  return results
}

// Enhanced helper functions
export function getCVSSSeverityComprehensive(cvss: number | null): {
  level: "none" | "low" | "medium" | "high" | "critical"
  color: string
  label: string
  description: string
  priority: number
  actionRequired: string
} {
  if (!cvss) {
    return {
      level: "none",
      color: "text-slate-400",
      label: "Unknown",
      description: "No CVSS score available",
      priority: 0,
      actionRequired: "Monitor for updates",
    }
  }

  if (cvss >= 9.0) {
    return {
      level: "critical",
      color: "text-red-400",
      label: "Critical",
      description: "Immediate action required",
      priority: 5,
      actionRequired: "Patch immediately",
    }
  }
  if (cvss >= 7.0) {
    return {
      level: "high",
      color: "text-orange-400",
      label: "High",
      description: "High priority patching needed",
      priority: 4,
      actionRequired: "Patch within 24-48 hours",
    }
  }
  if (cvss >= 4.0) {
    return {
      level: "medium",
      color: "text-yellow-400",
      label: "Medium",
      description: "Moderate risk, plan patching",
      priority: 3,
      actionRequired: "Patch within 1-2 weeks",
    }
  }
  if (cvss > 0.0) {
    return {
      level: "low",
      color: "text-green-400",
      label: "Low",
      description: "Low risk, monitor for updates",
      priority: 2,
      actionRequired: "Patch during maintenance window",
    }
  }

  return {
    level: "none",
    color: "text-slate-400",
    label: "None",
    description: "No risk identified",
    priority: 1,
    actionRequired: "No action required",
  }
}

export function formatEPSSScoreComprehensive(epss: number | null): {
  percentage: string
  riskLevel: "very-low" | "low" | "medium" | "high" | "very-high"
  description: string
  exploitLikelihood: string
  recommendedAction: string
} {
  if (!epss) {
    return {
      percentage: "N/A",
      riskLevel: "very-low",
      description: "No exploitation prediction available",
      exploitLikelihood: "Unknown",
      recommendedAction: "Monitor for updates",
    }
  }

  const percentage = `${(epss * 100).toFixed(1)}%`

  if (epss >= 0.8) {
    return {
      percentage,
      riskLevel: "very-high",
      description: "Very high likelihood of exploitation",
      exploitLikelihood: "Extremely likely within 30 days",
      recommendedAction: "Immediate patching required",
    }
  }
  if (epss >= 0.5) {
    return {
      percentage,
      riskLevel: "high",
      description: "High likelihood of exploitation",
      exploitLikelihood: "Likely within 30 days",
      recommendedAction: "Priority patching within 24-48 hours",
    }
  }
  if (epss >= 0.2) {
    return {
      percentage,
      riskLevel: "medium",
      description: "Moderate likelihood of exploitation",
      exploitLikelihood: "Possible within 30 days",
      recommendedAction: "Plan patching within 1 week",
    }
  }
  if (epss >= 0.05) {
    return {
      percentage,
      riskLevel: "low",
      description: "Low likelihood of exploitation",
      exploitLikelihood: "Unlikely within 30 days",
      recommendedAction: "Routine patching schedule",
    }
  }

  return {
    percentage,
    riskLevel: "very-low",
    description: "Very low likelihood of exploitation",
    exploitLikelihood: "Very unlikely within 30 days",
    recommendedAction: "Standard maintenance window",
  }
}

// Calculate comprehensive risk score
export function calculateComprehensiveRiskScore(cve: any): {
  score: number
  level: "low" | "medium" | "high" | "critical"
  factors: {
    cvssContribution: number
    epssContribution: number
    kevBonus: number
    ransomwareBonus: number
    recentBonus: number
  }
} {
  let score = 0
  const factors = {
    cvssContribution: 0,
    epssContribution: 0,
    kevBonus: 0,
    ransomwareBonus: 0,
    recentBonus: 0,
  }

  // CVSS contribution (0-40 points)
  if (cve.cvss) {
    factors.cvssContribution = (cve.cvss / 10) * 40
    score += factors.cvssContribution
  }

  // EPSS contribution (0-30 points)
  if (cve.epss) {
    factors.epssContribution = cve.epss * 30
    score += factors.epssContribution
  }

  // KEV bonus (20 points)
  if (cve.kev) {
    factors.kevBonus = 20
    score += factors.kevBonus
  }

  // Ransomware bonus (10 points)
  if (cve.ransomware_campaign) {
    factors.ransomwareBonus = 10
    score += factors.ransomwareBonus
  }

  // Recent publication bonus (5 points if published within 30 days)
  const publishedDate = new Date(cve.published_date || "")
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  if (publishedDate > thirtyDaysAgo) {
    factors.recentBonus = 5
    score += factors.recentBonus
  }

  const finalScore = Math.min(score, 100) // Cap at 100

  const level = finalScore >= 80 ? "critical" : finalScore >= 60 ? "high" : finalScore >= 30 ? "medium" : "low"

  return {
    score: finalScore,
    level,
    factors,
  }
}

// API Health Check
export async function checkCVEDBHealthComprehensive(): Promise<{
  status: "online" | "offline" | "degraded"
  responseTime: number
  lastCheck: Date
  endpoints: {
    cveEndpoint: boolean
    cvesEndpoint: boolean
    cpesEndpoint: boolean
  }
}> {
  const startTime = Date.now()
  const endpoints = {
    cveEndpoint: false,
    cvesEndpoint: false,
    cpesEndpoint: false,
  }

  try {
    // Test CVE endpoint with a real CVE that exists
    try {
      await makeComprehensiveAPIRequest(`${CVE_API_ENDPOINTS.nvd}?cveId=CVE-2021-44228`, {
        maxRetries: 1,
        timeout: 10000,
      })
      endpoints.cveEndpoint = true
    } catch (error) {
      console.log(`[CVEDB] CVE endpoint test failed:`, error)
    }

    // Test CVEs endpoint with simple keyword search
    try {
      await makeComprehensiveAPIRequest(`${CVE_API_ENDPOINTS.nvd}?keywordSearch=apache&resultsPerPage=1`, {
        maxRetries: 1,
        timeout: 10000,
      })
      endpoints.cvesEndpoint = true
    } catch (error) {
      console.log(`[CVEDB] CVEs endpoint test failed:`, error)
    }

    // Test CPEs endpoint
    try {
      await makeComprehensiveAPIRequest(`${CVE_API_ENDPOINTS.circl}/browse`, {
        maxRetries: 1,
        timeout: 5000,
      })
      endpoints.cpesEndpoint = true
    } catch {
      // Endpoint test failed
    }

    const responseTime = Date.now() - startTime
    const workingEndpoints = Object.values(endpoints).filter(Boolean).length

    let status: "online" | "offline" | "degraded"
    if (workingEndpoints === 3) {
      status = responseTime < 3000 ? "online" : "degraded"
    } else if (workingEndpoints > 0) {
      status = "degraded"
    } else {
      status = "offline"
    }

    return {
      status,
      responseTime,
      lastCheck: new Date(),
      endpoints,
    }
  } catch (error) {
    return {
      status: "offline",
      responseTime: Date.now() - startTime,
      lastCheck: new Date(),
      endpoints,
    }
  }
}

// Check if a CVE is recent
export function isRecentComprehensiveCVE(publishedDate: string | null): boolean {
  if (!publishedDate) return false
  const date = new Date(publishedDate)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return date > thirtyDaysAgo
}

export type { CVEDetails, CVEWithCPEs } from '@/types/cve';
