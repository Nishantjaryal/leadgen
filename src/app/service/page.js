"use client"
import { useState } from "react";
import { FileUpload } from "../components/ui/file-upload";

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

  const handleFileChange = (content) => {
    const file = content;
    if (!file) return;

    setFileName(file.name);
    setError("");
    setJsonOutput("");
    setRawJsonData([]);
    setScored([]);
    setShowJson(false);

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setCsvContent(result);
        setbtn(true);
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

      // Map CSV data to the expected format for scoring
      const mappedData = jsonData.map(row => {
        const nameField = headers.find(h => h.toLowerCase().includes('name')) || headers[0];
        const titleField = headers.find(h => h.toLowerCase().includes('title') || h.toLowerCase().includes('job') || h.toLowerCase().includes('position'));
        const companyField = headers.find(h => h.toLowerCase().includes('company') || h.toLowerCase().includes('organization'));

        return {
          name: row[nameField] || '',
          title: row[titleField] || '',
          company: row[companyField] || '',
          website: row.website || row.Website || '',
          ...row // Include all original fields
        };
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
    <div className="w-full min-h-screen mx-auto p-6 flex  justify-center items-center flex-col bg-gradient-to-br from-gray-800 via-blue-900 to-gray-900">
      <div className="my-12 w-[70%] min-w-[300px] flex  justify-center items-center flex-col min-h-[12rem]">
        <h1 className=" text-4xl  md:text-5xl lg:text-6xl font-bold text-gray-100 mb-2">Transform raw leads</h1>
        <p className="text-md text-center text-gray-400 lg:text-lg">Transform Raw Leads converts unstructured or basic lead data into enriched, scored, and ready-to-use profiles. It cleans, standardizes, and analyzes job titles, company info, and more.</p>
      </div>

      {/* CSV Upload Section */}
      <div className="p-4 w-full">
          <label
            htmlFor="csv-file"
            className="block text-sm font-medium text-gray-300"
          >
          </label>
        <div className=" bg-blue-950 my-5 rounded">
          <FileUpload onChange={handleFileChange} engageBtn={setbtn} isLoading={loading} />

          </div>


          
        <button
          onClick={handleSubmit}
          disabled={!btn || loading}
          className={` ${btn?"block":"hidden"} mt-3 mb-5 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {loading ? "Processing..." : "Process & Score CSV"}
        </button>
      </div>


      {/* Scored Results Section */}
      {scored.length > 0 && (
        <div className="mt-8 flex flex-col w-full justify-center items-center my-10">
          <div className="flex justify-end w-[80%] items-center mb-4 ">
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-4 py-2 bg-gray-600 text-gray-800 rounded-md hover:bg-gray-700 transition-colors"
            >
              {showJson ? "Show Table" : "Show JSON"}
            </button>
          </div>

          {showJson ? (
            <div className="p-4 bg-black w-[80%] min-w-[300px] rounded-lg scrollbar-custom">
              <pre className="bg-gray-900 p-4 rounded max-h-96 overflow-auto text-sm">
                {jsonOutput}
              </pre>
            </div>
          ) : (
            <div className="overflow-x-auto w-full flex justify-center items-center">
              <table className=" border-collapse w-[80%] min-w-[300px] bg-slate-900 shadow-sm rounded-lg overflow-hidden border border-white">
                  <thead className="bg-gray-800 border border-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Website</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scored
                    .sort((a, b) => b.score - a.score) // Sort by score descending
                    .map((lead, i) => (
                      <tr key={i} className="hover:bg-gray-950">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {lead.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {lead.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
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
          <div className="mt-4 p-4 bg-gray-800 rounded-lg w-[80%] min-w-[300px]">
            <h3 className="text-sm font-medium text-gray-100 mb-2">Scoring Guide:</h3>
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