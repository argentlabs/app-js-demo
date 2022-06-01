import Erc20Abi from "./abi/ERC20.json";
import {
  Abi,
  AccountInterface,
  Contract,
  defaultProvider,
  number,
  uint256,
} from "starknet";
import { Uint256 } from "starknet/dist/utils/uint256";
import { BigNumber, utils } from "ethers";
import useSWR from "swr";
import { BigNumberish } from "starknet/dist/utils/number";

const token = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
  address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  image: "https://dv3jj1unlp2jl.cloudfront.net/128/color/eth.png",
};

const etherContract = new Contract(
  Erc20Abi as Abi,
  token.address,
  defaultProvider
);

function getBalance(address: string): Promise<BigNumber> {
  return etherContract.balanceOf(address).then(([balance]: [Uint256]) => {
    return BigNumber.from(number.toHex(uint256.uint256ToBN(balance)));
  });
}

export const useBalance = (address?: string) => {
  return useSWR(address ? [address, "balance"] : undefined, getBalance, {
    suspense: false,
  });
};

export function transfer(
  fromAccount: AccountInterface,
  address: string,
  amount: BigNumberish
) {
  const transferBn = number.toBN(amount);
  etherContract.connect(fromAccount);
  return etherContract.transfer(address, uint256.bnToUint256(transferBn));
}

export function formatEther(amount: BigNumberish) {
  const [int, dec = "0"] = utils.formatEther(amount).split(".");
  return `${int}.${dec.substring(0, 6)}`;
}
