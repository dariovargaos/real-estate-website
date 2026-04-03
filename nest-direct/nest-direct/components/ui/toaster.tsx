"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";

const TOAST_COOLDOWN_MS = 5000;
let _lastToastTime = 0;

const _toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
  max: 1,
});

// Wrap createToaster so that no new toast can be queued within 5 seconds
// of the previous one, preventing spam from repeated clicks.
export const toaster = {
  ..._toaster,
  create(options: Parameters<typeof _toaster.create>[0]): string {
    const now = Date.now();
    if (now - _lastToastTime < TOAST_COOLDOWN_MS) return "";
    _lastToastTime = now;
    return _toaster.create(options);
  },
};

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
