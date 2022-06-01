import { StatusBar } from "expo-status-bar";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Clipboard,
} from "react-native";
import { useWallet } from "./wallet";
import styled from "styled-components/native";
import { formatEther, useBalance } from "./token";
import ArgentX from "./icons/ArgentX.svg";
import AddFunds from "./icons/AddFunds.svg";
import SendFunds from "./icons/SendFunds.svg";
import PoweredBy from "./icons/PoweredBy.svg";
import { FC, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 48px;
  background-color: #161616;
`;

const Balance = styled.Text`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #fff;
`;

const Actions = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  max-width: 220px;
  width: 100%;
`;

const ShortAddressText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  color: #fff;
  border-radius: 13px;
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.15);
  overflow: hidden;
`;
const ShortAddress: FC<{ address?: string }> = ({ address }) => {
  if (!address) {
    return null;
  }

  return (
    <ShortAddressText onPress={() => Clipboard.setString(address)}>
      0x {address.substring(2, 6)} ... {address.substring(address.length - 4)}
    </ShortAddressText>
  );
};

const Space = styled.View<{ height: number }>`
  height: ${({ height }) => height}px;
`;

export default function Home() {
  const wallet = useWallet();
  const { navigate } = useNavigation();
  const { data: balance, mutate } = useBalance(wallet.address);
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#161616",
        minHeight: "100%",
      }}
    >
      <StatusBar style="light" />
      <ScrollView
        indicatorStyle="white"
        refreshControl={
          <RefreshControl
            tintColor="#fff"
            refreshing={isRefreshing}
            onRefresh={async () => {
              setIsRefreshing(true);
              await mutate();
              setIsRefreshing(false);
            }}
          />
        }
      >
        <Container>
          <ArgentX />
          <Space height={96} />
          <Balance>{formatEther(balance ?? 0)} ETH</Balance>
          <Space height={8} />
          <ShortAddress address={wallet.address} />
          <Space height={48} />
          <Actions>
            <AddFunds
              onPress={() => {
                navigate("Receive" as any);
              }}
            />
            <SendFunds
              onPress={() => {
                navigate("Send" as any);
              }}
            />
          </Actions>
          <Space height={96} />
          <PoweredBy />
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}
