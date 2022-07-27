import { useState } from "react";
import { ethers } from "ethers";
import ERC721Contract from "../contracts_artf/ERC721_Price.json";

const CONTRACT_CONFIG = {
  network: 4,
  network_name: "rinkeby",
  address: "0x731BE8394dD3EE32339B7e7DE7217d9d5c67Ff5d",
  abi: ERC721Contract["abi"],
};

// this is test comment

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [account, setAccount] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      signer.getAddress().then((account) => {
        setAccount(account);
      });
      const { chainId } = await provider.getNetwork();
      if (chainId != CONTRACT_CONFIG["network"]) {
        alert(
          `wrong network! please switch to ${CONTRACT_CONFIG["network_name"]}`
        );
      }
    } else {
      alert("window.ethereum not available");
    }
  }

  async function mint() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const { chainId } = await provider.getNetwork();
    if (chainId != CONTRACT_CONFIG["network"]) {
      alert(
        `wrong network! please switch to ${CONTRACT_CONFIG["network_name"]}`
      );
    } else {
      try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_CONFIG["address"],
          CONTRACT_CONFIG["abi"],
          signer
        );

        const ethersToSend = 0.05 * parseInt(amount);
        const options = {
          value: ethers.utils.parseEther(ethersToSend.toString()),
        };
        const tx = await contract
          .mint(parseInt(amount), options)
          .then((status) => {
            alert("Hold on tight!");
          });
        await tx.wait();
        alert("Mint successful!");
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  return (
    <div className="relative pt-6 pb-16 sm:pb-24">
      <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
        <div className="text-center">
          <button
            onClick={connectWallet}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
          >
            {account ? account : "Connect Wallet"}
          </button>

          {account && (
            <>
              <div className="mt-5 max-w-md mx-auto md:mt-8">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    onChange={(e) => setAmount(e.target.value)}
                    className="py-3 px-4 outline block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <button
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    onClick={mint}
                  >
                    Mint
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
