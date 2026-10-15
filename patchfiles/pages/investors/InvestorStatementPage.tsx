import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { investmentService } from "@/services/investmentService";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { toast } from "sonner";

interface InvestorPortfolio {
  client_code: string;
  investor_name: string;
  initial_investment: number;
  total_principal: number;
  current_balance: number;
  total_profit: number;
  unique_batches: number;
  holdings: Array<{
    batch_id: number;
    batch_name: string;
    fund_id: number | null;
    fund_name: string;
    investments_count: number;
    total_principal: number;
    latest_valuation: {
      epoch_start: string;
      epoch_end: string;
      start_balance: number;
      deposits: number;
      withdrawals: number;
      profit: number;
      end_balance: number;
    } | null;
  }>;
}

export default function InvestorStatementPage() {
  const { clientCode } = useParams<{ clientCode: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<InvestorPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!clientCode) return;
      setLoading(true);
      try {
        const res = await investmentService.getInvestorPortfolio(clientCode);
        if (res.status === 200 && res.data && (res.data as any).holdings) {
          setPortfolio(res.data as any);
        } else {
          toast.error("Could not load investor portfolio");
        }
      } catch (err) {
        console.error("Error loading investor portfolio", err);
        toast.error("Failed to load investor data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [clientCode]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center h-64">
        <div className="spinner-border" style={{ color: "var(--color-brand-400)" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-10">
        <p style={{ color: "var(--color-text-tertiary)" }}>Investor not found</p>
        <button onClick={() => navigate(ROUTES.INVESTORS)} className="btn btn-sm btn-outline-secondary mt-3">
          Back to investors
        </button>
      </div>
    );
  }

  const totalCurrentBalance = portfolio.current_balance ?? portfolio.holdings.reduce(
    (sum, h) => sum + (h.latest_valuation?.end_balance || h.total_principal),
    0
  );
  const totalProfit = portfolio.total_profit ?? totalCurrentBalance - portfolio.total_principal;

  return (
    <div className="container-fluid px-0">
      {/* Top Navigation */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button
          onClick={() => clientCode && navigate(ROUTES.INVESTOR_OVERVIEW(clientCode))}
          className="d-flex align-items-center gap-1 btn btn-link p-0 text-decoration-none"
          style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}
        >
          <ArrowLeft size={14} /> Back to overview
        </button>
        <div className="d-flex gap-2">
          <button className="btn btn-sm" style={{ background: "#00005b", color: "#fff" }} onClick={() => window.print()}>
            <Printer size={14} /> Print
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={async () => {
              try {
                if (!clientCode) throw new Error("Client code is missing");
                await investmentService.downloadInvestorStatementPdf(clientCode);
                toast.success("Investor statement downloaded successfully");
              } catch (error) {
                console.error("Error downloading investor statement:", error);
                toast.error("Failed to download investor statement. Please try again.");
              }
            }}
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Statement Container - Styled for Printing */}
      <div
        style={{
          background: "#fff",
          color: "#000",
          padding: "60px 40px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #00005b", paddingBottom: "20px" }}>
          <div>
            <img src="/AIBlight.png" alt="AIBAXYS Logo" style={{ maxHeight: "60px" }} />
          </div>
          <div style={{ textAlign: "right", fontSize: "11px", color: "#333", lineHeight: "1.6" }}>
            <div style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "5px" }}>HEAD OFFICE</div>
            <div>The Promenade, 5th Floor | General Mathenge Rd</div>
            <div>P.O. Box 43676-00100 | Nairobi | Kenya</div>
            <div style={{ marginTop: "5px" }}>
              <span style={{ marginRight: "15px" }}>T: 0711047000</span>
              <span style={{ marginRight: "15px" }}>M: 0790404571</span>
            </div>
            <div>W: www.aib-axysafrica.com</div>
          </div>
        </div>

        {/* Statement Title */}
        <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", marginBottom: "30px", color: "#00005b" }}>
          CLIENT STATEMENT
        </h2>

        {/* Client Information Section */}
        <div style={{ marginBottom: "30px" }}>
          <table style={{ width: "100%", marginBottom: "20px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 0", fontSize: "12px", fontWeight: "bold", width: "30%" }}>Client Code</td>
                <td style={{ padding: "8px 0", fontSize: "12px" }}>: {portfolio.client_code}</td>
                <td style={{ padding: "8px 0", fontSize: "12px", fontWeight: "bold", width: "30%" }}>Statement Date</td>
                <td style={{ padding: "8px 0", fontSize: "12px" }}>: {new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontSize: "12px", fontWeight: "bold" }}>Client Name</td>
                <td style={{ padding: "8px 0", fontSize: "12px" }}>: {portfolio.investor_name}</td>
                <td style={{ padding: "8px 0", fontSize: "12px", fontWeight: "bold" }}>Number of Holdings</td>
                <td style={{ padding: "8px 0", fontSize: "12px" }}>: {portfolio.holdings.length}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontSize: "12px", fontWeight: "bold" }}>Batches</td>
                <td style={{ padding: "8px 0", fontSize: "12px" }}>: {portfolio.unique_batches}</td>
                <td style={{ padding: "8px 0", fontSize: "12px", fontWeight: "bold" }}>Statement Period</td>
                <td style={{ padding: "8px 0", fontSize: "12px" }}>: MTD</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Account Summary Section */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "bold", background: "#f5f5f5", padding: "10px", margin: "0 0 10px 0" }}>
            Account Summary (USD)
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #00005b" }}>
                <th style={{ padding: "10px", textAlign: "left", fontSize: "12px", fontWeight: "bold" }}>Description</th>
                <th style={{ padding: "10px", textAlign: "right", fontSize: "12px", fontWeight: "bold" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontSize: "12px" }}>Total Principal Invested</td>
                <td style={{ padding: "10px", textAlign: "right", fontSize: "12px", fontFamily: "monospace", fontWeight: "bold" }}>
                  {formatCurrency(portfolio.total_principal)}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontSize: "12px" }}>Deposits (YTD)</td>
                <td style={{ padding: "10px", textAlign: "right", fontSize: "12px", fontFamily: "monospace" }}>
                  {formatCurrency(
                    portfolio.holdings.reduce((sum, h) => sum + (h.latest_valuation?.deposits || 0), 0)
                  )}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontSize: "12px" }}>Withdrawals (YTD)</td>
                <td style={{ padding: "10px", textAlign: "right", fontSize: "12px", fontFamily: "monospace" }}>
                  {formatCurrency(
                    portfolio.holdings.reduce((sum, h) => sum + (h.latest_valuation?.withdrawals || 0), 0)
                  )}
                </td>
              </tr>
              <tr style={{ borderBottom: "2px solid #00005b", background: "#f9f9f9" }}>
                <td style={{ padding: "10px", fontSize: "12px", fontWeight: "bold" }}>Current Balance</td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "right",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    color: "#00005b",
                  }}
                >
                  {formatCurrency(portfolio.current_balance)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", fontSize: "12px", fontWeight: "bold" }}>Profit/Loss</td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "right",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    color: portfolio.total_profit >= 0 ? "#00a651" : "#d32f2f",
                  }}
                >
                  {formatCurrency(portfolio.total_profit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Holdings Details Section */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "bold", background: "#f5f5f5", padding: "10px", margin: "0 0 10px 0" }}>
            Holdings Details
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #00005b" }}>
                <th style={{ padding: "10px", textAlign: "left", fontWeight: "bold" }}>Batch</th>
                <th style={{ padding: "10px", textAlign: "left", fontWeight: "bold" }}>Fund</th>
                <th style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Principal</th>
                <th style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Withdrawals</th>
                <th style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Current Value</th>
                <th style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Profit/Loss</th>
                <th style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Return %</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((holding, idx) => {
                const currentBalance = holding.latest_valuation?.end_balance || holding.total_principal;
                const withdrawals = holding.latest_valuation?.withdrawals || 0;
                const profit = holding.latest_valuation?.profit || 0;
                const performanceBase = holding.latest_valuation?.start_balance || holding.total_principal;
                const returnPct = performanceBase > 0 ? (profit / performanceBase) * 100 : 0;
                return (
                  <tr key={idx} style={{ borderBottom: "1px solid #ddd", background: idx % 2 === 0 ? "#fafafa" : "#fff" }}>
                    <td style={{ padding: "10px", fontFamily: "monospace" }}>{holding.batch_name}</td>
                    <td style={{ padding: "10px" }}>{holding.fund_name}</td>
                    <td style={{ padding: "10px", textAlign: "right", fontFamily: "monospace" }}>
                      {formatCurrency(holding.total_principal)}
                    </td>
                    <td 
                      style={{ 
                        padding: "10px", 
                        textAlign: "right", 
                        fontFamily: "monospace",
                        color: withdrawals > 0 ? "#d32f2f" : "var(--color-text-secondary)"
                      }}
                    >
                      {withdrawals > 0 ? "(" : ""}{formatCurrency(withdrawals)}{withdrawals > 0 ? ")" : ""}
                    </td>
                    <td style={{ padding: "10px", textAlign: "right", fontFamily: "monospace" }}>
                      {formatCurrency(currentBalance)}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "right",
                        fontFamily: "monospace",
                        color: profit >= 0 ? "#00a651" : "#d32f2f",
                        fontWeight: "bold",
                      }}
                    >
                      {formatCurrency(profit)}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "right",
                        fontFamily: "monospace",
                        color: returnPct >= 0 ? "#00a651" : "#d32f2f",
                        fontWeight: "bold",
                      }}
                    >
                      {returnPct.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Reconciliation Section */}
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "bold", background: "#f5f5f5", padding: "10px", margin: "0 0 10px 0" }}>
            Reconciliation
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px", fontWeight: "bold" }}>Opening Balance</td>
                <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace" }}>
                  {formatCurrency(
                    portfolio.holdings.reduce((sum, h) => {
                      const prev = h.latest_valuation?.start_balance || h.total_principal;
                      return sum + prev;
                    }, 0)
                  )}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px", fontWeight: "bold" }}>Deposits</td>
                <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace" }}>
                  {formatCurrency(
                    portfolio.holdings.reduce((sum, h) => sum + (h.latest_valuation?.deposits || 0), 0)
                  )}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px", fontWeight: "bold", color: "#d32f2f" }}>Withdrawals</td>
                <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace", color: "#d32f2f" }}>
                  ({formatCurrency(
                    portfolio.holdings.reduce((sum, h) => sum + (h.latest_valuation?.withdrawals || 0), 0)
                  )})
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px", fontWeight: "bold", color: "#00a651" }}>Performance/Profit</td>
                <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace", color: "#00a651" }}>
                  {formatCurrency(totalProfit)}
                </td>
              </tr>
              <tr style={{ background: "#f9f9f9", borderBottom: "2px solid #00005b" }}>
                <td style={{ padding: "10px", fontWeight: "bold", fontSize: "12px" }}>Closing Balance</td>
                <td style={{ padding: "10px", textAlign: "right", fontFamily: "monospace", fontWeight: "bold", fontSize: "12px", color: "#00005b" }}>
                  {formatCurrency(totalCurrentBalance)}
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: "10px", color: "#666", marginTop: "8px" }}>
            Formula: Opening + Deposits - Withdrawals + Profit = Closing Balance
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #ddd", fontSize: "10px", color: "#999" }}>
          <p style={{ margin: "0 0 5px 0" }}>
            <strong>Disclaimer:</strong> This statement is provided for informational purposes only. All figures are subject to change and may not reflect real-time data.
          </p>
          <p style={{ margin: "0" }}>Generated on: {new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .container-fluid {
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
