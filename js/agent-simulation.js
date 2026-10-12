/* ==========================================================================
   ANTO JONES A B - INTERACTIVE AGENT LAB
   Simulation engine for LangGraph RCA, Text-to-SQL Analytics, and Claude Code Reviewer
   ========================================================================== */

(function () {
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const promptInput = document.getElementById('lab-prompt-input');
  const runBtn = document.getElementById('lab-run-btn');
  const terminalBody = document.getElementById('terminal-stream');
  const terminalStatus = document.getElementById('terminal-status');
  const nodesContainer = document.getElementById('nodes-diagram-container');

  let currentTab = 'rca';
  let isRunning = false;

  const SIMULATION_DATA = {
    rca: {
      defaultPrompt: "Investigate 34% spike in billing complaints in EU region for September",
      sampleQueries: [
        "Investigate 34% spike in billing complaints in EU region for September",
        "Diagnose 22% drop in 5G mobile data recharges across prepaid users",
        "Analyze unexpected packet drop in Lyca roaming partner gateway"
      ],
      nodes: [
        { id: 'node-user', name: 'User Query', type: 'Input', icon: 'fa-solid fa-terminal' },
        { id: 'node-planner', name: 'Planner Node', type: 'LangGraph Agent', icon: 'fa-solid fa-sitemap' },
        { 
          id: 'node-fanout', 
          name: "Send() API Fan-Out", 
          isFanout: true,
          subagents: [
            { id: 'sub-1', name: 'Hypothesis A: Roaming Tariff', icon: 'fa-solid fa-microchip' },
            { id: 'sub-2', name: 'Hypothesis B: Payment Gateway', icon: 'fa-solid fa-microchip' },
            { id: 'sub-3', name: 'Hypothesis C: Plan Expirations', icon: 'fa-solid fa-microchip' }
          ]
        },
        { id: 'node-synthesizer', name: 'Synthesizer Node', type: 'Report Gen', icon: 'fa-solid fa-wand-magic-sparkles' }
      ],
      steps: [
        { time: '0.00s', agent: 'LANGGRAPH_INIT', action: 'Initializing LangGraph StateGraph (GraphRuntime v0.2.14)' },
        { time: '0.12s', agent: 'PLANNER_AGENT', action: 'Analyzing question: parsing entities, metric anomalies, timeframe.' },
        { time: '0.45s', agent: 'PLANNER_AGENT', action: 'Generated 3 parallel investigative hypotheses. Invoking LangGraph Send() API...' },
        { time: '0.80s', agent: 'FANOUT_WORKER_1', action: 'Sub-agent 1 tool loop: execute fetch_data() on Amazon Redshift (500-row cap enforced).' },
        { time: '0.95s', agent: 'FANOUT_WORKER_2', action: 'Sub-agent 2 tool loop: querying partner payment webhook logs; zero error rate found.' },
        { time: '1.20s', agent: 'FANOUT_WORKER_3', action: 'Sub-agent 3 tool loop: checking promotional billing transition dates.' },
        { time: '1.55s', agent: 'FANOUT_WORKER_1', action: 'Evidence found: 89% of complaints correlate with Tariff Code EU-ROAM-98 mismatch.' },
        { time: '1.80s', agent: 'SELF_CORRECTION', action: 'Validating LLM JSON schema; verified valid structured JSON on first pass.' },
        { time: '2.10s', agent: 'SYNTHESIZER', action: 'Merged parallel findings. Generated executive Root Cause Report (70% analyst time saved).' }
      ]
    },
    analytics: {
      defaultPrompt: "Show average data usage and churn rate by plan for prepaid users in Q3",
      sampleQueries: [
        "Show average data usage and churn rate by plan for prepaid users in Q3",
        "Compare competitor pricing vs Lyca prepaid bundle across top 5 UK cities",
        "List top 100 postpaid accounts with negative balance in last 30 days"
      ],
      nodes: [
        { id: 'node-user', name: 'Natural Language Query', type: 'Input', icon: 'fa-solid fa-comment-dots' },
        { id: 'node-intent', name: 'Intent Classifier', type: 'FastAPI / LangGraph', icon: 'fa-solid fa-brain' },
        { id: 'node-tables', name: 'Schema Selector', type: '15+ Redshift Tables', icon: 'fa-solid fa-database' },
        { id: 'node-sqlgen', name: 'SQL Generator & Retry', type: '2x Self-Correction', icon: 'fa-solid fa-code' },
        { id: 'node-exec', name: 'Redshift & Synthesizer', type: 'AWS Redshift Client', icon: 'fa-solid fa-chart-line' }
      ],
      steps: [
        { time: '0.00s', agent: 'FASTAPI_GATEWAY', action: 'Received SSE query stream from LycaAI web portal.' },
        { time: '0.15s', agent: 'INTENT_AGENT', action: 'Intent classified: [Domain: Telecom Usage, Metrics: ARPU, Churn, Split: Prepaid].' },
        { time: '0.38s', agent: 'SCHEMA_ROUTER', action: 'Mapped query to 3 Redshift tables: dim_customer, fact_data_usage, dim_plan.' },
        { time: '0.72s', agent: 'SQL_AGENT', action: 'Generated Redshift dialect SQL with JOIN conditions and date filtering.' },
        { time: '1.10s', agent: 'VALIDATOR', action: 'Dry-run syntax validation passed. 0 SQL syntax hallucinations detected.' },
        { time: '1.45s', agent: 'REDSHIFT_CLIENT', action: 'Executed against AWS Redshift cluster. Returned 14 records in 32ms.' },
        { time: '1.80s', agent: 'SYNTHESIZER', action: 'Synthesizing natural language executive answer with tabular chart breakdown.' }
      ]
    },
    code_reviewer: {
      defaultPrompt: "Review pull request #142 for potential race conditions and AWS IAM privilege leaks",
      sampleQueries: [
        "Review pull request #142 for potential race conditions and AWS IAM privilege leaks",
        "Inspect FastAPI repository for unhandled exceptions in SSE streaming endpoint",
        "Audit Dockerfile & ECS task definition for CIS compliance and root privileges"
      ],
      nodes: [
        { id: 'node-trigger', name: 'PR Event / CLI Trigger', type: 'GitHub / S3 Event', icon: 'fa-brands fa-github' },
        { id: 'node-bedrock', name: 'Claude Agent SDK', type: 'AWS Bedrock Engine', icon: 'fa-solid fa-robot' },
        { 
          id: 'node-tools', 
          name: "Agent Autonomous Tools", 
          isFanout: true,
          subagents: [
            { id: 'tool-glob', name: 'Glob: Scan Repo Structure', icon: 'fa-solid fa-folder-tree' },
            { id: 'tool-grep', name: 'Grep: Pattern Search', icon: 'fa-solid fa-magnifying-glass' },
            { id: 'tool-read', name: 'Read: Inspect File AST', icon: 'fa-solid fa-file-code' }
          ]
        },
        { id: 'node-sse', name: 'FastAPI SSE Streamer', type: 'Dual-Mode ECS Worker', icon: 'fa-solid fa-satellite-dish' }
      ],
      steps: [
        { time: '0.00s', agent: 'DUAL_MODE_RUNNER', action: 'Detected environment: Production ECS Task (HMAC session token validated).' },
        { time: '0.20s', agent: 'CLAUDE_AGENT_SDK', action: 'Invoking Claude 3.5 Sonnet on AWS Bedrock with autonomous tool loop.' },
        { time: '0.50s', agent: 'TOOL_CALL:Glob', action: 'Tool execution Glob("**/*.py") -> 48 files discovered.' },
        { time: '0.85s', agent: 'TOOL_CALL:Grep', action: 'Tool execution Grep("boto3.client") -> 6 IAM credential usages identified.' },
        { time: '1.20s', agent: 'TOOL_CALL:Read', action: 'Tool execution Read("services/auth.py", lines 45-80) -> Analyzing token lifecycle.' },
        { time: '1.60s', agent: 'SECURITY_AUDIT', action: 'Identified 1 missing mutex lock in async queue consumer (potential race condition).' },
        { time: '1.95s', agent: 'SSE_STREAM', action: 'Streaming structured Markdown review with actionable code diffs to developer.' }
      ]
    }
  };

  function renderNodes(tabKey) {
    const data = SIMULATION_DATA[tabKey];
    if (!data || !nodesContainer) return;

    let html = '';
    data.nodes.forEach((node, index) => {
      if (node.isFanout) {
        html += `
          <div class="connector-line" id="conn-${index}"><i class="fa-solid fa-chevron-down"></i></div>
          <div class="subagents-fanout-row">
            ${node.subagents.map(sub => `
              <div class="agent-node" id="${sub.id}">
                <div class="node-icon-box"><i class="${sub.icon}"></i></div>
                <div class="node-info">
                  <h5>${sub.name}</h5>
                  <p>Parallel Worker</p>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        if (index > 0) {
          html += `<div class="connector-line" id="conn-${index}"><i class="fa-solid fa-chevron-down"></i></div>`;
        }
        html += `
          <div class="agent-node" id="${node.id}">
            <div class="node-icon-box"><i class="${node.icon}"></i></div>
            <div class="node-info">
              <h5>${node.name}</h5>
              <p>${node.type}</p>
            </div>
          </div>
        `;
      }
    });

    nodesContainer.innerHTML = html;
  }

  function appendTerminalLine(time, agent, action, type = 'normal') {
    if (!terminalBody) return;
    const lineEl = document.createElement('div');
    lineEl.className = 'term-line';
    
    let actionClass = 'term-action';
    if (type === 'success') actionClass = 'term-success';
    if (type === 'warn') actionClass = 'term-warn';

    lineEl.innerHTML = `
      <span class="term-time">[${time}]</span>
      <span class="term-agent">${agent}:</span>
      <span class="${actionClass}">${action}</span>
    `;
    terminalBody.appendChild(lineEl);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function runSimulation() {
    if (isRunning) return;
    isRunning = true;
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing...';
    terminalStatus.innerHTML = '<span class="status-dot"></span> Agent Pipeline Active';
    terminalStatus.style.color = 'var(--accent-cyan)';

    // Reset visual nodes
    document.querySelectorAll('.agent-node').forEach(n => {
      n.classList.remove('active', 'completed');
    });
    document.querySelectorAll('.connector-line').forEach(c => {
      c.classList.remove('active');
    });

    terminalBody.innerHTML = '';
    const data = SIMULATION_DATA[currentTab];
    const steps = data.steps;

    appendTerminalLine('0.00s', 'SYSTEM', `Launching simulation for "${promptInput.value.trim() || data.defaultPrompt}"`, 'warn');

    let currentStepIdx = 0;
    const stepInterval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const step = steps[currentStepIdx];
        const isLast = currentStepIdx === steps.length - 1;
        appendTerminalLine(step.time, step.agent, step.action, isLast ? 'success' : 'normal');

        // Highlight nodes according to step progression
        if (currentTab === 'rca') {
          if (currentStepIdx === 0) highlightNode('node-user');
          if (currentStepIdx === 1) highlightNode('node-planner');
          if (currentStepIdx >= 3 && currentStepIdx <= 5) {
            highlightNode('sub-1');
            highlightNode('sub-2');
            highlightNode('sub-3');
          }
          if (currentStepIdx >= 6) {
            highlightNode('node-synthesizer');
          }
        } else if (currentTab === 'analytics') {
          if (currentStepIdx === 0) highlightNode('node-user');
          if (currentStepIdx === 1) highlightNode('node-intent');
          if (currentStepIdx === 2) highlightNode('node-tables');
          if (currentStepIdx === 3) highlightNode('node-sqlgen');
          if (currentStepIdx >= 5) highlightNode('node-exec');
        } else if (currentTab === 'code_reviewer') {
          if (currentStepIdx === 0) highlightNode('node-trigger');
          if (currentStepIdx === 1) highlightNode('node-bedrock');
          if (currentStepIdx >= 2 && currentStepIdx <= 4) {
            highlightNode('tool-glob');
            highlightNode('tool-grep');
            highlightNode('tool-read');
          }
          if (currentStepIdx >= 5) highlightNode('node-sse');
        }

        currentStepIdx++;
      } else {
        clearInterval(stepInterval);
        isRunning = false;
        runBtn.disabled = false;
        runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Agent Simulation';
        terminalStatus.innerHTML = '<i class="fa-solid fa-check"></i> Execution Complete (Status 200 OK)';
        terminalStatus.style.color = '#10b981';

        // Add summary block
        const summary = document.createElement('div');
        summary.className = 'term-json';
        if (currentTab === 'rca') {
          summary.innerHTML = `<strong>✨ Final Synthesized Report:</strong><br>Root Cause Identified: Tariff Code EU-ROAM-98 mismatched default quota.<br>Confidence: 98.4% | Hypotheses Tested: 3 parallel | Latency: 2.10s (vs 3.5 hrs manual)`;
        } else if (currentTab === 'analytics') {
          summary.innerHTML = `<strong>📊 Query Synthesis Completed:</strong><br>Generated Redshift SQL executed in 32ms.<br>Result: Prepaid users churn rate: 4.8% (-1.2% QoQ) | Avg Data: 18.4 GB/mo.`;
        } else {
          summary.innerHTML = `<strong>🛡️ Agentic Review Generated:</strong><br>Security findings: 1 race condition identified in async worker.<br>Recommendation: Add asyncio.Lock() to task dequeue pipeline.`;
        }
        terminalBody.appendChild(summary);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    }, 420);
  }

  function highlightNode(nodeId) {
    const el = document.getElementById(nodeId);
    if (el) {
      el.classList.add('active');
      setTimeout(() => {
        el.classList.add('completed');
      }, 350);
    }
  }

  // Switch tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isRunning) return;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.getAttribute('data-tab');

      const data = SIMULATION_DATA[currentTab];
      promptInput.value = data.defaultPrompt;
      renderNodes(currentTab);
      terminalBody.innerHTML = `
        <div class="term-line">
          <span class="term-time">[0.00s]</span>
          <span class="term-agent">READY:</span>
          <span class="term-action">Pipeline initialized for ${currentTab.toUpperCase()}. Click "Run Agent Simulation" to observe real-time agent choreography.</span>
        </div>
      `;
      terminalStatus.innerHTML = '<span class="status-dot"></span> Ready';
      terminalStatus.style.color = 'var(--accent-cyan)';
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', runSimulation);
  }

  // Initial render
  renderNodes('rca');
  if (promptInput) {
    promptInput.value = SIMULATION_DATA.rca.defaultPrompt;
  }
})();
