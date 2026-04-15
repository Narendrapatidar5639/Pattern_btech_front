import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  FileText, 
  Sparkles,
  Loader2,
  ArrowLeft,
  Zap,
  ExternalLink,
  Globe,
  Layers,
  ShieldCheck,
  Bot,
  Search,
  MessageSquare,
  History,
  X,
  Cpu,
  Database,
  Terminal
} from "lucide-react";
import { Button } from "../components/ui/button";
import { GlassCard } from "../components/GlassCard";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from "recharts";
import { toast } from "sonner";

// --- Types & Interfaces ---
interface AnalysisResponse {
  topics: Record<string, number>;
  questions: Record<string, number>;
  metadata: { 
    paper_count: number; 
    analyzed_ids: number[];
    subject?: string;
    semester?: string;
  };
}

// DYNAMIC URL: Local vs Production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? "http://127.0.0.1:8000/api" 
  : "https://narendrapatidarbtai-btech-backend.hf.space/api";

export function AnalysisDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPaperIds, subjectName, semester, university } = location.state || {};
  
  // --- States ---
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);

  // --- Logic: Fetch Data ---
  useEffect(() => {
    const performAnalysis = async () => {
      if (!selectedPaperIds || selectedPaperIds.length === 0) {
        toast.error("Neural session expired.");
        navigate("/selection");
        return;
      }
      try {
        setLoading(true);
        const idsString = selectedPaperIds.join(",");
        const response = await fetch(`${API_BASE_URL}/dashboard/?paperIds=${idsString}`);
        
        if (!response.ok) throw new Error("Engine offline.");
        
        const result = await response.json();
        setAnalysisData(result);
        toast.success("Neural Link Established");
      } catch (err: any) {
        console.error("Fetch error:", err);
        toast.error("Uplink failed: Check Backend.");
      } finally {
        // Extended loading for visual "Syncing" effect
        setTimeout(() => setLoading(false), 2500); 
      }
    };
    performAnalysis();
  }, [selectedPaperIds, navigate]);

  // --- Data Transformation for Charts ---
  // Ensuring frequency is handled as a number and sorted descending
  const topicFrequencyData = useMemo(() => {
    if (!analysisData?.topics) return [];
    
    return Object.entries(analysisData.topics)
      .map(([topic, freq]) => ({
        topic: topic.length > 15 ? topic.substring(0, 12) + ".." : topic,
        fullTopic: topic,
        hits: Number(freq) || 1, // Ensure it's a number
      }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 10);
  }, [analysisData]);

  const questionsList = useMemo(() => {
    if (!analysisData?.questions) return [];
    return Object.entries(analysisData.questions)
      .map(([q, h]) => [q, Number(h)] as [string, number])
      .sort((a, b) => b[1] - a[1]); 
  }, [analysisData]);

  const weightage = [
    { name: "Core Syllabus", value: 65, color: "#6366f1" },
    { name: "Repeating", value: 25, color: "#a855f7" },
    { name: "Elective", value: 10, color: "#1e293b" },
  ];

  // --- Feature: Download Logic ---
  const handleDownloadReport = () => {
    if (!analysisData) return;
    setIsGenerating(true);
    toast.loading("Encrypting Neural Report...");
    
    setTimeout(() => {
      try {
        const text = `PATTERN BTECH - NEURAL ANALYSIS REPORT\n
------------------------------------------
Subject: ${subjectName}
Semester: ${semester}
University: ${university}
Generated: ${new Date().toLocaleString()}
------------------------------------------\n
TOPIC PRIORITY LIST:
${Object.entries(analysisData.topics).sort((a,b) => b[1]-a[1]).map(([t, c]) => `[${c} Hits] ${t}`).join('\n')}\n
IMPORTANT REPEATED QUESTIONS:
${Object.entries(analysisData.questions).sort((a,b) => b[1]-a[1]).map(([q, h]) => `(Repeated ${h} times) Q: ${q}`).join('\n\n')}
\n------------------------------------------
End of Neural Transcript`;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Neural_Analysis_${subjectName}.txt`;
        a.click();
        toast.dismiss();
        toast.success("Report Downloaded Successfully");
      } catch (err) {
        toast.error("Export Protocol Failed.");
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };

  const redirectAITool = async (tool: 'chatgpt' | 'perplexity' | 'google') => {
    if (!selectedQuestion) return;
    const fullPrompt = `Act as an expert B.Tech professor. Explain this question in detail for ${subjectName} as per ${university} examination standards: "${selectedQuestion}". Include key diagrams descriptions, points, and relevant formulas.`;
    
    try { await navigator.clipboard.writeText(fullPrompt); } catch (e) {}

    let url = "";
    switch(tool) {
      case 'chatgpt': url = `https://chatgpt.com/?q=${encodeURIComponent(fullPrompt)}`; break;
      case 'perplexity': url = `https://www.perplexity.ai/search?q=${encodeURIComponent(fullPrompt)}`; break;
      case 'google': url = `https://www.google.com/search?q=${encodeURIComponent(selectedQuestion)}`; break;
    }
    window.open(url, "_blank");
    setShowAIModal(false);
  };

  // --- LOADING VIEW ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#02020a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center">
          <div className="relative mb-10 flex justify-center">
            <div className="absolute w-44 h-44 rounded-full border border-indigo-500/20 animate-[spin_4s_linear_infinite]" />
            <div className="absolute w-44 h-44 rounded-full border-t-2 border-indigo-500 animate-[spin_1.5s_linear_infinite]" />
            <motion.div 
              className="w-32 h-32 bg-indigo-600/5 rounded-[2.5rem] border border-white/5 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.15)] overflow-hidden"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            >
              <img src="/logo.png" alt="PatternBTech" className="w-20 h-20 object-contain brightness-125" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-[0.4em] uppercase italic">Neural Sync</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
          </div>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-6">Connecting to Pattern Nodes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02020a] text-slate-300 p-4 md:p-10 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-white/5">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-6">
               <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                 <Terminal className="w-3 h-3" /> System Live
               </span>
               <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Verified by Pattern Engine</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter leading-[0.85] mb-6">
              NEURAL <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">INSIGHTS</span>
            </h1>
            <div className="flex flex-wrap gap-3 mt-8">
               <div className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-black text-gray-400 flex items-center gap-3 uppercase tracking-tighter">
                  <Globe className="w-4 h-4 text-indigo-500" /> {subjectName}
               </div>
               <div className="px-6 py-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">
                  SEM {semester} • {university}
               </div>
            </div>
          </motion.div>

          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none h-16 rounded-3xl border-white/10 bg-white/5 text-white hover:bg-white/10 uppercase font-black tracking-widest px-8" onClick={() => navigate("/selection")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button disabled={isGenerating} onClick={handleDownloadReport} className="flex-1 md:flex-none h-16 rounded-3xl bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white px-10 uppercase font-black tracking-widest shadow-2xl shadow-indigo-600/20 transition-all">
              {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              Export Report
            </Button>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { l: "Processed Papers", v: analysisData?.metadata.paper_count || 0, i: Database, c: "text-indigo-500" },
            { l: "Extracted Topics", v: Object.keys(analysisData?.topics || {}).length, i: Layers, c: "text-fuchsia-500" },
            { l: "Pattern Matches", v: questionsList.length, i: Zap, c: "text-amber-500" },
            { l: "Engine Accuracy", v: "99.1%", i: Cpu, c: "text-emerald-500" },
          ].map((m, i) => (
            <GlassCard key={i} className="p-8 border-white/5 bg-white/[0.02] rounded-[2rem] group hover:border-indigo-500/30 transition-all">
               <m.i className={`w-10 h-10 ${m.c} mb-6 group-hover:rotate-12 transition-transform`} />
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">{m.l}</p>
               <h3 className="text-4xl font-black text-white italic">{m.v}</h3>
            </GlassCard>
          ))}
        </section>

        {/* --- CHARTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="lg:col-span-2 p-10 border-white/5 bg-white/[0.02] rounded-[3rem]">
            <div className="flex items-center justify-between mb-12">
               <h3 className="text-2xl font-black text-white uppercase italic">Topic Hit Distribution</h3>
               <BarChart3 className="text-indigo-500 w-6 h-6" />
            </div>
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicFrequencyData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                     <XAxis dataKey="topic" stroke="#1e293b" tick={{fill: '#475569', fontSize: 9, fontWeight: 900}} axisLine={false} tickLine={false} />
                     <YAxis stroke="#1e293b" tick={{fill: '#475569', fontSize: 10}} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#050510', border: '1px solid #1e293b', borderRadius: '20px', fontSize: '12px'}} />
                     <Bar dataKey="hits" fill="#4f46e5" radius={[12, 12, 4, 4]} barSize={45} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-10 border-white/5 bg-white/[0.02] rounded-[3rem] flex flex-col justify-between">
            <h3 className="text-2xl font-black text-white uppercase italic mb-8">Priority Index</h3>
            <div className="h-[250px] relative">
               <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                     <Pie data={weightage} innerRadius={70} outerRadius={95} paddingAngle={10} dataKey="value" stroke="none">
                        {weightage.map((e, i) => <Cell key={i} fill={e.color} />)}
                     </Pie>
                  </RePieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-500 mb-1" />
                  <span className="text-xs font-black text-white tracking-widest">CORE</span>
               </div>
            </div>
            <div className="space-y-4 mt-6">
               {weightage.map((s, i) => (
                 <div key={i} className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,1)]" style={{backgroundColor: s.color}} />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.name}</span>
                    </div>
                    <span className="text-xs font-black text-white italic">{s.value}%</span>
                 </div>
               ))}
            </div>
          </GlassCard>
        </div>

        {/* --- MAIN CONTENT SECTIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-32">
          
          {/* SECTION 1: TOPICS (Now First) */}
          <div className="space-y-8 order-1 lg:order-1">
             <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
                  <Sparkles className="text-indigo-400 w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Neural Keynotes</h3>
             </div>
             <GlassCard className="p-10 border-white/5 bg-white/[0.01] rounded-[3rem] space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Layers className="w-32 h-32" />
                </div>
                {topicFrequencyData.map((t, idx) => (
                  <div key={idx} className="space-y-4 relative z-10">
                     <div className="flex justify-between items-end">
                        <span className="text-xs font-black uppercase text-white tracking-tight">{t.fullTopic}</span>
                        <span className="text-[10px] font-black text-indigo-400 uppercase">{t.hits} Mentions</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.02]">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${Math.min((t.hits / (analysisData?.metadata.paper_count || 1)) * 100, 100)}%` }} 
                          className="h-full bg-gradient-to-r from-indigo-600 to-fuchsia-600" 
                          transition={{ duration: 1.5, delay: idx * 0.1 }}
                        />
                     </div>
                  </div>
                ))}
                
                <div className="mt-12 p-8 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 relative">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 italic">Neural Conclusion</h4>
                   <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                     "Engine detected significant pattern overlap in <b>{subjectName}</b>. Mastery of top-indexed clusters is highly recommended for upcoming evaluations."
                   </p>
                </div>
             </GlassCard>
          </div>

          {/* SECTION 2: QUESTIONS (Now Second) */}
          <div className="space-y-8 order-2 lg:order-2">
            <div className="flex items-center gap-4 px-2">
               <div className="w-12 h-12 rounded-2xl bg-fuchsia-600/10 flex items-center justify-center border border-fuchsia-500/20">
                  <TrendingUp className="text-fuchsia-400 w-6 h-6" />
               </div>
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Repeated Patterns</h3>
            </div>
            <div className="space-y-6">
              {questionsList.length > 0 ? (
                questionsList.map(([q, hits], idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all" />
                    <p className="text-lg font-bold text-gray-200 mb-10 leading-snug group-hover:text-white transition-colors">"{q}"</p>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                       <div className="flex items-center gap-4">
                          <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                             <Zap className="w-3 h-3 fill-indigo-400" /> {hits} Appearances
                          </div>
                          <History className="w-4 h-4 text-gray-700" />
                       </div>
                       <Button 
                         onClick={() => { setSelectedQuestion(q); setShowAIModal(true); }}
                         className="w-full sm:w-auto h-14 rounded-2xl bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white font-black uppercase text-[10px] tracking-widest px-8 transition-all active:scale-95"
                       >
                         View Answer <ExternalLink className="w-3 h-3 ml-2" />
                       </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                   <Loader2 className="w-10 h-10 text-gray-800 mx-auto mb-4" />
                   <p className="text-gray-600 font-black uppercase text-xs tracking-widest">No Pattern Data Found</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* --- AI SELECTION MODAL --- */}
        <AnimatePresence>
          {showAIModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowAIModal(false)} />
              <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative w-full max-w-sm">
                <GlassCard className="p-8 border-white/10 bg-[#050510] rounded-[3rem] shadow-[0_0_100px_rgba(79,70,229,0.2)]">
                   <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-4">
                         <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-500">
                            <Bot className="w-6 h-6" />
                         </div>
                         <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">AI Oracle</h3>
                      </div>
                      <button onClick={() => setShowAIModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="text-gray-500 w-5 h-5" />
                      </button>
                   </div>
                   
                   <div className="space-y-4">
                      {[
                        { id: 'chatgpt', label: 'ChatGPT', icon: MessageSquare, col: 'text-emerald-500', sub: 'Best for point-wise answers' },
                        { id: 'perplexity', label: 'Perplexity AI', icon: Globe, col: 'text-blue-400', sub: 'Real-time academic search' },
                        { id: 'google', label: 'Google Search', icon: Search, col: 'text-amber-500', sub: 'Standard web results' },
                      ].map((tool) => (
                        <button key={tool.id} onClick={() => redirectAITool(tool.id as any)} className="w-full p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 flex items-center gap-5 group transition-all">
                          <tool.icon className={`w-6 h-6 ${tool.col} group-hover:scale-110 transition-transform`} />
                          <div className="text-left">
                            <p className="text-sm font-black text-white uppercase tracking-tight">{tool.label}</p>
                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{tool.sub}</p>
                          </div>
                        </button>
                      ))}
                   </div>
                   
                   <div className="mt-8 text-center">
                      <p className="text-[8px] text-gray-700 uppercase font-black tracking-[0.3em]">Neural Prompt Copied to Clipboard</p>
                   </div>
                </GlassCard>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}