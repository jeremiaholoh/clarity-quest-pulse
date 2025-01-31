import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can verify an unverified quest",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("quest-verification", "verify-quest", 
        [types.uint(1)], 
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[0].result, '(ok true)');
  },
});

Clarinet.test({
  name: "Cannot verify an already verified quest", 
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("quest-verification", "verify-quest",
        [types.uint(1)],
        wallet_1.address
      ),
      Tx.contractCall("quest-verification", "verify-quest", 
        [types.uint(1)],
        wallet_1.address
      )
    ]);

    assertEquals(block.receipts[1].result, `(err u301)`);
  },
});
