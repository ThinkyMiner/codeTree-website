// codetree — Interactions
document.addEventListener('DOMContentLoaded', () => {

    // Wait for GSAP
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(initGSAP, 100);
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Scroll reveals
        document.querySelectorAll('[data-reveal]').forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
                y: 24,
                opacity: 0,
                duration: 0.6,
                delay: (i % 4) * 0.08,
                ease: 'power2.out'
            });
        });

        // Demo token bars
        const barBefore = document.querySelector('.bar-before');
        const barAfter = document.querySelector('.bar-after');
        if (barBefore) {
            barBefore.style.width = '0%';
            barAfter.style.width = '0%';
            gsap.to(barBefore, {
                scrollTrigger: { trigger: '.demo-terminal', start: 'top 70%', once: true },
                width: '100%',
                duration: 1,
                ease: 'power2.out'
            });
            gsap.to(barAfter, {
                scrollTrigger: { trigger: '.demo-terminal', start: 'top 70%', once: true },
                width: '4%',
                duration: 1,
                delay: 0.3,
                ease: 'power2.out'
            });
        }

        // Stat counters
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.getAttribute('data-count'));
            const obj = { val: 0 };
            gsap.to(obj, {
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                val: target,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => { el.textContent = Math.round(obj.val); }
            });
        });

        // Hero entrance
        const tl = gsap.timeline({ delay: 0.15 });
        tl.from('.hero-label', { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out' })
          .from('.hero-title', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
          .from('.hero-sub', { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25')
          .from('.hero-actions', { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
          .from('.hero-pitch', { y: 10, opacity: 0, duration: 0.35, ease: 'power2.out' }, '-=0.15');

        gsap.from('nav', { y: -15, opacity: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' });
    }

    initGSAP();


    // Tab switching (ecosystem + tools)
    document.querySelectorAll('.tab-btn, .tools-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.client-tabs') || btn.closest('.tools-tabs') || document;
            parent.querySelectorAll('.tab-btn, .tools-tab').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.tab-pane, .tools-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const pane = document.getElementById(btn.getAttribute('data-tab'));
            if (pane) pane.classList.add('active');
        });
    });


    // Copy to clipboard
    const copyBtn = document.querySelector('.copy-btn');
    const installCmd = document.querySelector('.install-cmd');

    if (copyBtn && installCmd) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(installCmd.innerText).then(() => {
                const copyIcon = copyBtn.querySelector('.copy-icon');
                const checkIcon = copyBtn.querySelector('.check-icon');
                if (copyIcon) copyIcon.style.display = 'none';
                if (checkIcon) checkIcon.style.display = 'block';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    if (copyIcon) copyIcon.style.display = 'block';
                    if (checkIcon) checkIcon.style.display = 'none';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });
    }


    // Demo tool cycling — all 23 tools
    const demoExamples = [
        {
            cmd: 'get_file_skeleton("calculator.py")',
            output: `class Calculator → line 4\n  "A scientific calculator with memory."\n  def __init__(self) → line 7\n  def add(self, a: float, b: float) → line 11\n    "Add two numbers."\n  def divide(self, a: float, b: float) → line 17\n    "Divide a by b, returns None on zero."\n  def sqrt(self, x: float) → line 24\n    "Square root using math.sqrt."`,
            tokens: '~80 tokens',
            barWidth: '4%'
        },
        {
            cmd: 'get_symbol("calculator.py", "divide")',
            output: `def divide(self, a: float, b: float):\n    """Divide a by b, returns None on zero."""\n    if b == 0:\n        return None\n    result = a / b\n    self.history.append(('divide', a, b, result))\n    return result`,
            tokens: '~45 tokens',
            barWidth: '2.2%'
        },
        {
            cmd: 'get_skeletons(["calc.py", "service.py"])',
            output: `── calc.py ──\nclass Calculator → line 4\n  def add(self, a, b) → line 11\n  def divide(self, a, b) → line 17\n\n── service.py ──\nclass MathService → line 3\n  def compute_sum(self, vals) → line 8\n  def compute_ratio(self, a, b) → line 15`,
            tokens: '~70 tokens',
            barWidth: '3.5%'
        },
        {
            cmd: 'get_symbols([{...}, {...}])',
            output: `── calculator.py:add ──\ndef add(self, a: float, b: float):\n    result = a + b\n    self.history.append(('add', a, b, result))\n    return result\n\n── service.py:compute_sum ──\ndef compute_sum(self, vals: list):\n    return sum(vals)`,
            tokens: '~55 tokens',
            barWidth: '2.7%'
        },
        {
            cmd: 'get_imports("service.py")',
            output: `line 1  from calculator import Calculator\nline 2  from typing import List, Optional\nline 3  import logging`,
            tokens: '~25 tokens',
            barWidth: '1.2%'
        },
        {
            cmd: 'find_references("Calculator")',
            output: `calculator.py:4      class Calculator\ntest_calc.py:8       calc = Calculator()\ntest_calc.py:15      assert isinstance(c, Calculator)\napp/service.py:22    from calculator import Calculator\napp/service.py:31    self.calc = Calculator()`,
            tokens: '~60 tokens',
            barWidth: '3%'
        },
        {
            cmd: 'get_call_graph("calculator.py", "divide")',
            output: `divide\n  calls:\n    → list.append\n  called by:\n    ← test_calc.test_divide\n    ← test_calc.test_divide_by_zero\n    ← service.compute_ratio`,
            tokens: '~45 tokens',
            barWidth: '2.2%'
        },
        {
            cmd: 'get_blast_radius("calculator.py", "add")',
            output: `Direct callers (2):\n  test_calc.py → test_add\n  service.py   → compute_sum\nTransitive (1):\n  app.py       → handle_request\n\n3 functions affected`,
            tokens: '~50 tokens',
            barWidth: '2.5%'
        },
        {
            cmd: 'get_complexity("calculator.py", "divide")',
            output: `Function: divide\nCyclomatic complexity: 2\n\nBranches:\n  line 19: if b == 0  (+1)\n\nRisk: LOW`,
            tokens: '~30 tokens',
            barWidth: '1.5%'
        },
        {
            cmd: 'find_dead_code("calculator.py")',
            output: `Dead symbols (defined but never referenced):\n\n  calculator.py:45  def _legacy_round(self, x)\n  calculator.py:52  def _format_result(self, r)\n\n2 unused symbols found`,
            tokens: '~35 tokens',
            barWidth: '1.7%'
        },
        {
            cmd: 'detect_clones()',
            output: `Clone pair (Type 2 — renamed vars):\n  calculator.py:11  add(self, a, b)\n  calculator.py:30  subtract(self, a, b)\n  Similarity: 94%\n\n1 clone pair found`,
            tokens: '~40 tokens',
            barWidth: '2%'
        },
        {
            cmd: 'search_symbols(query="calc", type="method")',
            output: `calculator.py:11   Calculator.add\n  "Add two numbers."\ncalculator.py:17   Calculator.divide\n  "Divide a by b, returns None on zero."\ncalculator.py:24   Calculator.sqrt\n  "Square root using math.sqrt."`,
            tokens: '~45 tokens',
            barWidth: '2.2%'
        },
        {
            cmd: 'find_tests("calculator.py", "divide")',
            output: `High confidence:\n  test_calc.py:20  test_divide\n    calls divide directly\n  test_calc.py:28  test_divide_by_zero\n    calls divide directly\n\n2 tests found`,
            tokens: '~40 tokens',
            barWidth: '2%'
        },
        {
            cmd: 'index_status()',
            output: `Graph: FRESH\nLast indexed: 2s ago\nFiles tracked: 14\nSymbols: 47\nEdges: 128\nCache: .codetree/graph.db (24 KB)`,
            tokens: '~30 tokens',
            barWidth: '1.5%'
        },
        {
            cmd: 'get_repository_map()',
            output: `Languages: Python (82%), JS (18%)\nEntry points:\n  app.py → main\n  cli.py → run\nHotspots:\n  calculator.py  (12 refs)\n  service.py     (8 refs)\nStats: 14 files, 47 symbols`,
            tokens: '~55 tokens',
            barWidth: '2.7%'
        },
        {
            cmd: 'resolve_symbol("add")',
            output: `#1  Calculator.add     calculator.py:11\n    method, 6 refs\n#2  Vector.add         geometry.py:44\n    method, 2 refs\n#3  add_route          router.py:8\n    function, 1 ref`,
            tokens: '~40 tokens',
            barWidth: '2%'
        },
        {
            cmd: 'search_graph(kind="class", min_degree=3)',
            output: `Calculator    calculator.py   12 connections\n  → 5 methods, called by 7 external\nMathService   service.py       8 connections\n  → 3 methods, called by 5 external\nRouter        router.py        4 connections\n  → 2 methods, called by 2 external`,
            tokens: '~55 tokens',
            barWidth: '2.7%'
        },
        {
            cmd: 'get_change_impact(diff_scope="staged")',
            output: `Changed: calculator.py → divide\nRisk: MEDIUM\n\nAffected callers:\n  ▲ service.compute_ratio  (direct)\n  ▲ app.handle_request     (transitive)\n\nAffected tests:\n  ✓ test_calc.test_divide\n  ✓ test_calc.test_divide_by_zero`,
            tokens: '~70 tokens',
            barWidth: '3.5%'
        },
        {
            cmd: 'analyze_dataflow("calculator.py", "divide")',
            output: `a ─→ result (line 21: a / b)\nb ─→ result (line 21: a / b)\nresult ─→ self.history (line 22: append)\nresult ─→ return (line 23)\n\nExternal sources: a, b (parameters)`,
            tokens: '~45 tokens',
            barWidth: '2.2%'
        },
        {
            cmd: 'find_hot_paths(top_n=3)',
            output: `#1  service.py:compute_ratio\n    complexity: 8  ×  calls: 14  =  score: 112\n#2  app.py:handle_request\n    complexity: 6  ×  calls: 11  =  score: 66\n#3  calculator.py:sqrt\n    complexity: 4  ×  calls: 9   =  score: 36`,
            tokens: '~55 tokens',
            barWidth: '2.7%'
        },
        {
            cmd: 'get_dependency_graph(format="mermaid")',
            output: `graph LR\n  app.py --> service.py\n  app.py --> router.py\n  service.py --> calculator.py\n  test_calc.py --> calculator.py\n  test_svc.py --> service.py`,
            tokens: '~40 tokens',
            barWidth: '2%'
        },
        {
            cmd: 'git_history(mode="churn", top_n=5)',
            output: `#1  calculator.py     42 commits  +1,204 / -387\n#2  service.py        28 commits  +856 / -201\n#3  app.py            21 commits  +634 / -178\n#4  test_calc.py      19 commits  +512 / -94\n#5  router.py         12 commits  +298 / -67`,
            tokens: '~50 tokens',
            barWidth: '2.5%'
        },
        {
            cmd: 'suggest_docs("calculator.py")',
            output: `Undocumented (3 functions):\n\n  calculator.py:30  subtract(self, a, b)\n    context: inverse of add, 4 callers\n  calculator.py:45  _legacy_round(self, x)\n    context: internal helper, unused\n  calculator.py:52  _format_result(self, r)\n    context: string formatting, 2 callers`,
            tokens: '~55 tokens',
            barWidth: '2.7%'
        }
    ];

    const cycleBlock = document.querySelector('.demo-cycle');
    if (cycleBlock) {
        const cmdText = cycleBlock.querySelector('.demo-cmd-text');
        const outputText = cycleBlock.querySelector('.demo-output-text');
        const tokenLabel = cycleBlock.querySelector('.label-after');
        const tokenBar = cycleBlock.querySelector('.bar-after');
        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % demoExamples.length;
            const example = demoExamples[currentIndex];

            // Fade out
            cycleBlock.classList.add('fading');

            setTimeout(() => {
                cmdText.textContent = example.cmd;
                outputText.textContent = example.output;
                tokenLabel.textContent = example.tokens;
                tokenBar.style.width = example.barWidth;

                // Fade in
                cycleBlock.classList.remove('fading');
            }, 350);
        }, 4000);
    }


    // Nav scroll
    const navEl = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navEl.style.borderBottomColor = '#d4d4d4';
        } else {
            navEl.style.borderBottomColor = '#e5e5e5';
        }
    }, { passive: true });

});
