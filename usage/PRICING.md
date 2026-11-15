# Token pricing (estimates)
Updated: 2026-11-14
<!-- Read by Wakil Desktop to turn the tokens recorded in Claude Code's local session logs into an estimated
     credit / cost per agent, task and project. Prices are Anthropic API list prices in USD per million tokens
     (source: Anthropic model table, 2026-11). With a Claude subscription you do not pay per token: read the
     amounts as the API-equivalent value of the work. Edit the table when prices change.

     "Model" is matched as a prefix of the model id written in the logs (the longest match wins).
     Cache write 5m = 1.25 × input, cache write 1h = 2 × input (standard prompt-caching multipliers). -->

| Model | Input | Output | Cache write 5m | Cache write 1h | Cache read |
|---|---|---|---|---|---|
| claude-fable-5-2 | 8.00 | 40.00 | 10.00 | 16.00 | 0.20 |
| claude-mythos-5-2 | 8.00 | 40.00 | 10.00 | 16.00 | 0.20 |
| claude-fable-5 | 10.00 | 50.00 | 12.50 | 20.00 | 1.00 |
| claude-mythos-5 | 10.00 | 50.00 | 12.50 | 20.00 | 1.00 |
| claude-opus-5-5 | 4.00 | 20.00 | 5.00 | 8.00 | 0.20 |
| claude-opus-5 | 5.00 | 25.00 | 6.25 | 10.00 | 0.50 |
| claude-opus-4 | 5.00 | 25.00 | 6.25 | 10.00 | 0.50 |
| claude-sonnet-5-5 | 2.00 | 10.00 | 2.50 | 4.00 | 0.10 |
| claude-sonnet-5 | 2.00 | 10.00 | 2.50 | 4.00 | 0.20 |
| claude-sonnet-4 | 3.00 | 15.00 | 3.75 | 6.00 | 0.30 |
| claude-haiku-5-5 | 0.10 | 0.50 | 0.125 | 0.20 | 0.01 |
| claude-haiku-4 | 1.00 | 5.00 | 1.25 | 2.00 | 0.10 |

## Notes
- Claude Code keeps its session logs in `%USERPROFILE%\.claude\projects\<this folder>\` and deletes old ones after
  `cleanupPeriodDays` (30 by default). To keep a longer usage history, raise `cleanupPeriodDays` in your user settings
  (`%USERPROFILE%\.claude\settings.json`), e.g. `"cleanupPeriodDays": 365`.
- Usage is linked to a task by the first line of each specialist brief: `TASK: <entity>/<project>/<task-id>`.
  Older briefs are matched by their `Client:` / `Project:` lines and the Trello card URL or title.
