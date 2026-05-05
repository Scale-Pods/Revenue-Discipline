import sys

path = 'src/App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Finding the Total Spent block and appending the new dropdowns
old_block = """                                           <div className="bg-brand-primary/5 p-5 rounded-3xl border border-brand-primary/20 shadow-sm col-span-1 flex flex-col justify-center relative overflow-hidden group/total">
                                              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover/total:opacity-100 transition-opacity">
                                                 <div className={`w-1.5 h-1.5 rounded-full bg-brand-primary ${showInrTotal ? 'opacity-100' : 'opacity-30'}`}></div>
                                              </div>
                                              <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-3 opacity-70">Total Spent</p>
                                              <div className="relative h-8">
                                                 {!showInrTotal ? (
                                                    <p key="usd" className="text-2xl font-black text-white absolute inset-0 animate-in fade-in duration-700">
                                                       ${totalUsd.toFixed(2)}
                                                    </p>
                                                 ) : (
                                                    <p key="inr" className="text-2xl font-black text-emerald-400 absolute inset-0 animate-in fade-in duration-700">
                                                       ₹{totalInr ? totalInr.toFixed(0) : '---'}
                                                    </p>
                                                 )}
                                              </div>
                                           </div>"""

new_dropdowns = """
                                           {/* Job Status Dropdown */}
                                           <div className="bg-bg-card p-5 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/40 transition-colors col-span-1">
                                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 opacity-50">Job Status</p>
                                              <div className="relative">
                                                 <button 
                                                   onClick={() => setActiveDropdown(activeDropdown === 'upwork-status' ? null : 'upwork-status')}
                                                   className="w-full flex items-center justify-between bg-bg-main/50 px-4 py-2.5 rounded-xl border border-border-main hover:border-brand-primary/40 transition-all text-sm font-black text-text-main group"
                                                 >
                                                   <span>{selectedLead.upworkJobStatus || 'Open'}</span>
                                                   <ChevronRight size={16} className={`text-brand-primary transition-transform duration-300 ${activeDropdown === 'upwork-status' ? 'rotate-90' : ''}`} />
                                                 </button>
                                                 
                                                 {activeDropdown === 'upwork-status' && (
                                                   <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-main rounded-2xl shadow-2xl z-[110] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      {['Open', 'Closed'].map((status) => (
                                                         <button
                                                           key={status}
                                                           onClick={() => {
                                                              updateUpworkJobStatus(selectedLead.id, status);
                                                              setActiveDropdown(null);
                                                           }}
                                                           className={`w-full px-5 py-3 text-left text-xs font-bold transition-colors hover:bg-brand-primary/10 ${
                                                              (selectedLead.upworkJobStatus || 'Open') === status 
                                                                 ? 'text-brand-primary bg-brand-primary/5' 
                                                                 : 'text-text-muted hover:text-text-main'
                                                           }`}
                                                         >
                                                           {status}
                                                         </button>
                                                      ))}
                                                   </div>
                                                 )}
                                              </div>
                                           </div>

                                           {/* Outcome Dropdown */}
                                           <div className="bg-bg-card p-5 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/40 transition-colors col-span-1">
                                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 opacity-50">Outcome</p>
                                              <div className="relative">
                                                 <button 
                                                   onClick={() => setActiveDropdown(activeDropdown === 'upwork-outcome' ? null : 'upwork-outcome')}
                                                   className="w-full flex items-center justify-between bg-bg-main/50 px-4 py-2.5 rounded-xl border border-border-main hover:border-brand-primary/40 transition-all text-sm font-black text-text-main group"
                                                 >
                                                   <span className={
                                                     selectedLead.upworkOutcome === 'Got it' ? 'text-emerald-400' : 
                                                     selectedLead.upworkOutcome === "Didn't get it" ? 'text-rose-400' : ''
                                                   }>
                                                     {selectedLead.upworkOutcome || 'Pending'}
                                                   </span>
                                                   <ChevronRight size={16} className={`text-brand-primary transition-transform duration-300 ${activeDropdown === 'upwork-outcome' ? 'rotate-90' : ''}`} />
                                                 </button>
                                                 
                                                 {activeDropdown === 'upwork-outcome' && (
                                                   <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-main rounded-2xl shadow-2xl z-[110] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      {['Pending', 'Got it', "Didn't get it"].map((outcome) => (
                                                         <button
                                                           key={outcome}
                                                           onClick={() => {
                                                              updateUpworkOutcome(selectedLead.id, outcome);
                                                              setActiveDropdown(null);
                                                           }}
                                                           className={`w-full px-5 py-3 text-left text-xs font-bold transition-colors hover:bg-brand-primary/10 ${
                                                              (selectedLead.upworkOutcome || 'Pending') === outcome 
                                                                 ? 'text-brand-primary bg-brand-primary/5' 
                                                                 : 'text-text-muted hover:text-text-main'
                                                           }`}
                                                         >
                                                           {outcome}
                                                         </button>
                                                      ))}
                                                   </div>
                                                 )}
                                              </div>
                                           </div>"""

# Using a more robust replacement that handles potential whitespace variations
if old_block in content:
    content = content.replace(old_block, old_block + new_dropdowns)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replacement successful")
else:
    # Try a more flexible match if direct match fails
    print("Direct match failed, check whitespace")
    sys.exit(1)
