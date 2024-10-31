import { AptosClient } from "aptos";
import { type Action } from "./Action";
import { AbstractActionComponent } from "./Action/action-components";

export interface ActionContext {
  originalUrl: string;
  action: Action;
  actionType: "trusted" | "malicious" | "unknown";
  triggeredLinkedAction: AbstractActionComponent;
}

export interface IncomingActionConfig {
  rpcUrl: string;
  adapter: Pick<ActionAdapter, "connect" | "signTransaction">;
}

export interface ActionAdapter {
  connect: (context: ActionContext) => Promise<string | null>;
  signTransaction: (
    tx: string,
    context: ActionContext
  ) => Promise<{ signature: string } | { error: string }>;
  confirmTransaction: (
    signature: string,
    context: ActionContext
  ) => Promise<void>;
  isSupported?: (
    context: Omit<ActionContext, "triggeredLinkedAction">
  ) => Promise<boolean>;
}

export class ActionConfig implements ActionAdapter {
  private static readonly CONFIRM_TIMEOUT_MS = 60000 * 1.2; // 20% extra time
  private client: AptosClient;

  constructor(
    rpcUrl: string,
    private adapter: IncomingActionConfig["adapter"]
  ) {
    if (!rpcUrl) {
      throw new Error("rpcUrl is required");
    }

    this.client = new AptosClient(rpcUrl);
  }

  async connect(context: ActionContext) {
    try {
      return await this.adapter.connect(context);
    } catch {
      return null;
    }
  }

  async signTransaction(tx: string, context: ActionContext) {
    return this.adapter.signTransaction(tx, context);
  }

  async confirmTransaction(signature: string): Promise<void> {
    return new Promise<void>((res, rej) => {
      const start = Date.now();

      const confirm = async () => {
        if (Date.now() - start >= ActionConfig.CONFIRM_TIMEOUT_MS) {
          rej(new Error("Unable to confirm transaction: timeout reached"));
          return;
        }

        try {
          const status = await this.client.getTransactionByHash(signature);

          // Check if the transaction status is not yet confirmed or if there's an error.
          if (status?.type === "pending") {
            // If the transaction is still pending, wait and retry
            setTimeout(confirm, 3000);
          } else if (status?.type === "committed") {
            // Transaction is successful
            res();
          } else if (status?.type === "rejected") {
            // Transaction failed
            rej(
              new Error(
                "Transaction execution failed, check wallet for details"
              )
            );
          }
        } catch (e) {
          console.error(
            "[@dialectlabs/blinks] Error confirming transaction",
            e
          );
          rej(new Error("Error confirming transaction"));
        }
      };

      confirm();
    });
  }
}
