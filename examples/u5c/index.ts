import { Bip32PrivateKey, mnemonicToEntropy, wordlist, AssetName, PolicyId, TransactionInput, TransactionId } from "../../packages/blaze-core/dist/index.js";
import { HotWallet, Core, Blaze, Blockfrost, Maestro, U5C } from "../../packages/blaze-sdk/dist/index.js";

const provider = new U5C({
    url: "http://localhost:50051"
});


const mnemonic = "end link visit estate sock hurt crucial forum eagle earn idle laptop wheat rookie when hard suffer duty kingdom clerk glide mechanic debris jar";
const entropy = mnemonicToEntropy(mnemonic, wordlist);
const masterkey = Bip32PrivateKey.fromBip39Entropy(Buffer.from(entropy), "");

const wallet = await HotWallet.fromMasterkey(masterkey.hex(), provider);

const blaze = await Blaze.from(provider, wallet);
console.log("Balance", (await wallet.getBalance()).toCore());
const utxosResponse = await wallet.getUnspentOutputs();
const utxos = utxosResponse.map(utxo => utxo.toCbor().toString());

console.log("UTXOs", utxos);

const tx = await blaze.newTransaction()
    .payLovelace(
        Core.Address.fromBech32("addr_test1qrnrqg4s73skqfyyj69mzr7clpe8s7ux9t8z6l55x2f2xuqra34p9pswlrq86nq63hna7p4vkrcrxznqslkta9eqs2nsmlqvnk"),
        5_000_000n
    )
    .complete();

const signexTx = await blaze.signTransaction(tx);
console.log("signed tx", signexTx.toCbor().toString());

// const txId = await blaze.provider.postTransactionToChain(signexTx);
// console.log("waiting for confirmation", txId);

// while (true) {
//   const confirmed = await blaze.provider.awaitTransactionConfirmation(txId, 1000 * 60);
//   if (confirmed) {
//     break;
//   }
//   await new Promise(resolve => setTimeout(resolve, 1000));
// }

// console.log("transaction confirmed", txId);

// console.log("balance", (await wallet.getBalance()).toCore());
