import { 
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Cannot create quest with invalid deadline",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("quest-manager", "create-quest", 
        [types.ascii("Learn Clarity"), types.uint(100), types.uint(1), types.uint(50)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[0].result, '(err u203)');
  },
});

Clarinet.test({
  name: "Can create quest with valid stake and deadline",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("quest-pulse-token", "mint", 
        [types.uint(1000), wallet_1.address],
        wallet_1.address
      ),
      Tx.contractCall("quest-manager", "create-quest", 
        [types.ascii("Learn Clarity"), types.uint(100), types.uint(1000), types.uint(50)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[1].result, '(ok u0)');
  },
});
