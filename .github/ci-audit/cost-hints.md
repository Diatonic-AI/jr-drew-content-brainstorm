# CI Cost Hints for Diatonic-AI/jr-drew-content-brainstorm

Failed runs (window): 28

## Longest failing jobs (minutes)
-  17.57m  build  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18924829909
-  11.77m  build  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18980673614
-  10.23m  Analyze (python)  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18982052445
-  10.23m  Analyze (python)  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18981147652
-   8.43m  build  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18981068102
-   3.67m  build  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18980867921
-   2.73m  Analyze (c-cpp)  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18981147652
-   2.37m  Analyze (c-cpp)  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18982052445
-   1.98m  build  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18980911443
-   1.32m  Analyze (javascript-typescript)  labels=['ubuntu-latest']  run=https://github.com/Diatonic-AI/jr-drew-content-brainstorm/actions/runs/18981147652

## Recommendations
- Add concurrency + cancel-in-progress to long-lived workflows (prevents duplicate runs)
- Add on:push paths filters to skip docs-only or non-code changes
- Consider scheduled workflows cadence (weekly/monthly instead of daily)
- Increase cache hit rates (setup-node/setup-python + actions/cache with lockfiles)
- Timeouts: set step/job-level timeouts to prevent runaway costs
- Reduce matrix size or shard by priority (nightly full matrix, PRs minimal)
