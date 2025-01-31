import { 
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can create new quest",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("quest-manager", "create-quest", 
        [types.ascii("Learn Clarity"), types.uint(100), types.uint(1000), types.uint(50)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    assertEquals(block.receipts[0].result, '(ok u0)');
  },
});

Clarinet.test({
  name: "Can complete and verify quest",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("quest-manager", "complete-quest", [types.uint(0)], wallet_1.address),
      Tx.contractCall("quest-verification", "verify-quest", [types.uint(0)], wallet_2.address)
    ]);
    
    assertEquals(block.receipts.length, 2);
    assertEquals(block.receipts[0].result, '(ok true)');
    assertEquals(block.receipts[1].result, '(ok true)');
  },
});
