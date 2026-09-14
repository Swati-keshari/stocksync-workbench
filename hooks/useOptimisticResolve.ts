"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUiStore } from "@/stores/useUiStore";
import type { ReconciliationItem } from "@/lib/types";

/**
 * Optimistic remove-on-resolve, matching the sequence diagram in the spec:
 * 1. user clicks Resolve
 * 2. row is optimistically removed from the ['reconciliation-items'] cache
 * 3. simulated API call fires
 * 4a. success → cache stays as-is, toast confirms
 * 4b. failure → previous cache snapshot is restored, error toast shown,
 *     and TanStack Query's built-in retry/backoff takes over automatically.
 */
export function useOptimisticResolve() {
  const queryClient = useQueryClient();
  const pushToast = useUiStore((s) => s.pushToast);
  const closeDrawer = useUiStore((s) => s.closeDrawer);
  const clearSelection = useUiStore((s) => s.clearSelection);

  return useMutation({
    mutationFn: (id: string) => api.resolveItem(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["reconciliation-items"] });
      const prev = queryClient.getQueryData<ReconciliationItem[]>(["reconciliation-items"]);

      // Optimistically remove the row from the GRID immediately — but
      // deliberately do NOT close the drawer here. The drawer reads from
      // this same cache, so closing it now (or letting its item lookup go
      // undefined) would unmount it before the user ever sees a
      // pending/retrying state — the mutation would appear to do nothing
      // for several seconds. The drawer stays open, keeps its last-known
      // copy of the item (see DetailDrawer), and only closes explicitly
      // on confirmed success below.
      queryClient.setQueryData<ReconciliationItem[]>(["reconciliation-items"], (old) =>
        (old ?? []).filter((item) => item.id !== id)
      );

      return { prev };
    },

    onError: (_err, id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["reconciliation-items"], context.prev);
      }
      // NOTE: by the time onError fires, TanStack Query's built-in
      // mutation retries (configured in lib/queryClient.ts) have already
      // run and been exhausted — there is no more retrying happening at
      // this point, so the toast must not claim there is. The drawer (if
      // still open — see onMutate, which deliberately does not close it)
      // will reflect the restored item on its own once the cache above is
      // rolled back, but the toast still needs to name the SKU in case the
      // user already navigated away from it.
      const sku = context?.prev?.find((item) => item.id === id)?.sku ?? id;
      pushToast(`${sku} failed to resolve after 3 attempts — restored to the queue`, "error");
    },

    onSuccess: () => {
      pushToast("Item resolved", "success");
      clearSelection();
      closeDrawer();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reconciliation-items"] });
    },
  });
}
