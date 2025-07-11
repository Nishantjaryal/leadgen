"use client"
import { useState } from "react";
import { FileUpload } from "../components/ui/file-upload";
import Link from "next/link";

export default function Home() {
  const [leads, setLeads] = useState([]);
  const [scored, setScored] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [btn, setbtn] = useState(false);
  const [jsonOutput, setJsonOutput] = useState("");
  const [rawJsonData, setRawJsonData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [fieldMapping, setFieldMapping] = useState({});
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [showFieldMapping, setShowFieldMapping] = useState(false);
  const [mappingConfirmed, setMappingConfirmed] = useState(false);

  const handleAddLead = () => {
    setLeads([...leads, { name: "", title: "", company: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...leads];
    updated[index][field] = value;
    setLeads(updated);
  };

  const handleRemoveLead = (index) => {
    const updated = leads.filter((_, i) => i !== index);
    setLeads(updated);
  };

  const handleScore = async () => {
    // Validate leads
    const validLeads = leads.filter(lead =>
      lead.name.trim() && lead.title.trim() && lead.company.trim()
    );

    if (validLeads.length === 0) {
      setError("Please add at least one complete lead with name, title, and company.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: validLeads }),
      });

      if (!res.ok) {
        throw new Error('Failed to score leads');
      }

      const data = await res.json();
      setScored(data.leads);
    } catch (err) {
      setError("Failed to score leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced field detection with fuzzy matching
  const detectFieldType = (header) => {
    const headerLower = header.toLowerCase().trim();

    // Name field patterns
    const namePatterns = ['name', 'full name', 'fullname', 'full_name', 'contact name', 'contact_name', 'first name', 'lastname', 'person', 'lead name', 'client name'];
    if (namePatterns.some(pattern => headerLower.includes(pattern))) {
      return 'name';
    }

    // Title field patterns (most comprehensive since it's required)
    const titlePatterns = [
      'title', 'job title', 'job_title', 'jobtitle', 'position', 'role', 'designation',
      'job position', 'job_position', 'work title', 'professional title', 'occupation',
      'job role', 'job_role', 'employment title', 'career title', 'work role'
    ];
    if (titlePatterns.some(pattern => headerLower.includes(pattern))) {
      return 'title';
    }

    // Company field patterns
    const companyPatterns = [
      'company', 'organization', 'org', 'business', 'employer', 'workplace',
      'company name', 'company_name', 'organization name', 'org_name',
      'business name', 'corp', 'corporation', 'firm', 'enterprise'
    ];
    if (companyPatterns.some(pattern => headerLower.includes(pattern))) {
      return 'company';
    }

    // Website field patterns
    const websitePatterns = [
      'website', 'url', 'web', 'site', 'homepage', 'web site', 'web_site',
      'company website', 'company_website', 'business website', 'domain',
      'web address', 'web_address', 'company url', 'company_url'
    ];
    if (websitePatterns.some(pattern => headerLower.includes(pattern))) {
      return 'website';
    }

    // Email field patterns
    const emailPatterns = ['email', 'e-mail', 'email address', 'email_address', 'mail', 'contact email'];
    if (emailPatterns.some(pattern => headerLower.includes(pattern))) {
      return 'email';
    }

    // Phone field patterns
    const phonePatterns = ['phone', 'telephone', 'mobile', 'cell', 'contact number', 'phone number'];
    if (phonePatterns.some(pattern => headerLower.includes(pattern))) {
      return 'phone';
    }

    return 'other';
  };

  // Auto-generate field mapping
  const generateFieldMapping = (headers) => {
    const mapping = {};
    const usedHeaders = new Set();

    // First pass: Find exact matches for required fields
    headers.forEach(header => {
      const fieldType = detectFieldType(header);
      if (['name', 'title', 'company', 'website', 'email', 'phone'].includes(fieldType)) {
        if (!mapping[fieldType]) {
          mapping[fieldType] = header;
          usedHeaders.add(header);
        }
      }
    });

    // Second pass: If title is missing (required field), try to find best match
    if (!mapping.title) {
      const potentialTitles = headers.filter(h => !usedHeaders.has(h) &&
        (h.toLowerCase().includes('job') || h.toLowerCase().includes('position') ||
          h.toLowerCase().includes('role') || h.toLowerCase().includes('work')));

      if (potentialTitles.length > 0) {
        mapping.title = potentialTitles[0];
        usedHeaders.add(potentialTitles[0]);
      }
    }

    // If still no title found, we'll need user input
    return mapping;
  };

  const handleFileChange = (content) => {
    const file = content;
    if (!file) return;

    setFileName(file.name);
    setError("");
    setJsonOutput("");
    setRawJsonData([]);
    setScored([]);
    setShowJson(false);
    setShowFieldMapping(false);
    setMappingConfirmed(false);

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setCsvContent(result);

        // Parse headers immediately to show field mapping
        try {
          const lines = result.split('\n').filter(line => line.trim());
          if (lines.length < 2) {
            setError("CSV must have at least a header row and one data row");
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          setCsvHeaders(headers);

          // Generate automatic field mapping
          const autoMapping = generateFieldMapping(headers);
          setFieldMapping(autoMapping);

          // Check if title field is mapped (required for API)
          if (!autoMapping.title) {
            setError("Could not automatically detect a title/job field. Please map it manually.");
            setShowFieldMapping(true);
          } else {
            setShowFieldMapping(true);
          }

          setbtn(true);
        } catch (err) {
          setError("Error parsing CSV headers. Please check file format.");
        }
      } else {
        setError("Failed to read file content as text.");
      }
    };

    reader.onerror = () => {
      setError("Error reading file. Please try again.");
      console.error("FileReader error occurred");
    };

    reader.readAsText(file);
  };

  const handleFieldMappingChange = (fieldType, selectedHeader) => {
    setFieldMapping(prev => ({
      ...prev,
      [fieldType]: selectedHeader === 'none' ? '' : selectedHeader
    }));
  };

  const confirmFieldMapping = () => {
    if (!fieldMapping.title) {
      setError("Title field is required for API processing. Please select a title field.");
      return;
    }
    setMappingConfirmed(true);
    setShowFieldMapping(false);
    setError("");
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "#22c55e"; // Green
    if (score >= 5) return "#f59e0b"; // Yellow
    if (score >= 0) return "#6b7280"; // Gray
    return "#ef4444"; // Red
  };

  const handleSubmit = async () => {
    if (!csvContent.trim()) {
      setError("Please select a CSV file first.");
      return;
    }

    if (!mappingConfirmed) {
      setError("Please confirm field mapping first.");
      return;
    }

    if (!fieldMapping.title) {
      setError("Title field is required for processing.");
      return;
    }

    setLoading(true);
    setError("");
    setJsonOutput("");

    try {
      // Parse CSV data
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error("CSV must have at least a header row and one data row");
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const jsonData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });

      if (jsonData.length === 0) {
        setError("No data found in the processed CSV.");
        return;
      }

      setRawJsonData(jsonData);

      // Map CSV data using the confirmed field mapping
      const mappedData = jsonData.map(row => {
        const mappedRow = {
          name: fieldMapping.name ? row[fieldMapping.name] || '' : '',
          title: row[fieldMapping.title] || '', // Required field
          company: fieldMapping.company ? row[fieldMapping.company] || '' : '',
          website: fieldMapping.website ? row[fieldMapping.website] || '' : '',
          email: fieldMapping.email ? row[fieldMapping.email] || '' : '',
          phone: fieldMapping.phone ? row[fieldMapping.phone] || '' : '',
          ...row // Include all original fields
        };

        return mappedRow;
      });

      // Score the mapped data using API
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: mappedData }),
      });

      if (!res.ok) {
        throw new Error('Failed to score CSV data');
      }

      const data = await res.json();
      setScored(data.leads);

      // Prepare JSON output
      const prettyJson = JSON.stringify(data.leads, null, 2);
      setJsonOutput(prettyJson);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to process CSV: ${errorMessage}`);
      console.error("CSV processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto p-6  flex items-center flex-col bg-gradient-to-br from-gray-800 via-blue-900 to-gray-900">
      <div className="w-full">
        <Link href="/" className=" text-gray-100 inline-block px-4 py-2 underline underline-offset-2">
          Back
        </Link>
      </div>

      <div className="my-12 w-[70%] min-w-[300px] flex  justify-center items-center flex-col min-h-[12rem]">
        <h1 className=" text-4xl  md:text-5xl lg:text-6xl sm:text-center font-bold text-gray-100 mb-2">Transform raw leads</h1>
        <p className="text-md sm:text-center text-gray-300 lg:text-lg">Transform Raw Leads converts unstructured or basic lead data into enriched, scored, and ready-to-use profiles. It cleans, standardizes, and analyzes job titles, company info, and more.</p>
      </div>

      {/* CSV Upload Section */}
      <div className="p-4 w-full">
        <div className=" bg-blue-950 my-5 rounded">
          <FileUpload onChange={handleFileChange} engageBtn={setbtn} isLoading={loading} />
        </div>

        {/* Field Mapping Section */}
        {showFieldMapping && csvHeaders.length > 0 && (
          <div className="mt-6 p-6 bg-gray-800 rounded">
            <h3 className="text-lg font-semibold text-white mb-4">Map CSV Fields</h3>
            <p className="text-sm text-gray-300 mb-4">
              Match your CSV columns to the expected fields. Title field is required for processing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['name', 'title', 'company', 'website', 'email', 'phone'].map(fieldType => (
                <div key={fieldType} className="flex flex-col">
                  <label className="text-sm  text-gray-300 mb-1">
                    {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}
                    {fieldType === 'title' && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <select
                    value={fieldMapping[fieldType] || 'none'}
                    onChange={(e) => handleFieldMappingChange(fieldType, e.target.value)}
                    className="px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">-- Select Column --</option>
                    {csvHeaders.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={confirmFieldMapping}
                disabled={!fieldMapping.title}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Mapping
              </button>
              <button
                onClick={() => setShowFieldMapping(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Show current mapping if confirmed */}
        {mappingConfirmed && (
          <div className="mt-4 p-4 bg-gray-900 rounded">
            <h4 className="text-sm  text-green-100 mb-2">Field Mapping Confirmed:</h4>
            <div className="text-xs text-blue-200">
              {Object.entries(fieldMapping).filter(([_, value]) => value).map(([key, value]) => (
                <span key={key} className="inline-block mr-4">
                  {key}: {value}
                </span>
              ))}
            </div>
            <button
              onClick={() => {
                setShowFieldMapping(true);
                setMappingConfirmed(false);
              }}
              className="mt-2 text-xs text-blue-300 hover:text-blue-100 underline"
            >
              Edit Mapping
            </button>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!btn || loading || !mappingConfirmed}
          className={`${btn && mappingConfirmed ? "block" : "hidden"} mt-3 mb-5 px-6 py-2 max-sm:px-4 max-sm:py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {loading ? "Processing..." : "Process & Score CSV"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-900 text-red-100 rounded w-full max-w-4xl">
          {error}
        </div>
      )}

      {/* Scored Results Section */}
      {scored.length > 0 && (
        <div className="mt-8 flex flex-col w-[95%] min-w-[300px] justify-center items-center my-10">
          <div className="flex justify-end w-full items-center mb-4 ">
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
            >
              {showJson ? "Show Table" : "Show JSON"}
            </button>
          </div>

          {showJson ? (
            <div className=" w-full rounded scrollbar-custom">
              <pre className="bg-gray-900 text-white p-4 rounded max-h-[500px] overflow-auto text-sm">
                {jsonOutput}
              </pre>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[700px] w-full border-collapse bg-slate-900 shadow-sm rounded overflow-hidden border">
                <thead className="bg-slate-950 border border-white">
                  <tr>
                    <th className="px-4 py-4 font-bold text-left text-xs  text-white uppercase tracking-wider">Name</th>
                    <th className="px-4 py-4 font-bold text-left text-xs  text-white uppercase tracking-wider">Title</th>
                    <th className="px-4 py-4 font-bold text-left text-xs  text-white uppercase tracking-wider">Company</th>
                    <th className="px-4 py-4 font-bold text-left text-xs  text-white uppercase tracking-wider">Website</th>
                    <th className="px-4 py-4 font-bold text-left text-xs  text-white uppercase tracking-wider">Email</th>
                    <th className="px-4 py-4 font-bold text-left text-xs  text-white uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-4 font-bold text-left text-xs  text-white uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scored
                    .sort((a, b) => b.score - a.score)
                    .map((lead, i) => (
                      <tr key={i} className="hover:bg-gray-900">
                        <td className="px-4 py-3.5 whitespace-nowrap text-sm  text-white">{lead.name}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-sm text-white">{lead.title}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-sm text-white">
                          {lead.website ? (
                            <a
                              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-300 hover:text-blue-500 hover:underline"
                            >
                              {lead.company}
                            </a>
                          ) : (
                            lead.company
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                          {lead.website && (
                            <a
                              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-300 hover:text-blue-500 hover:underline"
                            >
                              🔗 Link
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{lead.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{lead.phone}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm ">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs  text-white"
                            style={{ backgroundColor: getScoreColor(lead.score) }}
                          >
                            {lead.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Scoring Legend */}
          <div className="mt-4 p-4 bg-gray-900 rounded w-full">
            <h3 className="text-sm  text-gray-100 mb-2">Scoring Guide:</h3>
            <div className="flex flex-wrap gap-4 text-xs text-gray-200">
              <span>CEO/Founder: +10</span>
              <span>Head/Director: +8</span>
              <span>Sales: +5</span>
              <span>Other: +2</span>
              <span>Intern/Assistant: -5</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}