<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Build NEURA on TanStack Start with client-safe `*.functions.ts` server-function entry points, server-only auth/data helpers, and feature-organized routes; this keeps server secrets out of the browser while separating student learning and administration workflows.
- Store authorization roles in a dedicated `user_roles` table and enforce them server-side and in row policies; roles must never be stored in profiles or trusted from client state.
