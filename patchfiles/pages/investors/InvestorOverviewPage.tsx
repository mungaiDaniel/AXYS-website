import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { KPICard } from "@/components/data/KPICard";
import { ChartCard } from "@/components/charts/ChartCard";
import { FundPerformanceLineChart } from "@/components/charts/FundPerformanceLineChart";
import { PortfolioAUMChart } from "@/components/charts/PortfolioAUMChart";
import { DepositsWithdrawalsBarChart } from "@/components/charts/DepositsWithdrawalsBarChart";
import { FundAllocationDoughnut } from "@/components/charts/FundAllocationDoughnut";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { getFundColor, FLOW_COLORS } from "@/lib/chartConfig";
import { ROUTES } from "@/lib/constants";
import { investmentService } from "@/services/investmentService";
import { reportService } from "@/services/reportService";
import { toast } from "sonner";
import { ArrowLeft, Eye, Download } from "lucide-react";

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
    batch_type?: string;
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

export default function InvestorOverviewPage() {
  const { clientCode } = useParams<{ clientCode: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<InvestorPortfolio | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [statements, setStatements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatement, setSelectedStatement] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      if (!clientCode) return;
      setLoading(true);
      try {
        const res = await investmentService.getInvestorPortfolio(clientCode);
        const histRes = await investmentService.getInvestorHistory(clientCode);
        
        if (res.status === 200 && res.data && (res.data as any).holdings) {
          setPortfolio(res.data as any);
        } else {
          toast.error("Could not load investor portfolio");
        }
        if (histRes.status === 200 && histRes.data) {
          setHistory(histRes.data as any[]);
        }
        
        const stmtRes = await investmentService.getInvestorStatements(clientCode);
        if (stmtRes.status === 200 && stmtRes.data) {
          setStatements(stmtRes.data as any[]);
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
        <div
          className="spinner-border"
          style={{ color: "var(--color-brand-400)", width: "1.5rem", height: "1.5rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-10">
        <p style={{ color: "var(--color-text-tertiary)" }}>Investor not found</p>
        <button
          onClick={() => navigate(ROUTES.INVESTORS)}
          className="btn btn-sm btn-outline-secondary mt-3"
        >
          Back to investors
        </button>
      </div>
    );
  }

  // ── Calculate KPIs ──
  const totalCurrentBalance = portfolio.current_balance ?? portfolio.holdings.reduce(
    (sum, h) => sum + (h.latest_valuation?.end_balance || h.total_principal),
    0
  );
  const totalProfit = portfolio.total_profit ?? totalCurrentBalance - portfolio.total_principal;
  // Calculate totalNetOpening properly across all latest holding valuations
  const totalNetOpening = portfolio.holdings.reduce(
    (sum, h) => sum + ((h.latest_valuation?.start_balance || 0) - (h.latest_valuation?.withdrawals || 0)),
    0
  );
  
  const profitPercentage =
    totalNetOpening > 0
      ? ((totalProfit / totalNetOpening) * 100).toFixed(2)
      : "0.00";
  const profitTrend = totalProfit > 0 ? "up" : totalProfit < 0 ? "down" : "neutral";

  // ── Build chart data ──
  const holdingsByFund = portfolio.holdings.reduce(
    (acc, h) => {
      const key = h.fund_name;
      if (!acc[key]) {
        acc[key] = {
          name: h.fund_name,
          principal: 0,
          current: 0,
          profit: 0,
          deposits: 0,
          withdrawals: 0,
          performance: 0,
        };
      }
      acc[key].principal += h.total_principal;
      acc[key].current += h.latest_valuation?.end_balance || h.total_principal;
      acc[key].profit += h.latest_valuation?.profit || 0;
      acc[key].deposits += h.latest_valuation?.deposits || 0;
      acc[key].withdrawals += h.latest_valuation?.withdrawals || 0;
      return acc;
    },
    {} as Record<string, any>
  );

  const fundData = Object.values(holdingsByFund);
  const fundNames = fundData.map((f) => f.name);

  // Fund performance data (Chronological line chart)
  const perfData = {
    labels: history.length > 0 ? history.map((h) => h.month_name) : ["No data"],
    funds: [
      {
        name: "Performance Rate",
        data: history.length > 0 ? history.map((h) => h.performance_pct) : [0],
      },
    ],
  };

  // Time-Series Growth data (Chronological Area Chart)
  const aumData = {
    labels: history.length > 0 ? history.map((h) => h.month_name) : ["No data"],
    funds: [
      {
        name: "Total Portfolio",
        data: history.length > 0 ? history.map((h) => h.end_balance) : [0],
        growth: history.length > 0 ? history.map((h) => h.performance_pct) : [0],
      },
    ],
  };

  // Deposits vs withdrawals data (Chronological bar chart)
  const flowData = {
    labels: history.length > 0 ? history.map((h) => h.month_name) : ["No data"],
    deposits: history.length > 0 ? history.map((h) => h.deposits) : [0],
    withdrawals: history.length > 0 ? history.map((h) => h.withdrawals) : [0],
  };

  // Fund allocation data (by current value)
  const latestPerFund = fundData.map((f) => ({ name: f.name, value: f.current }));
  const allocData = {
    funds: latestPerFund.length > 0 ? latestPerFund : [{ name: "No data", value: 0 }],
  };

  return (
    <div className="container-fluid px-0">
      {/* Back button */}
      <button
        onClick={() => navigate(ROUTES.INVESTORS)}
        className="d-flex align-items-center gap-1 mb-3 btn btn-link p-0 text-decoration-none"
        style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}
      >
        <ArrowLeft size={14} /> Back to investors
      </button>

      {/* Header */}
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div>
          <h1 className="fw-bold" style={{ color: "var(--color-text-primary)", fontSize: "22px" }}>
            {portfolio.investor_name}
          </h1>
          <p className="mb-0 mt-1" style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
            Client Code: <span style={{ fontFamily: "var(--font-mono)" }}>{portfolio.client_code}</span>
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.INVESTOR_STATEMENT(portfolio.client_code))}
          className="btn btn-sm"
          style={{ background: "var(--color-brand-400)", color: "#fff" }}
        >
          View Statement
        </button>
      </div>

      {selectedStatement && (
        <StatementDetailModal 
          statement={selectedStatement} 
          onClose={() => setSelectedStatement(null)}
          clientCode={clientCode || ""}
        />
      )}

      {/* Batch Breakdown Summary ── */}
      {portfolio.holdings.length > 0 && (
        <div className="row g-3 mb-4">
          {(() => {
            // Group holdings by batch_id
            const holdingsByBatch: Record<number, typeof portfolio.holdings> = {};
            portfolio.holdings.forEach((h) => {
              const batchId = h.batch_id;
              if (!holdingsByBatch[batchId]) {
                holdingsByBatch[batchId] = [];
              }
              holdingsByBatch[batchId].push(h);
            });

            const batchEntries = Object.entries(holdingsByBatch).sort(
              (a, b) => parseInt(a[0]) - parseInt(b[0])
            );

            return batchEntries.map(([batchId, batchHoldings]) => {
              const batchTotalPrincipal = batchHoldings.reduce(
                (sum, h) => sum + h.total_principal,
                0
              );
              const batchTotalBalance = batchHoldings.reduce(
                (sum, h) => sum + (h.latest_valuation?.end_balance || h.total_principal),
                0
              );
              const batchProfit = batchTotalBalance - batchTotalPrincipal;
              const batchType = batchHoldings[0]?.batch_type || "Fresh Start";
              const batchName = batchHoldings[0]?.batch_name || `Batch ${batchId}`;
              const batchLabel = batchName; 
              
              // We'll calculate a distinct color per batchId to give them visual separation
              const colorPalette = ['#4682B4', '#87CEEB', '#50C878', '#9370DB', '#F4A460'];
              const batchColor = colorPalette[batchId % colorPalette.length];

              return (
                <div key={batchId} className="col-12">
                  <div
                    className="card shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, rgba(70,130,180,0.1) 0%, rgba(100,150,210,0.05) 100%)",
                      borderLeft: `4px solid ${batchColor}`
                    }}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title mb-3 fw-bold" style={{ fontSize: "14px" }}>
                            {batchLabel}
                          </h5>
                          <div className="row g-4">
                            <div className="col">
                              <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "4px" }}>
                                Principal
                              </div>
                              <div style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-mono)" }}>
                                {formatCurrency(batchTotalPrincipal)}
                              </div>
                            </div>
                            <div className="col">
                              <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "4px" }}>
                                Current Balance
                              </div>
                              <div style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-mono)", color: "var(--color-success)" }}>
                                {formatCurrency(batchTotalBalance)}
                              </div>
                            </div>
                            <div className="col">
                              <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "4px" }}>
                                Profit/Loss
                              </div>
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  fontFamily: "var(--font-mono)",
                                  color: batchProfit >= 0 ? "var(--color-success)" : "var(--color-destructive)"
                                }}
                              >
                                {(batchProfit >= 0 ? "+" : "")}{formatCurrency(batchProfit)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* KPI row — 4 equal cols ── */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-sm-6">
          <KPICard
            label="Total Invested (Principal)"
            value={formatCurrency(portfolio.total_principal)}
            valueSize="1.5rem"
            subtitle={`${portfolio.unique_batches} batch${portfolio.unique_batches !== 1 ? "es" : ""}`}
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <KPICard
            label="Current Balance"
            value={formatCurrency(totalCurrentBalance)}
            valueSize="1.5rem"
            trend={{ value: `+${formatCurrencyCompact(totalProfit)}`, direction: totalProfit >= 0 ? "up" : "down" }}
            subtitle={`Latest valuation`}
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <KPICard
            label="Profit/Loss"
            value={formatCurrency(totalProfit)}
            valueSize="1.5rem"
            trend={{ value: `${profitPercentage}%`, direction: profitTrend as "up" | "down" | "neutral" }}
            subtitle="Cumulative performance"
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <KPICard
            label="Active Funds"
            value={String(fundNames.length)}
            valueSize="1.5rem"
            subtitle={`${portfolio.holdings.length} holding${portfolio.holdings.length !== 1 ? "s" : ""}`}
          />
        </div>
      </div>

      {/* Charts 2×2 — two equal cols ── */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <ChartCard
            title="Fund performance (%)"
            subtitle="Performance rate over time"
            legend={[{ label: "Performance Rate", color: "#00005b" }]}
          >
            <FundPerformanceLineChart data={perfData} height={300} />
          </ChartCard>
        </div>
        <div className="col-lg-6">
          <ChartCard
            title="Portfolio AUM"
            subtitle="Time-series growth"
            legend={[{ label: `Total AUM ${formatCurrencyCompact(totalCurrentBalance)}`, color: "#00005b" }]}
          >
            <PortfolioAUMChart data={aumData} height={300} />
          </ChartCard>
        </div>
        <div className="col-lg-6">
          <ChartCard
            title="Deposits vs withdrawals"
            subtitle="Inflows and outflows over time"
            legend={[
              { label: "Deposits", color: FLOW_COLORS.deposit },
              { label: "Withdrawals", color: FLOW_COLORS.withdrawal },
            ]}
          >
            <DepositsWithdrawalsBarChart data={flowData} height={300} />
          </ChartCard>
        </div>
        <div className="col-lg-6">
          <ChartCard
            title="Fund allocation"
            subtitle="Current capital distribution"
            legend={latestPerFund.map((f) => {
              const tot = latestPerFund.reduce((s, x) => s + x.value, 0);
              const pct = tot > 0 ? ((f.value / tot) * 100).toFixed(1) : "0";
              return { label: `${f.name} ${pct}%`, color: getFundColor(f.name) };
            })}
          >
            <FundAllocationDoughnut data={allocData} />
          </ChartCard>
        </div>
      </div>

      {/* Holdings table */}
      <div className="card shadow overflow-hidden">
        {/* Table header bar */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="fw-bold mb-0" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
            Holdings
          </h3>
          <span style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>
            {portfolio.holdings.length} position{portfolio.holdings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Bootstrap table-dark */}
        <div className="table-responsive">
          <table className="table table-dark mb-0" style={{ background: "var(--color-bg-surface)" }}>
            <thead>
              <tr>
                {[
                  "Batch",
                  "Fund",
                  "Opening Amount",
                  "Withdrawals",
                  "Current Standing",
                  "Profit/Loss",
                  "Performance",
                  "Epoch End",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign:
                        h === "Opening Amount" ||
                        h === "Withdrawals" ||
                        h === "Current Standing" ||
                        h === "Profit/Loss" ||
                        h === "Performance"
                          ? "right"
                          : "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((holding) => {
                const openingAmount = holding.latest_valuation?.start_balance ?? holding.total_principal;
                const withdrawals = holding.latest_valuation?.withdrawals || 0;
                const currentBalance = holding.latest_valuation?.end_balance || holding.total_principal;
                const profit = holding.latest_valuation?.profit || 0;
                const performanceBase = holding.latest_valuation?.start_balance || holding.total_principal;
                const performance =
                  performanceBase > 0
                    ? ((profit / performanceBase) * 100).toFixed(2)
                    : "0.00";
                const epochEnd = holding.latest_valuation?.epoch_end
                  ? new Date(holding.latest_valuation.epoch_end).toLocaleDateString()
                  : "—";

                return (
                  <tr key={`${holding.batch_id}-${holding.fund_name}`}>
                    <td>
                      <button
                        onClick={() => navigate(ROUTES.BATCH_DETAIL(holding.batch_id))}
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ fontSize: "13px", color: "var(--color-brand-400)" }}
                      >
                        {holding.batch_name}
                      </button>
                    </td>
                    <td style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>
                      {holding.fund_name}
                    </td>
                    <td
                      className="text-end"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}
                    >
                      {formatCurrency(openingAmount)}
                    </td>
                    <td
                      className="text-end"
                      style={{ 
                        fontFamily: "var(--font-mono)", 
                        fontSize: "12px", 
                        color: withdrawals > 0 ? "#d32f2f" : "var(--color-text-secondary)"
                      }}
                    >
                      {withdrawals > 0 ? "(" : ""}{formatCurrency(withdrawals)}{withdrawals > 0 ? ")" : ""}
                    </td>
                    <td
                      className="text-end"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}
                    >
                      {formatCurrency(currentBalance)}
                    </td>
                    <td
                      className="text-end"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: profit >= 0 ? "var(--color-success)" : "var(--color-destructive)",
                      }}
                    >
                      {formatCurrency(profit)}
                    </td>
                    <td
                      className="text-end"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: parseFloat(performance) >= 0 ? "var(--color-success)" : "var(--color-destructive)",
                      }}
                    >
                      {performance}%
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                      {epochEnd}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Statements */}
      <div className="card shadow overflow-hidden mt-4 mb-5">
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="fw-bold mb-0" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
            Historical Statements
          </h3>
          <span style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>
            {statements.length} record{statements.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-dark mb-0" style={{ background: "var(--color-bg-surface)" }}>
            <thead>
              <tr>
                {["Date", "Statement / Event", "Fund", "Deposits", "Opening Amount", "Withdrawals", "Profit", "Closing Balance", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-uppercase"
                    style={{
                      fontSize: "10px",
                      color: "var(--color-text-tertiary)",
                      textAlign: h === "Date" || h === "Statement / Event" || h === "Fund" ? "left" : "right"
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statements.map((stmt, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                    {new Date(stmt.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ fontSize: "13px", fontWeight: stmt.type === "MONTHLY_REPORT" ? "600" : "400" }}>
                    {stmt.label}
                  </td>
                  <td style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
                    {stmt.fund_name}
                  </td>
                  <td className="text-end" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: stmt.deposits > 0 ? "var(--color-success)" : "var(--color-text-tertiary)" }}>
                    {stmt.deposits > 0 ? formatCurrency(stmt.deposits) : "—"}
                  </td>
                  <td className="text-end" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                    {formatCurrency(stmt.opening_balance)}
                  </td>
                  <td className="text-end" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-destructive)" }}>
                    {stmt.withdrawals > 0 ? formatCurrency(stmt.withdrawals) : "—"}
                  </td>
                  <td className="text-end" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: stmt.profit >= 0 ? "var(--color-success)" : "var(--color-destructive)" }}>
                    {stmt.type === "MONTHLY_REPORT" ? formatCurrency(stmt.profit) : "—"}
                  </td>
                  <td className="text-end" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "600" }}>
                    {formatCurrency(stmt.end_balance)}
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        className="btn btn-sm p-1 transition-colors"
                        style={{ background: "rgba(255,255,255,0.05)", color: "var(--color-brand-400)" }}
                        title="View Statement"
                        onClick={() => {
                          setSelectedStatement(stmt);
                        }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-sm p-1 transition-colors"
                        style={{ background: "rgba(255,255,255,0.05)", color: "var(--color-brand-400)" }}
                        title="Download PDF"
                        onClick={async () => {
                          if (!clientCode) return;
                          try {
                             toast.loading("Preparing PDF...");
                             if (stmt.type === "WITHDRAWAL" && stmt.withdrawal_id) {
                               await reportService.downloadWithdrawalReceipt(clientCode, stmt.withdrawal_id);
                             } else if (stmt.type === "DEPOSIT" && stmt.batch_id) {
                               // Download deposit receipt for deposit events
                               await reportService.downloadDepositReceipt(clientCode, stmt.batch_id);
                             } else {
                               // Download general investor statement
                               await reportService.downloadInvestorStatementByClientCode(clientCode, stmt.date);
                             }
                             toast.dismiss();
                             toast.success("Downloaded successfully");
                          } catch (err) {
                             toast.dismiss();
                             toast.error("Failed to download PDF. Please try again or contact support if the issue persists.");
                          }
                        }}
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {statements.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-5" style={{ color: "var(--color-text-tertiary)" }}>
                    No historical statements found for this investor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatementDetailModal({ statement, onClose, clientCode }: { statement: any, onClose: () => void, clientCode: string }) {
  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered" 
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="modal-content overflow-hidden" 
          style={{ 
            background: "var(--color-bg-surface)", 
            color: "white", 
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          }}
        >
          <div className="modal-header border-0 pb-0 px-4 pt-4">
            <div>
              <h5 className="modal-title font-bold text-white mb-1">
                {statement.type === 'WITHDRAWAL' ? 'Withdrawal Detail' : 'Monthly Performance'}
              </h5>
              <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }} className="mb-0">
                {statement.label} • {statement.fund_name || 'All Funds'}
              </p>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white shadow-none" 
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body p-4">
            <div className="d-flex flex-column gap-3">
              <div 
                className="p-3 rounded-xl d-flex justify-content-between align-items-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>Opening Balance</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600" }}>{formatCurrency(statement.opening_balance)}</span>
              </div>
              
              <div 
                className="p-3 rounded-xl d-flex justify-content-between align-items-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>Deposits</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "var(--color-success)" }}>
                  {statement.deposits > 0 ? `+${formatCurrency(statement.deposits)}` : formatCurrency(0)}
                </span>
              </div>

              <div 
                className="p-3 rounded-xl d-flex justify-content-between align-items-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>Withdrawals</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "var(--color-destructive)" }}>
                  {statement.withdrawals > 0 ? `-${formatCurrency(statement.withdrawals)}` : formatCurrency(0)}
                </span>
              </div>

              {statement.type === 'MONTHLY_REPORT' && (
                <div 
                  className="p-3 rounded-xl d-flex justify-content-between align-items-center"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="d-flex flex-column">
                    <span style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>Performance Profit</span>
                    <span style={{ fontSize: "11px", color: "var(--color-brand-400)" }}>Applied Rate: {statement.performance_rate}%</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "var(--color-success)" }}>
                    {statement.profit >= 0 ? `+${formatCurrency(statement.profit)}` : formatCurrency(statement.profit)}
                  </span>
                </div>
              )}

              <div 
                className="p-3 rounded-xl d-flex justify-content-between align-items-center mt-2"
                style={{ background: "var(--color-brand-600)", boxShadow: "0 10px 20px -5px rgba(0, 23, 191, 0.3)" }}
              >
                <span className="text-white-50" style={{ fontSize: "14px" }}>Closing Balance</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "18px" }}>{formatCurrency(statement.end_balance)}</span>
              </div>
            </div>
          </div>
          
          <div className="modal-footer border-0 p-4 pt-0">
            <button 
              className="btn w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              style={{ background: "rgba(255,255,255,0.05)", color: "white", borderRadius: "10px" }}
              onClick={async () => {
                try {
                  toast.loading("Preparing PDF...");
                  if (statement.type === "WITHDRAWAL" && statement.withdrawal_id) {
                    await reportService.downloadWithdrawalReceipt(clientCode, statement.withdrawal_id);
                  } else if (statement.type === "DEPOSIT" && statement.batch_id) {
                    await reportService.downloadDepositReceipt(clientCode, statement.batch_id);
                  } else {
                    await reportService.downloadInvestorStatementByClientCode(clientCode, statement.date);
                  }
                  toast.dismiss();
                } catch (e) {
                  toast.dismiss();
                  toast.error("Failed to generate PDF");
                }
              }}
            >
              <Download size={16} />
              Download Official Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
